'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Phone, Search, Calculator, ShieldCheck, Sparkles, MessageCircle, PackageCheck, Layers } from 'lucide-react';
import type { Category } from '../types/domain';
import { categoryHref } from '../utils/format';

interface HeaderProps {
  categories?: Category[];
}

function cleanCategoryName(name: string): string {
  return name
    .replace(/^In\s+/i, '')
    .replace(/,\s*Giá Rẻ/i, '')
    .trim();
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

  // Only keep valid categories that have images and aren't all-caps product names
  const validCategories = categories
    .filter((cat) => cat.image && cat.image.trim() !== '')
    .slice(0, 7);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 transition-all">
      {/* Top Banner */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-medium text-emerald-400">
              <Sparkles className="w-3.5 h-3.5" />
              Xưởng in trực tiếp - Giá rẻ hơn 20% thị trường
            </span>
            <span className="hidden md:inline-block text-slate-600">•</span>
            <span className="hidden md:flex items-center gap-1 text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Cam kết đổi trả 100% nếu lỗi in
            </span>
          </div>

          <div className="flex items-center gap-4 font-medium text-slate-300">
            <a
              href="tel:0985363679"
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Hotline: <strong className="text-white font-semibold">0985 363 679</strong></span>
            </a>
            <span className="text-slate-600">•</span>
            <a
              href="https://zalo.me/0985363679"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-semibold"
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
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-black text-xl shadow-sm group-hover:scale-105 transition-transform">
            H
          </div>
          <div className="flex flex-col">
            <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 leading-none">
              HopGiay<span className="text-emerald-600">Re</span>.vn
            </span>
            <span className="text-[10px] tracking-wider text-slate-500 font-semibold uppercase mt-0.5">
              Xưởng Sản Xuất Bao Bì Giấy TP.HCM
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
              className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 rounded-full pl-11 pr-24 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-1.5 rounded-full transition-colors shadow-sm"
            >
              Tìm Kiếm
            </button>
          </div>
        </form>

        {/* Right CTA */}
        <div className="flex items-center gap-3">
          <Link
            href="/bao-gia"
            className="hidden sm:inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-sm hover:shadow transition-all active:scale-95"
          >
            <Calculator className="w-4 h-4" />
            <span>Báo Giá Nhanh</span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors md:hidden"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Navigation Bar (Desktop) */}
      <nav className="hidden md:block border-t border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-6 overflow-x-auto py-2.5 text-sm font-medium text-slate-600 no-scrollbar">
            <Link href="/" className="hover:text-emerald-600 whitespace-nowrap transition-colors font-semibold text-emerald-700">
              Trang Chủ
            </Link>
            <Link href="/san-pham" className="hover:text-emerald-600 whitespace-nowrap transition-colors">
              Tất Cả Sản Phẩm
            </Link>
            {validCategories.map((cat) => (
              <Link
                key={cat.id}
                href={categoryHref(cat)}
                className="hover:text-emerald-600 whitespace-nowrap transition-colors"
              >
                {cleanCategoryName(cat.name)}
              </Link>
            ))}
            <Link href="/tin-tuc" className="hover:text-emerald-600 whitespace-nowrap transition-colors">
              Cẩm Nang In Ấn
            </Link>
            <Link href="/bao-gia" className="hover:text-emerald-600 whitespace-nowrap transition-colors text-emerald-600 font-semibold ml-auto flex items-center gap-1.5">
              <PackageCheck className="w-4 h-4" />
              Báo Giá Theo Yêu Cầu
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-3 shadow-xl">
          <form onSubmit={handleSearch} className="mb-4">
            <div className="relative">
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Tìm sản phẩm hộp giấy..."
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-900 outline-none focus:border-emerald-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </form>

          <div className="flex flex-col space-y-1 text-sm font-medium text-slate-700">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="py-2 px-3 rounded-lg hover:bg-slate-50 hover:text-emerald-600">
              Trang Chủ
            </Link>
            <Link href="/san-pham" onClick={() => setMobileMenuOpen(false)} className="py-2 px-3 rounded-lg hover:bg-slate-50 hover:text-emerald-600">
              Tất Cả Mẫu Hộp
            </Link>
            {validCategories.map((cat) => (
              <Link
                key={cat.id}
                href={categoryHref(cat)}
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 pl-4 rounded-lg hover:bg-emerald-50 hover:text-emerald-700 text-slate-600"
              >
                {cleanCategoryName(cat.name)}
              </Link>
            ))}
            <Link href="/tin-tuc" onClick={() => setMobileMenuOpen(false)} className="py-2 px-3 rounded-lg hover:bg-slate-50 hover:text-emerald-600">
              Tin Tức In Ấn
            </Link>
            <Link href="/bao-gia" onClick={() => setMobileMenuOpen(false)} className="py-2.5 px-3 rounded-lg bg-emerald-50 text-emerald-700 font-semibold mt-2">
              Yêu Cầu Báo Giá Nhanh
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
