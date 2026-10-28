import React from 'react';
import Link from 'next/link';
import type { Blog } from '../types/domain';
import { assetUrl } from '../api/client';
import { blogHref, formatDateTime, stripHtml } from '../utils/format';
import { Calendar, ArrowRight } from 'lucide-react';

export function BlogCard({ blog }: { blog: Blog }) {
  const href = blogHref(blog);
  const imageUrl = assetUrl(blog.image, '/images/logo.svg');
  const displayDate = formatDateTime(blog.datetime);

  return (
    <article className="group bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-card hover:shadow-card-hover hover:border-emerald-500/50 transition-all duration-300 flex flex-col justify-between">
      <div>
        <Link href={href} className="block relative aspect-[16/10] bg-slate-50 overflow-hidden">
          <img
            src={imageUrl}
            alt={blog.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </Link>

        <div className="p-5 space-y-2">
          {displayDate && (
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{displayDate}</span>
            </div>
          )}

          <Link href={href} className="block group-hover:text-emerald-700 transition-colors">
            <h3 className="text-base font-semibold text-slate-900 line-clamp-2 leading-snug">
              {blog.title}
            </h3>
          </Link>

          <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
            {stripHtml(blog.summary, 140)}
          </p>
        </div>
      </div>

      <div className="p-5 pt-0">
        <Link
          href={href}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700 group-hover:gap-2 transition-all"
        >
          <span>Đọc bài viết</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </article>
  );
}
