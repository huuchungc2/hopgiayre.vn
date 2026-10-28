import React from 'react';
import Link from 'next/link';
import { hopgiayreApi } from '../api/hopgiayre';
import { assetUrl } from '../api/client';
import { categoryHref } from '../utils/format';
import { ProductCard } from '../components/ProductCard';
import { BlogCard } from '../components/BlogCard';
import { QuickQuoteWidget } from '../components/QuickQuoteWidget';
import { HeroBannerSlider } from '../components/HeroBannerSlider';
import { BentoGridFeatures } from '../components/BentoGridFeatures';
import { FaqSection } from '../components/FaqSection';
import { ArrowRight, CheckCircle2, Flame, Layers, Sparkles, Factory, ShieldCheck, Clock, Palette } from 'lucide-react';
import type { Category, Product, Blog, Banner } from '../types/domain';

export const revalidate = 3600; // ISR cache 1 hour

interface HomeData {
  banners: Banner[];
  products: Product[];
  categories: Category[];
  blogs: Blog[];
}

function cleanCategoryTitle(name: string): string {
  return name
    .replace(/^In\s+/i, '')
    .replace(/,\s*Giá Rẻ/i, '')
    .replace(/,\s*Chất Lượng/i, '')
    .trim();
}

async function getHomeData(): Promise<HomeData> {
  try {
    const [banners, hotProducts, categories, blogs] = await Promise.all([
      hopgiayreApi.getBanners('main', 1, 6).catch(() => ({ list_data: [] })),
      hopgiayreApi.getProducts({ pageIndex: 1, itemPerPage: 8, sortBy: 'hot' }).catch(() => ({ list_data: [] })),
      hopgiayreApi.getCategories(true).catch(() => []),
      hopgiayreApi.getBlogs('article', 1, 3, '1').catch(() => ({ list_data: [] })),
    ]);
    return {
      banners: (banners.list_data || []) as Banner[],
      products: (hotProducts.list_data || []) as Product[],
      categories: (categories || []) as Category[],
      blogs: (blogs.list_data || []) as Blog[],
    };
  } catch {
    return {
      banners: [],
      products: [],
      categories: [],
      blogs: [],
    };
  }
}

export default async function HomePage() {
  const data = await getHomeData();

  // Curate top categories that have realistic images
  const validCategories = data.categories.filter((cat) => Boolean(cat.image && cat.image.trim() !== ''));
  const displayCategories = validCategories.slice(0, 8);

  // Filter Tet Gift Box products
  const tetProducts = data.products.filter((p) => /tết|tet/i.test(p.name));
  const generalProducts = data.products.filter((p) => !/tết|tet/i.test(p.name));

  return (
    <div className="space-y-12 sm:space-y-16 pb-16">
      {/* Hero Showcase Section */}
      <section className="bg-gradient-to-b from-slate-50 via-slate-50/50 to-white pt-6 pb-10 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
          {/* Main Hero Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Left: Dynamic Packaging Slider */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <HeroBannerSlider banners={data.banners} />
            </div>

            {/* Right: Instant Packaging Quote Form */}
            <div className="lg:col-span-5 flex flex-col justify-center">
              <QuickQuoteWidget />
            </div>
          </div>

          {/* 4 Value-Proposition Trust Badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 pt-2">
            <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 flex items-center gap-3 shadow-card hover:shadow-card-hover transition-all">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                <Factory className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">Xưởng Sản Xuất 2.000m²</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Giá gốc, rẻ hơn 20%</p>
              </div>
            </div>

            <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 flex items-center gap-3 shadow-card hover:shadow-card-hover transition-all">
              <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                <Palette className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">Thiết Kế 3D Miễn Phí</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Test mẫu trước khi in</p>
              </div>
            </div>

            <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 flex items-center gap-3 shadow-card hover:shadow-card-hover transition-all">
              <div className="w-10 h-10 rounded-lg bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">In Từ Số Lượng Ít</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Nhận đơn từ 100 hộp</p>
              </div>
            </div>

            <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 flex items-center gap-3 shadow-card hover:shadow-card-hover transition-all">
              <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">Giao Hàng 24h - 48h</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Đổi mới 100% nếu lỗi</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Danh Mục Sản Phẩm
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1 tracking-tight">
              Các Dòng Hộp Giấy & Bao Bì Chủ Lực
            </h2>
          </div>
          <Link
            href="/san-pham"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            <span>Xem tất cả danh mục</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {displayCategories.map((cat) => (
            <Link
              key={cat.id}
              href={categoryHref(cat)}
              className="group bg-white border border-slate-200/90 rounded-xl p-4 sm:p-5 flex flex-col items-center text-center shadow-card hover:shadow-card-hover hover:border-emerald-500/50 transition-all duration-300"
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-slate-50 p-2 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <img
                  src={assetUrl(cat.image || cat.icon, '/images/logo.svg')}
                  alt={cat.name}
                  loading="lazy"
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
                {cleanCategoryTitle(cat.name)}
              </h3>
              <span className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                <Layers className="w-3 h-3 text-emerald-600" />
                {cat.subs?.length ? `${cat.subs.length} quy cách` : 'Báo giá theo yêu cầu'}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Dedicated Tet Gift Box Section (Vỏ Hộp Quà Tết Doanh Nghiệp) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-br from-red-50 via-amber-50/40 to-white border border-red-200/80 rounded-3xl p-6 sm:p-8 shadow-card relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-red-600 bg-red-100/80 px-3 py-1 rounded-full">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                Dòng Sản Phẩm Chủ Lực Doanh Nghiệp
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
                Xưởng Sản Xuất Vỏ Hộp Quà Tết 2026 Giá Tận Gốc
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
                Chuyên gia công vỏ hộp quà tết âm dương, hộp nắp nam châm, hộp đựng yến sào, rượu vang và hạt dinh dưỡng. Nhận đơn gấp từ 100 hộp, ép kim logo doanh nghiệp theo yêu cầu.
              </p>
            </div>
            <Link
              href="/danh-muc/in-hop-qua-tet-73.html"
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-sm transition-all shrink-0 active:scale-95"
            >
              <span>Xem Tất Cả Mẫu Hộp Tết</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {(tetProducts.length > 0 ? tetProducts : data.products.slice(0, 4)).map((product) => (
              <ProductCard key={product.pid} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 inline-flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 fill-current" />
              Mẫu Hộp Tiêu Biểu Khác
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1 tracking-tight">
              Hộp Carton Ship COD & Hộp Giấy Mỹ Phẩm
            </h2>
          </div>
          <Link
            href="/san-pham"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            <span>Xem thêm mẫu hộp</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {(generalProducts.length > 0 ? generalProducts : data.products).slice(0, 8).map((product) => (
            <ProductCard key={product.pid} product={product} />
          ))}
        </div>
      </section>

      {/* Bento Grid Factory Features */}
      <BentoGridFeatures />

      {/* Latest Blog & Guides */}
      {data.blogs.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                Cẩm Nang Chuyên Ngành
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1 tracking-tight">
                Kinh Nghiệm & Hướng Dẫn In Ấn Bao Bì
              </h2>
            </div>
            <Link
              href="/tin-tuc"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              <span>Xem tất cả bài viết</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.blogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        </section>
      )}

      {/* FAQ Section */}
      <FaqSection />
    </div>
  );
}
