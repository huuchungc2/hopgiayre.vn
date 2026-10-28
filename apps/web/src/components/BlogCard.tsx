import React from 'react';
import Link from 'next/link';
import type { Blog } from '../types/domain';
import { assetUrl } from '../api/client';
import { blogHref, stripHtml } from '../utils/format';
import { Calendar, ArrowRight } from 'lucide-react';

export function BlogCard({ blog }: { blog: Blog }) {
  const href = blogHref(blog);
  const imageUrl = assetUrl(blog.image, '/images/logo.svg');

  return (
    <article className="group bg-white border border-[#EADBC8] rounded-2xl overflow-hidden shadow-soft hover:shadow-lifted hover:border-[#A35424]/40 transition-all duration-300 flex flex-col justify-between">
      <div>
        <Link href={href} className="block relative aspect-[16/10] bg-[#FAF7F2] overflow-hidden">
          <img
            src={imageUrl}
            alt={blog.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </Link>

        <div className="p-5 space-y-2.5">
          {blog.datetime && (
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#946C45]">
              <Calendar className="w-3.5 h-3.5 text-[#B89774]" />
              <span>{blog.datetime}</span>
            </div>
          )}

          <Link href={href} className="block group-hover:text-[#A35424] transition-colors">
            <h3 className="text-base font-extrabold text-[#1A1412] line-clamp-2 leading-snug">
              {blog.title}
            </h3>
          </Link>

          <p className="text-xs text-[#7A522E] line-clamp-3 leading-relaxed">
            {stripHtml(blog.summary, 140)}
          </p>
        </div>
      </div>

      <div className="p-5 pt-0">
        <Link
          href={href}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#A35424] group-hover:gap-2.5 transition-all"
        >
          <span>Xem chi tiết</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </article>
  );
}
