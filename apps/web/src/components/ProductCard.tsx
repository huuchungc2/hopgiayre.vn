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
    <article className="group bg-white border border-[#EADBC8] rounded-2xl overflow-hidden shadow-soft hover:shadow-lifted hover:border-[#A35424]/50 transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Image Wrap */}
        <Link href={href} className="block relative aspect-square bg-[#FAF7F2] overflow-hidden">
          <img
            src={imageUrl}
            alt={product.image_alt || product.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
            {Boolean(product.hot) && (
              <span className="inline-flex items-center gap-0.5 bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm">
                <Flame className="w-3 h-3" />
                HOT
              </span>
            )}
            {Boolean(product.promo) && product.discount > 0 && (
              <span className="bg-[#A35424] text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm">
                -{product.discount}%
              </span>
            )}
            {Boolean(product.new) && !product.hot && (
              <span className="inline-flex items-center gap-0.5 bg-[#F4C76B] text-[#713616] text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm">
                <Sparkles className="w-3 h-3" />
                MỚI
              </span>
            )}
          </div>
        </Link>

        {/* Product Details */}
        <div className="p-4 space-y-2">
          {product.category?.[0]?.cname && (
            <span className="text-[11px] font-bold text-[#946C45] uppercase tracking-wider block">
              {product.category[0].cname}
            </span>
          )}

          <Link href={href} className="block group-hover:text-[#A35424] transition-colors">
            <h3 className="text-sm font-extrabold text-[#1A1412] line-clamp-2 leading-snug min-h-[2.5rem]">
              {product.name}
            </h3>
          </Link>
        </div>
      </div>

      {/* Pricing & CTA */}
      <div className="p-4 pt-0 border-t border-[#F5EFE6] mt-2 flex items-center justify-between gap-2">
        <div>
          <div className="text-sm font-black text-[#A35424]">
            {product.price > 0 ? formatMoney(product.price) : 'Giá tại xưởng'}
          </div>
          {product.original_price > product.price && product.price > 0 && (
            <span className="text-[11px] text-[#B89774] line-through block">
              {formatMoney(product.original_price)}
            </span>
          )}
        </div>

        <Link
          href={href}
          className="w-8 h-8 rounded-full bg-[#FAF7F2] border border-[#DAC0A3] group-hover:bg-[#A35424] group-hover:text-white group-hover:border-[#A35424] text-[#5C3C1E] flex items-center justify-center transition-all shrink-0"
          aria-label={`Xem chi tiết ${product.name}`}
        >
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>
    </article>
  );
}
