import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { hopgiayreApi } from '../../../api/hopgiayre';
import { assetUrl } from '../../../api/client';
import { extractIdFromSlug, formatMoney, stripHtml } from '../../../utils/format';
import { ProductSchema } from '../../../components/seo/JsonLd';
import { QuickQuoteWidget } from '../../../components/QuickQuoteWidget';
import { CheckCircle2, ChevronRight, MessageCircle, Phone, ShieldCheck, Tag } from 'lucide-react';

interface ProductDetailPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const id = extractIdFromSlug(params.slug);
  if (!id) return { title: 'Không tìm thấy sản phẩm' };

  try {
    const product = await hopgiayreApi.getProduct(id);
    const title = `${product.name} - In Giá Rẻ Tận Xưởng TP.HCM`;
    const description = stripHtml(product.short_desc || product.mota || product.name, 160);
    const imageUrl = assetUrl(product.image);

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: [{ url: imageUrl, alt: product.name }],
      },
    };
  } catch {
    return { title: 'Sản phẩm | HopGiayRe.vn' };
  }
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const id = extractIdFromSlug(params.slug);
  if (!id) notFound();

  let product;
  try {
    product = await hopgiayreApi.getProduct(id);
  } catch {
    notFound();
  }

  const gallery = [product.image, ...(product.img_path || [])].filter(Boolean);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hopgiayre.vn';
  const currentUrl = `${siteUrl}/san-pham/${params.slug}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-10">
      {/* Schema.org Product JSON-LD */}
      <ProductSchema
        name={product.name}
        description={stripHtml(product.short_desc || product.mota || product.name, 200)}
        image={assetUrl(product.image)}
        price={product.price}
        sku={product.code || String(product.pid)}
        url={currentUrl}
      />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-[#946C45] overflow-x-auto">
        <Link href="/" className="hover:text-[#A35424] transition-colors">Trang Chủ</Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#DAC0A3]" />
        <Link href="/san-pham" className="hover:text-[#A35424] transition-colors">Sản Phẩm</Link>
        {product.category?.[0] && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-[#DAC0A3]" />
            <span className="text-[#5C3C1E]">{product.category[0].cname}</span>
          </>
        )}
        <ChevronRight className="w-3.5 h-3.5 text-[#DAC0A3]" />
        <span className="text-[#1A1412] font-semibold truncate max-w-[200px]">{product.name}</span>
      </nav>

      {/* Main Product Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left: Gallery (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="aspect-square bg-white border border-[#EADBC8] rounded-3xl overflow-hidden p-4 flex items-center justify-center shadow-soft">
            <img
              src={assetUrl(product.image)}
              alt={product.image_alt || product.name}
              className="max-h-full max-w-full object-contain"
            />
          </div>

          {gallery.length > 1 && (
            <div className="grid grid-cols-4 gap-2.5">
              {gallery.slice(0, 4).map((img, i) => (
                <div
                  key={i}
                  className="aspect-square bg-white border border-[#DAC0A3] rounded-xl overflow-hidden p-1.5 flex items-center justify-center"
                >
                  <img src={assetUrl(img)} alt={product.name} className="max-h-full max-w-full object-contain" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info & Specs (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <span className="text-xs font-bold text-[#A35424] uppercase tracking-wider bg-[#EADBC8]/60 px-3 py-1 rounded-full inline-flex items-center gap-1">
              <Tag className="w-3 h-3" />
              {product.category?.[0]?.cname || 'Bao Bì Giấy Tận Xưởng'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#1A1412] mt-3 tracking-tight">
              {product.name}
            </h1>
          </div>

          {/* Pricing */}
          <div className="bg-[#FAF7F2] border border-[#EADBC8] rounded-2xl p-4 sm:p-5 flex flex-wrap items-baseline gap-3">
            <span className="text-2xl sm:text-3xl font-black text-[#A35424]">
              {product.price > 0 ? formatMoney(product.price) : 'Giá Tận Xưởng (Liên Hệ)'}
            </span>
            {product.original_price > product.price && product.price > 0 && (
              <span className="text-sm text-[#946C45] line-through">
                {formatMoney(product.original_price)}
              </span>
            )}
            <span className="text-xs text-[#7A522E] block w-full mt-1">
              * Giá biến thiên theo số lượng và quy cách in ấn. Đặt càng nhiều giá càng rẻ.
            </span>
          </div>

          {/* Short description */}
          {product.short_desc && (
            <div
              className="text-xs sm:text-sm text-[#5C3C1E] leading-relaxed border-l-2 border-[#A35424] pl-3"
              dangerouslySetInnerHTML={{ __html: product.short_desc }}
            />
          )}

          {/* Technical Specs Table - SEO & AI friendly */}
          <div className="border border-[#EADBC8] rounded-2xl overflow-hidden bg-white">
            <div className="bg-[#F5EFE6] px-4 py-2.5 font-bold text-xs uppercase tracking-wider text-[#713616]">
              Thông Số Kỹ Thuật Tham Khảo
            </div>
            <dl className="divide-y divide-[#F5EFE6] text-xs">
              <div className="grid grid-cols-3 px-4 py-2.5">
                <dt className="font-semibold text-[#946C45]">Mã sản phẩm</dt>
                <dd className="col-span-2 text-[#1A1412] font-bold">{product.code || product.pid}</dd>
              </div>
              <div className="grid grid-cols-3 px-4 py-2.5">
                <dt className="font-semibold text-[#946C45]">Quy cách</dt>
                <dd className="col-span-2 text-[#1A1412]">Sản xuất theo kích thước yêu cầu</dd>
              </div>
              <div className="grid grid-cols-3 px-4 py-2.5">
                <dt className="font-semibold text-[#946C45]">Chất liệu giấy</dt>
                <dd className="col-span-2 text-[#1A1412]">Carton sóng E/B/C, Ivory, Duplex, Kraft</dd>
              </div>
              <div className="grid grid-cols-3 px-4 py-2.5">
                <dt className="font-semibold text-[#946C45]">Công nghệ in</dt>
                <dd className="col-span-2 text-[#1A1412]">In Offset 4 màu chất lượng cao, in Flexo</dd>
              </div>
              <div className="grid grid-cols-3 px-4 py-2.5">
                <dt className="font-semibold text-[#946C45]">Gia công</dt>
                <dd className="col-span-2 text-[#1A1412]">Cán màng bóng/mờ, ép kim, dập nổi, bế dán</dd>
              </div>
              <div className="grid grid-cols-3 px-4 py-2.5">
                <dt className="font-semibold text-[#946C45]">Cam kết</dt>
                <dd className="col-span-2 text-emerald-700 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" /> Đổi trả 100% nếu có lỗi từ xưởng in
                </dd>
              </div>
            </dl>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href="https://zalo.me/0985363679"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 bg-[#0068FF] hover:bg-[#0055d4] text-white text-sm font-bold py-3.5 px-6 rounded-2xl shadow-md transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              Chat Zalo Báo Giá Ngay
            </a>
            <a
              href="tel:0985363679"
              className="inline-flex items-center justify-center gap-2 bg-[#A35424] hover:bg-[#713616] text-white text-sm font-bold py-3.5 px-6 rounded-2xl shadow-md transition-all"
            >
              <Phone className="w-4 h-4 text-[#F4C76B]" />
              Gọi Hotline Xưởng
            </a>
          </div>
        </div>
      </div>

      {/* Detailed Description Panel & Embedded Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pt-6">
        {/* Full HTML description (8 cols) */}
        <div className="lg:col-span-8 bg-white border border-[#EADBC8] rounded-3xl p-6 sm:p-8 shadow-soft space-y-4">
          <h2 className="text-xl font-black text-[#1A1412] pb-3 border-b border-[#EADBC8]">
            Chi Tiết Về Sản Phẩm & Quy Cách In
          </h2>
          {product.mota ? (
            <div
              className="prose prose-stone max-w-none text-xs sm:text-sm text-[#5C3C1E] leading-relaxed space-y-4"
              dangerouslySetInnerHTML={{ __html: product.mota }}
            />
          ) : (
            <div className="text-xs sm:text-sm text-[#7A522E] leading-relaxed space-y-3">
              <p>
                Sản phẩm {product.name} được gia công và sản xuất trực tiếp tại hệ thống xưởng in HopGiayRe.vn. Chúng tôi ứng dụng công nghệ in ấn offset hiện đại giúp màu sắc sắc nét, chuẩn file thiết kế và bền màu theo thời gian.
              </p>
              <p>
                Để nhận được báo giá chính xác nhất theo kích thước riêng của quý khách, xin vui lòng điền form yêu cầu báo giá bên cạnh hoặc nhắn tin trực tiếp qua hotline/Zalo 0985 363 679.
              </p>
            </div>
          )}
        </div>

        {/* Embedded Calculator Sidebar (4 cols) */}
        <div className="lg:col-span-4">
          <QuickQuoteWidget />
        </div>
      </div>
    </div>
  );
}
