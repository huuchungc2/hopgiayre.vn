import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { hopgiayreApi } from '../../../api/hopgiayre';
import { ProductCard } from '../../../components/ProductCard';
import { extractIdFromSlug } from '../../../utils/format';
import { ChevronRight, PackageOpen } from 'lucide-react';

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const id = extractIdFromSlug(params.slug);
  if (!id) return { title: 'Danh mục sản phẩm | HopGiayRe.vn' };

  try {
    const categories = await hopgiayreApi.getCategories(true);
    const cat = categories.find((c) => String(c.id) === id);
    const title = cat ? `${cat.name} - Xưởng In Hộp Giấy Giá Rẻ TP.HCM` : 'Danh Mục Sản Phẩm';
    const description = `Chuyên sản xuất và in ấn ${cat?.name || 'hộp giấy'} giá rẻ tận xưởng tại TP.HCM. Báo giá nhanh, miễn phí thiết kế mẫu.`;

    return {
      title,
      description,
    };
  } catch {
    return { title: 'Danh mục sản phẩm | HopGiayRe.vn' };
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const id = extractIdFromSlug(params.slug);
  if (!id) notFound();

  let productsData;
  let currentCategory;

  try {
    const [prodRes, cats] = await Promise.all([
      hopgiayreApi.getProducts({
        pageIndex: 1,
        itemPerPage: 30,
        categoryId: id,
        sortBy: 'hot',
      }),
      hopgiayreApi.getCategories(true),
    ]);
    productsData = prodRes;
    currentCategory = cats.find((c) => String(c.id) === id);
  } catch (error) {
    notFound();
  }

  const products = productsData.list_data || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-[#946C45]">
        <Link href="/" className="hover:text-[#A35424] transition-colors">Trang Chủ</Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#DAC0A3]" />
        <Link href="/san-pham" className="hover:text-[#A35424] transition-colors">Sản Phẩm</Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#DAC0A3]" />
        <span className="text-[#1A1412] font-semibold">{currentCategory?.name || `Danh mục #${id}`}</span>
      </nav>

      {/* Header */}
      <div className="border-b border-[#EADBC8] pb-6">
        <span className="text-xs font-bold uppercase tracking-widest text-[#A35424]">
          Dòng Sản Phẩm Chuyên Biệt
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-[#1A1412] mt-1 tracking-tight">
          {currentCategory?.name || 'Mẫu Hộp Giấy Theo Danh Mục'}
        </h1>
        <p className="text-xs text-[#7A522E] mt-1.5 max-w-2xl">
          Tổng hợp các mẫu hộp chuẩn quy cách, chống va đập, gia công sắc nét tận xưởng sản xuất HopGiayRe.vn.
        </p>
      </div>

      {/* Products */}
      {products.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
            <ProductCard key={product.pid} product={product} />
          ))}
        </div>
      ) : (
        <div className="bg-white border border-[#EADBC8] rounded-3xl p-12 text-center max-w-md mx-auto space-y-3">
          <PackageOpen className="w-12 h-12 text-[#DAC0A3] mx-auto" />
          <h3 className="font-extrabold text-[#1A1412] text-base">Đang cập nhật mẫu mới</h3>
          <p className="text-xs text-[#7A522E]">
            Danh mục này đang được xưởng bổ sung mẫu mới. Bạn có thể gửi ảnh mẫu yêu cầu qua Zalo để nhận báo giá ngay!
          </p>
          <a
            href="https://zalo.me/0985363679"
            className="inline-block bg-[#A35424] text-white text-xs font-bold px-5 py-2.5 rounded-full shadow-md"
          >
            Gửi ảnh mẫu cần in qua Zalo
          </a>
        </div>
      )}
    </div>
  );
}
