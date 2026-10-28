'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { assetUrl } from '../api/client';
import { ChevronLeft, ChevronRight, Calculator, Sparkles, ShieldCheck, Factory } from 'lucide-react';

interface BannerItem {
  id: number;
  title: string;
  image: string;
  link?: string;
  description?: string;
}

const DEFAULT_SLIDES: BannerItem[] = [
  {
    id: 1,
    title: 'Xưởng In Hộp Giấy & Thùng Carton Giá Rẻ TP.HCM',
    image: 'upload/imgbanner/in-hop-giay.webp',
    description: 'Chuyên sản xuất hộp carton sóng E/B, hộp giấy Kraft, hộp cứng quà tặng. Tiết kiệm 20% chi phí.',
    link: '/bao-gia',
  },
  {
    id: 2,
    title: 'Sản Xuất Hộp Cứng Cao Cấp - Sang Trọng & Đẳng Cấp',
    image: 'upload/imgbanner/ban_in_hop_cung.webp',
    description: 'Hộp quà tặng, hộp yến sào, hộp rượu, hộp bánh trung thu. Ép kim, dập nổi, bế định hình tinh xảo.',
    link: '/san-pham',
  },
  {
    id: 3,
    title: 'In Túi Giấy Thương Hiệu - Giá Gốc Tận Xưởng',
    image: 'upload/imgbanner/in-tui-giay.webp',
    description: 'Túi giấy quai dù, túi giấy kraft thân thiện môi trường cho shop thời trang, mỹ phẩm, sự kiện.',
    link: '/san-pham',
  },
];

export function HeroBannerSlider({ banners = [] }: { banners?: any[] }) {
  const slides: BannerItem[] = banners.length > 0
    ? banners.map((b, idx) => ({
        id: b.id || idx,
        title: b.title || 'Xưởng In Hộp Giấy Giá Rẻ',
        image: b.image || 'upload/imgbanner/in-hop-giay.webp',
        link: b.link || '/bao-gia',
        description: b.description || 'Sản xuất trực tiếp tại xưởng TP.HCM. Báo giá nhanh sau 5 phút.',
      }))
    : DEFAULT_SLIDES;

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const current = slides[currentIndex];

  return (
    <div className="relative rounded-2xl overflow-hidden shadow-card border border-slate-200 bg-slate-900 aspect-[16/9] sm:aspect-[21/9] lg:aspect-[16/9] group">
      {/* Background Image Slide */}
      {slides.map((slide, idx) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            idx === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
          }`}
        >
          <img
            src={assetUrl(slide.image, '/images/logo.svg')}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
          {/* Subtle gradient overlay on bottom for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent" />
        </div>
      ))}

      {/* Floating Content / Caption */}
      <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7 z-20 text-white flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1.5 max-w-xl">
          <span className="inline-flex items-center gap-1.5 bg-emerald-600/90 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
            <Sparkles className="w-3 h-3" /> Xưởng Sản Xuất Trực Tiếp
          </span>
          <h3 className="text-lg sm:text-2xl font-bold tracking-tight text-white drop-shadow-md">
            {current.title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-200 line-clamp-2 drop-shadow">
            {current.description}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/bao-gia"
            className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-md transition-all active:scale-95 shrink-0"
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Nhận Báo Giá 5 Phút</span>
          </Link>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-2 h-2 rounded-full transition-all ${
              idx === currentIndex ? 'w-5 bg-emerald-400' : 'bg-white/50 hover:bg-white'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
