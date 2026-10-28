import React from 'react';
import type { Metadata } from 'next';
import { hopgiayreApi } from '../../api/hopgiayre';
import { BlogCard } from '../../components/BlogCard';
import { BookOpen } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Cẩm Nang & Tin Tức In Ấn Hộp Giấy, Bao Bì | HopGiayRe.vn',
  description:
    'Tổng hợp kiến thức in ấn hộp giấy, cách phân biệt sóng carton E, B, C, kinh nghiệm tối ưu chi phí bao bì đóng gói cho doanh nghiệp và shop bán hàng.',
};

export default async function BlogListPage() {
  let blogsData;
  try {
    blogsData = await hopgiayreApi.getBlogs('article', 1, 24, '1');
  } catch {
    blogsData = { list_data: [], total: 0 };
  }

  const blogs = blogsData.list_data || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-[#EADBC8] pb-6">
        <span className="text-xs font-bold uppercase tracking-widest text-[#A35424] inline-flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5" />
          Kiến Thức Ngành In
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-[#1A1412] mt-1 tracking-tight">
          Cẩm Nang & Kinh Nghiệm Đặt In Hộp Giấy
        </h1>
        <p className="text-xs text-[#7A522E] mt-1.5 max-w-2xl">
          Chia sẻ kinh nghiệm chọn chất liệu giấy, quy cách sóng carton, kỹ thuật in Offset và mẹo tiết kiệm chi phí đóng hàng.
        </p>
      </div>

      {/* Grid */}
      {blogs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-[#946C45] text-sm">
          Đang cập nhật bài viết mới...
        </div>
      )}
    </div>
  );
}
