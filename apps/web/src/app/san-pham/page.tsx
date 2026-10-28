import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { hopgiayreApi } from '../../api/hopgiayre';
import { ProductCard } from '../../components/ProductCard';
import { categoryHref } from '../../utils/format';
import { Package, Search, SlidersHorizontal } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Tất Cả Mẫu Hộp Giấy & Bao Bì Đóng Hàng | HopGiayRe.vn',
  description:
    'Danh sách hơn 500+ mẫu hộp carton sóng E/B, hộp cứng quà tặng, hộp giấy kraft, túi giấy giá tận xưởng tại TP.HCM. Báo giá nhanh, in theo kích thước yêu cầu.',
};

interface ProductPageProps {
  searchParams?: {
    q?: string;
    sort?: string;
    page?: string;
  };
}

export default async function ProductPage({ searchParams }: ProductPageProps) {
  const keyword = searchParams?.q || '';
  const sortBy = searchParams?.sort || 'hot';
  const page = Number(searchParams?.page) || 1;

  let productsData;
  let categories;

  try {
    [productsData, categories] = await Promise.all([
      hopgiayreApi.getProducts({
        pageIndex: page,
        itemPerPage: 24,
        keyword: keyword || '--',
        sortBy: sortBy as any,
      }),
      hopgiayreApi.getCategories(true),
    ]);
  } catch (error) {
    productsData = { list_data: [], total: 0 };
    categories = [];
  }

  const products = productsData.list_data || [];
  const total = productsData.total || 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#EADBC8] pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#A35424]">
            Kho Mẫu Hộp Giấy Tận Xưởng
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1A1412] mt-1 tracking-tight">
            {keyword ? `Kết quả tìm kiếm cho: "${keyword}"` : 'Tất Cả Mẫu Hộp Giấy & Bao Bì'}
          </h1>
          <p className="text-xs text-[#946C45] mt-1">
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
              placeholder="Tìm theo tên..."
              className="w-full bg-white border border-[#DAC0A3] rounded-xl pl-9 pr-3 py-2 text-xs text-[#1A1412] outline-none"
            />
            <Search className="w-3.5 h-3.5 text-[#946C45] absolute left-3 top-1/2 -translate-y-1/2" />
          </form>

          <form method="GET" action="/san-pham" className="flex items-center gap-2">
            {keyword && <input type="hidden" name="q" value={keyword} />}
            <div className="relative">
              <select
                name="sort"
                defaultValue={sortBy}
                // @ts-ignore
                onChange="this.form.submit()"
                className="bg-white border border-[#DAC0A3] rounded-xl px-3 py-2 text-xs font-semibold text-[#5C3C1E] outline-none cursor-pointer"
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
          <span className="text-xs font-bold text-[#5C3C1E] shrink-0 mr-1 flex items-center gap-1">
            <SlidersHorizontal className="w-3.5 h-3.5" /> Danh mục:
          </span>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={categoryHref(cat)}
              className="shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full bg-white border border-[#DAC0A3] hover:border-[#A35424] hover:text-[#A35424] transition-colors"
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
        <div className="bg-white border border-[#EADBC8] rounded-3xl p-12 text-center max-w-md mx-auto space-y-3">
          <Package className="w-12 h-12 text-[#DAC0A3] mx-auto" />
          <h3 className="font-extrabold text-[#1A1412] text-base">Chưa tìm thấy mẫu hộp phù hợp</h3>
          <p className="text-xs text-[#7A522E]">
            Xưởng nhận sản xuất theo kích thước và file thiết kế riêng. Hãy liên hệ hotline hoặc Zalo để được hỗ trợ.
          </p>
          <a
            href="https://zalo.me/0985363679"
            className="inline-block bg-[#A35424] text-white text-xs font-bold px-5 py-2.5 rounded-full shadow-md"
          >
            Yêu cầu báo giá kích thước riêng
          </a>
        </div>
      )}
    </div>
  );
}
