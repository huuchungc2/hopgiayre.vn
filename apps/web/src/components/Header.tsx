'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Phone, Search, Calculator, ShieldCheck, Sparkles, MessageCircle } from 'lucide-react';
import type { Category } from '../types/domain';
import { categoryHref } from '../utils/format';

interface HeaderProps {
  categories?: Category[];
}

export function Header({ categories = [] }: HeaderProps) {
  const [keyword, setKeyword] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyword.trim()) {
      window.location.href = `/san-pham?q=${encodeURIComponent(keyword.trim())}`;
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#EADBC8] transition-all">
      {/* Top Banner */}
      <div className="bg-[#1A1412] text-[#FAF7F2] text-xs py-2 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-medium text-[#DAC0A3]">
              <Sparkles className="w-3.5 h-3.5 text-[#F4C76B]" />
              Xưởng in trực tiếp - Giá rẻ hơn 20% thị trường
            </span>
            <span className="hidden md:inline-block text-[#B89774]">•</span>
            <span className="hidden md:flex items-center gap-1 text-[#DAC0A3]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Cam kết đổi trả 100% nếu lỗi in
            </span>
          </div>

          <div className="flex items-center gap-4 font-semibold">
            <a
              href="tel:0985363679"
              className="flex items-center gap-1.5 hover:text-[#F4C76B] transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#F4C76B]" />
              <span>Hotline: 0985 363 679</span>
            </a>
            <span className="text-[#B89774]">•</span>
            <a
              href="https://zalo.me/0985363679"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[#F4C76B] hover:underline"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              Zalo Xưởng
            </a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0 group">
          <div className="w-10 h-10 rounded-xl bg-[#A35424] flex items-center justify-center text-white font-extrabold text-xl shadow-md group-hover:scale-105 transition-transform">
            H
          </div>
          <div className="flex flex-col">
            <span className="text-xl sm:text-2xl font-black tracking-tight text-[#1A1412] leading-none">
              HopGiay<span className="text-[#A35424]">Re</span>.vn
            </span>
            <span className="text-[10px] tracking-wider text-[#946C45] font-semibold uppercase mt-0.5">
              Bao Bì & Hộp Giấy Tận Xưởng
            </span>
          </div>
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="hidden lg:flex items-center flex-1 max-w-lg mx-6">
          <div className="relative w-full">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Tìm hộp carton, hộp quà, túi giấy, kích thước..."
              className="w-full bg-white border border-[#DAC0A3] focus:border-[#A35424] focus:ring-2 focus:ring-[#A35424]/20 rounded-full pl-11 pr-24 py-2 text-sm text-[#1A1412] placeholder-[#B89774] outline-none transition-all shadow-sm"
            />
            <Search className="w-4 h-4 text-[#946C45] absolute left-4 top-1/2 -translate-y-1/2" />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-[#A35424] hover:bg-[#713616] text-white text-xs font-bold px-4 py-1.5 rounded-full transition-colors"
            >
              Tìm Kiếm
            </button>
          </div>
        </form>

        {/* Right CTA */}
        <div className="flex items-center gap-3">
          <Link
            href="/bao-gia"
            className="hidden sm:inline-flex items-center gap-2 bg-[#A35424] hover:bg-[#713616] text-white text-sm font-bold px-5 py-2.5 rounded-full shadow-md hover:shadow-lg transition-all active:scale-95"
          >
            <Calculator className="w-4 h-4 text-[#F4C76B]" />
            <span>Báo Giá Nhanh</span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-[#1A1412] hover:bg-[#F5EFE6] transition-colors md:hidden"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Navigation Bar (Desktop) */}
      <nav className="hidden md:block border-t border-[#EADBC8]/70 bg-white/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-6 overflow-x-auto py-2.5 text-sm font-semibold text-[#5C3C1E] no-scrollbar">
            <Link href="/" className="hover:text-[#A35424] whitespace-nowrap transition-colors">
              Trang Chủ
            </Link>
            <Link href="/san-pham" className="hover:text-[#A35424] whitespace-nowrap transition-colors">
              Tất Cả Sản Phẩm
            </Link>
            {categories.slice(0, 7).map((cat) => (
              <Link
                key={cat.id}
                href={categoryHref(cat)}
                className="hover:text-[#A35424] whitespace-nowrap transition-colors"
              >
                {cat.name}
              </Link>
            ))}
            <Link href="/tin-tuc" className="hover:text-[#A35424] whitespace-nowrap transition-colors">
              Kinh Nghiệm & Cẩm Nang
            </Link>
            <Link href="/bao-gia" className="hover:text-[#A35424] whitespace-nowrap transition-colors text-[#A35424]">
              Báo Giá In
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#EADBC8] bg-white px-4 py-4 space-y-3 shadow-xl">
          <form onSubmit={handleSearch} className="mb-4">
            <div className="relative">
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Tìm sản phẩm hộp giấy..."
                className="w-full bg-[#FAF7F2] border border-[#DAC0A3] rounded-lg pl-10 pr-4 py-2 text-sm text-[#1A1412] outline-none"
              />
              <Search className="w-4 h-4 text-[#946C45] absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </form>

          <div className="flex flex-col space-y-2 text-sm font-semibold text-[#3D2713]">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="py-1.5 hover:text-[#A35424]">
              Trang Chủ
            </Link>
            <Link href="/san-pham" onClick={() => setMobileMenuOpen(false)} className="py-1.5 hover:text-[#A35424]">
              Tất Cả Mẫu Hộp
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={categoryHref(cat)}
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 pl-2 border-l-2 border-[#DAC0A3] hover:border-[#A35424] hover:text-[#A35424]"
              >
                {cat.name}
              </Link>
            ))}
            <Link href="/tin-tuc" onClick={() => setMobileMenuOpen(false)} className="py-1.5 hover:text-[#A35424]">
              Tin Tức In Ấn
            </Link>
            <Link href="/bao-gia" onClick={() => setMobileMenuOpen(false)} className="py-2 text-[#A35424] font-bold">
              Yêu Cầu Báo Giá Nhanh
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
