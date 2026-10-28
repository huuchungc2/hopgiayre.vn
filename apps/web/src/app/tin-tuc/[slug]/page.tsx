import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { hopgiayreApi } from '../../../api/hopgiayre';
import { assetUrl } from '../../../api/client';
import { extractIdFromSlug, formatDateTime, stripHtml } from '../../../utils/format';
import { JsonLd } from '../../../components/seo/JsonLd';
import { QuickQuoteWidget } from '../../../components/QuickQuoteWidget';
import { Calendar, ChevronRight, User } from 'lucide-react';

interface BlogDetailPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
  const id = extractIdFromSlug(params.slug);
  if (!id) return { title: 'Bài viết | HopGiayRe.vn' };

  try {
    const blog = await hopgiayreApi.getBlog(id);
    const title = `${blog.title} | Cẩm Nang HopGiayRe.vn`;
    const description = stripHtml(blog.summary || blog.content || blog.title, 160);
    const imageUrl = assetUrl(blog.image);

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: 'article',
        images: [{ url: imageUrl, alt: blog.title }],
      },
    };
  } catch {
    return { title: 'Bài viết | HopGiayRe.vn' };
  }
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const id = extractIdFromSlug(params.slug);
  if (!id) notFound();

  let blog;
  try {
    blog = await hopgiayreApi.getBlog(id);
  } catch {
    notFound();
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hopgiayre.vn';
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: blog.title,
    description: stripHtml(blog.summary || blog.title, 160),
    image: [assetUrl(blog.image)],
    datePublished: blog.datetime || new Date().toISOString(),
    author: {
      '@type': 'Organization',
      name: blog.author || 'HopGiayRe.vn',
      url: siteUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: 'HopGiayRe.vn',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/images/logo.svg`,
      },
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <JsonLd data={articleSchema} />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-[#946C45] overflow-x-auto">
        <Link href="/" className="hover:text-[#A35424] transition-colors">Trang Chủ</Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#DAC0A3]" />
        <Link href="/tin-tuc" className="hover:text-[#A35424] transition-colors">Cẩm Nang In Ấn</Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#DAC0A3]" />
        <span className="text-[#1A1412] font-semibold truncate max-w-[200px]">{blog.title}</span>
      </nav>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Article Body (8 cols) */}
        <article className="lg:col-span-8 bg-white border border-[#EADBC8] rounded-3xl p-6 sm:p-10 shadow-soft space-y-6">
          <div className="space-y-3 pb-6 border-b border-[#EADBC8]">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#1A1412] tracking-tight leading-tight">
              {blog.title}
            </h1>
            <div className="flex items-center gap-4 text-xs font-semibold text-[#946C45]">
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-[#A35424]" />
                {blog.author || 'Chuyên gia xưởng in HopGiayRe'}
              </span>
              {blog.datetime && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#B89774]" />
                  {formatDateTime(blog.datetime)}
                </span>
              )}
            </div>
          </div>

          {blog.image && (
            <div className="rounded-2xl overflow-hidden border border-[#EADBC8] aspect-[16/9] bg-[#FAF7F2]">
              <img
                src={assetUrl(blog.image)}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {blog.summary && (
            <div className="bg-[#FAF7F2] border-l-4 border-[#A35424] p-4 rounded-r-xl text-xs sm:text-sm text-[#5C3C1E] font-medium leading-relaxed italic">
              {blog.summary}
            </div>
          )}

          <div
            className="prose prose-stone max-w-none text-xs sm:text-sm text-[#1A1412] leading-relaxed space-y-4 pt-2"
            dangerouslySetInnerHTML={{ __html: blog.content || blog.summary }}
          />
        </article>

        {/* Sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <QuickQuoteWidget />
        </div>
      </div>
    </div>
  );
}
