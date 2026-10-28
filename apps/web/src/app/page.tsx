import React from 'react';
import Link from 'next/link';
import { hopgiayreApi } from '../api/hopgiayre';
import { assetUrl } from '../api/client';
import { categoryHref } from '../utils/format';
import { ProductCard } from '../components/ProductCard';
import { BlogCard } from '../components/BlogCard';
import { QuickQuoteWidget } from '../components/QuickQuoteWidget';
import { BentoGridFeatures } from '../components/BentoGridFeatures';
import { FaqSection } from '../components/FaqSection';
import { ArrowRight, CheckCircle2, Flame, Layers, Sparkles } from 'lucide-react';
import type { Category, Product, Blog, Banner } from '../types/domain';

export const revalidate = 3600; // ISR cache 1 hour

interface HomeData {
  banners: Banner[];
  products: Product[];
  categories: Category[];
  blogs: Blog[];
}

async function getHomeData(): Promise<HomeData> {
  try {
    const [banners, hotProducts, categories, blogs] = await Promise.all([
      hopgiayreApi.getBanners('main', 1, 4).catch(() => ({ list_data: [] })),
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
  } catch (error) {
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
  const banner = data.banners[0];

  const featuredCategories = data.categories.filter((cat) => cat.image || cat.icon);
  const displayCategories = (featuredCategories.length >= 4 ? featuredCategories : data.categories).slice(0, 8);

  return (
    <div className="space-y-14 sm:space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-slate-50 via-white to-white border-b border-slate-200/80 pt-10 pb-14 sm:pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Value Prop */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-semibold uppercase tracking-wider px-3.5 py-1.5 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              Xưởng Sản Xuất & In Ấn Trực Tiếp Tại TP.HCM
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.18]">
              In Hộp Giấy & Thùng Carton <br className="hidden sm:inline" />
              <span className="text-emerald-600">Giá Rẻ Tận Gốc</span>, Chuẩn Thương Hiệu
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl">
              Chuyên sản xuất hộp carton sóng E/B, hộp cứng quà tặng cao cấp, hộp giấy Kraft và túi giấy. Tiết kiệm 20% chi phí, miễn phí thiết kế mẫu 3D, nhận in từ số lượng ít 100 hộp.
            </p>

            {/* Quick Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs font-semibold text-slate-700">
              <div className="flex items-center gap-2 bg-white border border-slate-200 p-3 rounded-xl shadow-card">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Giá rẻ hơn 20%</span>
              </div>
              <div className="flex items-center gap-2 bg-white border border-slate-200 p-3 rounded-xl shadow-card">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Thiết kế 3D miễn phí</span>
              </div>
              <div className="flex items-center gap-2 bg-white border border-slate-200 p-3 rounded-xl shadow-card col-span-2 sm:col-span-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Giao hàng 24h - 48h</span>
              </div>
            </div>

            {/* Banner Image Preview */}
            <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm max-w-lg hidden sm:block">
              <img
                src={assetUrl(banner?.image || 'upload/imgbanner/in-hop-giay.webp')}
                alt={banner?.title || 'Xưởng in hộp giấy HopGiayRe.vn'}
                className="w-full h-52 object-cover"
              />
            </div>
          </div>

          {/* Right Column: Instant Calculator / Quote Widget */}
          <div className="lg:col-span-5">
            <QuickQuoteWidget />
          </div>
        </div>
      </section>

      {/* Category Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
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

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
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
                {cat.name}
              </h3>
              <span className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                <Layers className="w-3 h-3 text-emerald-600" />
                {cat.subs?.length ? `${cat.subs.length} quy cách` : 'Đặt in theo yêu cầu'}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-red-600 inline-flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 fill-current" />
              Mẫu Hộp Nổi Bật
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1 tracking-tight">
              Sản Phẩm Đang Được Đặt Hàng Nhiều Nhất
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

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {data.products.map((product) => (
            <ProductCard key={product.pid} product={product} />
          ))}
        </div>
      </section>

      {/* Bento Grid Factory Features */}
      <BentoGridFeatures />

      {/* Latest Blog & Guides */}
      {data.blogs.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
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
