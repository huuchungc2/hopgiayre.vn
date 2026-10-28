import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { hopgiayreApi } from '../../api/hopgiayre';
import { ProductCard } from '../../components/ProductCard';
import { categoryHref } from '../../utils/format';
import { Search, SlidersHorizontal, Package } from 'lucide-react';

export const revalidate = 3600;

interface ProductListPageProps {
  searchParams: {
    q?: string;
    cid?: string;
    page?: string;
    sort?: string;
  };
}

export async function generateMetadata({ searchParams }: ProductListPageProps): Promise<Metadata> {
  const keyword = searchParams.q ? ` "${searchParams.q}"` : '';
  return {
    title: `Tất Cả Mẫu Hộp Giấy & Bao Bì Đẹp Giá Rẻ${keyword} | HopGiayRe.vn`,
    description:
      'Danh mục hơn 200+ mẫu hộp carton sóng E, hộp quà tặng cao cấp, hộp giấy kraft, túi giấy. Sản xuất trực tiếp tại xưởng TP.HCM, giá rẻ hơn 20%.',
  };
}

export default async function ProductListPage({ searchParams }: ProductListPageProps) {
  const keyword = searchParams.q || '';
  const page = Number(searchParams.page || 1);
  const sortBy = (searchParams.sort as any) || 'hot';

  const [productsData, categories] = await Promise.all([
    hopgiayreApi.getProducts({
      pageIndex: page,
      itemPerPage: 24,
      keyword,
      sortBy,
    }).catch(() => ({ list_data: [], total: 0 })),
    hopgiayreApi.getCategories(true).catch(() => []),
  ]);

  const products = productsData.list_data || [];
  const total = productsData.total || 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
            Kho Mẫu Hộp Giấy Tận Xưởng
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1 tracking-tight">
            {keyword ? `Kết quả tìm kiếm cho: "${keyword}"` : 'Tất Cả Mẫu Hộp Giấy & Bao Bì'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Hiển thị {products.length} trên tổng số {total} mẫu bao bì sẵn có
          </p>
        </div>

        {/* Filter bar */}
        <div className="flex flex-wrap items-center gap-3">
          <form method="GET" action="/san-pham" className="relative flex-1 sm:w-64">
            <input
              type="text"
              name="q"
              defaultValue={keyword}
              placeholder="Tìm theo tên sản phẩm..."
              className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 outline-none transition-colors"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </form>

          <form method="GET" action="/san-pham" className="flex items-center gap-2">
            {keyword && <input type="hidden" name="q" value={keyword} />}
            <div className="relative">
              <select
                name="sort"
                defaultValue={sortBy}
                className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 outline-none cursor-pointer focus:bg-white focus:border-emerald-500"
              >
                <option value="hot">Nổi bật nhất</option>
                <option value="new">Mẫu mới nhất</option>
                <option value="promo">Khuyến mãi</option>
                <option value="asc_price">Giá thấp đến cao</option>
                <option value="desc_price">Giá cao đến thấp</option>
              </select>
            </div>
          </form>
        </div>
      </div>

      {/* Quick Category Pills */}
      {categories.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          <span className="text-xs font-semibold text-slate-600 shrink-0 mr-1 flex items-center gap-1">
            <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-600" /> Danh mục:
          </span>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={categoryHref(cat)}
              className="shrink-0 text-xs font-medium px-3.5 py-1.5 rounded-full bg-white border border-slate-200 hover:border-emerald-500 hover:text-emerald-700 hover:bg-emerald-50 transition-colors text-slate-700"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      )}

      {/* Product Grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
            <ProductCard key={product.pid} product={product} />
          ))}
        </div>
      ) : (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-12 text-center max-w-md mx-auto space-y-3">
          <Package className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="font-bold text-slate-900 text-base">Chưa tìm thấy mẫu hộp phù hợp</h3>
          <p className="text-xs text-slate-600">
            Xưởng nhận sản xuất theo kích thước và file thiết kế riêng. Hãy liên hệ hotline hoặc Zalo để được hỗ trợ.
          </p>
          <a
            href="https://zalo.me/0985363679"
            className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow-sm transition-colors"
          >
            Yêu cầu báo giá kích thước riêng
          </a>
        </div>
      )}
    </div>
  );
}
