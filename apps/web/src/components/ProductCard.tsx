'use client';

import React from 'react';
import Link from 'next/link';
import type { Product } from '../types/domain';
import { assetUrl } from '../api/client';
import { formatMoney, productHref } from '../utils/format';
import { ArrowUpRight, Flame, Sparkles } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const href = productHref(product);
  const imageUrl = assetUrl(product.image, '/images/logo.svg');

  return (
    <article className="group bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-card hover:shadow-card-hover hover:border-emerald-500/50 transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Image Wrap */}
        <Link href={href} className="block relative aspect-square bg-slate-50 overflow-hidden">
          <img
            src={imageUrl}
            alt={product.image_alt || product.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
            {Boolean(product.hot) && (
              <span className="inline-flex items-center gap-1 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm">
                <Flame className="w-3 h-3 fill-current" />
                HOT
              </span>
            )}
            {Boolean(product.promo) && product.discount > 0 && (
              <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm">
                -{product.discount}%
              </span>
            )}
            {Boolean(product.new) && !product.hot && (
              <span className="inline-flex items-center gap-0.5 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm">
                <Sparkles className="w-3 h-3" />
                MỚI
              </span>
            )}
          </div>
        </Link>

        {/* Product Details */}
        <div className="p-4 space-y-1.5">
          {product.category?.[0]?.cname && (
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">
              {product.category[0].cname}
            </span>
          )}

          <Link href={href} className="block group-hover:text-emerald-700 transition-colors">
            <h3 className="text-sm font-semibold text-slate-900 line-clamp-2 leading-snug min-h-[2.5rem]">
              {product.name}
            </h3>
          </Link>
        </div>
      </div>

      {/* Pricing & CTA */}
      <div className="p-4 pt-0 border-t border-slate-100 mt-2 flex items-center justify-between">
        <div>
          <div className="text-sm sm:text-base font-bold text-red-600 tracking-tight">
            {formatMoney(product.price)}
          </div>
          {product.original_price > product.price && (
            <span className="text-xs text-slate-400 line-through">
              {formatMoney(product.original_price)}
            </span>
          )}
        </div>

        <Link
          href={href}
          className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-emerald-600 text-slate-600 hover:text-white flex items-center justify-center transition-colors group-hover:bg-emerald-600 group-hover:text-white"
          aria-label={`Xem chi tiết ${product.name}`}
        >
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>
    </article>
  );
}
