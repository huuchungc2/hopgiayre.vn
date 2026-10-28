'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Phone, Search, Calculator, ShieldCheck, Sparkles, MessageCircle, ChevronDown, Package, Layers, Gift, ShoppingBag, BookOpen } from 'lucide-react';
import type { Category } from '../types/domain';
import { categoryHref } from '../utils/format';

interface HeaderProps {
  categories?: Category[];
}

export function Header({ categories = [] }: HeaderProps) {
  const [keyword, setKeyword] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [boxDropdownOpen, setBoxDropdownOpen] = useState(false);
  const [rigidDropdownOpen, setRigidDropdownOpen] = useState(false);
  const [bagDropdownOpen, setBagDropdownOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyword.trim()) {
      window.location.href = `/san-pham?q=${encodeURIComponent(keyword.trim())}`;
    }
  };

  // Group categories logically into clean clusters
  const paperBoxCats = categories.filter((c) =>
    /giấy|carton|mỹ phẩm|bánh/i.test(c.name) && !/cứng|quà tặng|túi/i.test(c.name)
  ).slice(0, 5);

  const rigidBoxCats = categories.filter((c) =>
    /cứng|quà tặng|yến|rượu/i.test(c.name)
  ).slice(0, 5);

  const bagCats = categories.filter((c) =>
    /túi|tem|nhãn|catalogue/i.test(c.name)
  ).slice(0, 5);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 transition-all">
      {/* Top Banner */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-medium text-emerald-400">
              <Sparkles className="w-3.5 h-3.5" />
              Xưởng sản xuất trực tiếp - Giá rẻ hơn 20%
            </span>
            <span className="hidden md:inline-block text-slate-600">•</span>
            <span className="hidden md:flex items-center gap-1 text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Cam kết đổi trả 100% nếu sai quy cách
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0 group">
          <img
            src="/images/logo.svg"
            alt="HopGiayRe.vn - Xưởng in hộp giấy giá rẻ"
            className="h-10 sm:h-11 w-auto object-contain transition-transform group-hover:scale-[1.02]"
          />
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="hidden lg:flex items-center flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Tìm mẫu hộp, kích thước D x R x C..."
              className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 rounded-full pl-10 pr-24 py-2 text-xs text-slate-900 placeholder-slate-400 outline-none transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <button
              type="submit"
              className="absolute right-1 top-1/2 -translate-y-1/2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3.5 py-1.5 rounded-full transition-colors"
            >
              Tìm Kiếm
            </button>
          </div>
        </form>

        {/* Right CTA */}
        <div className="flex items-center gap-2.5">
          <Link
            href="/bao-gia"
            className="hidden sm:inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-sm hover:shadow transition-all active:scale-95"
          >
            <Calculator className="w-4 h-4" />
            <span>Báo Giá Nhanh 5 Phút</span>
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

      {/* Compact Curated Navigation Bar (Desktop) */}
      <nav className="hidden md:block border-t border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-1 py-1.5 text-xs font-semibold text-slate-700">
            {/* 1. Trang Chủ */}
            <Link
              href="/"
              className="px-3.5 py-2 rounded-lg hover:text-emerald-700 hover:bg-emerald-50 transition-colors font-bold text-emerald-700"
            >
              Trang Chủ
            </Link>

            {/* 2. Hộp Giấy & Carton (Dropdown) */}
            <div
              className="relative"
              onMouseEnter={() => setBoxDropdownOpen(true)}
              onMouseLeave={() => setBoxDropdownOpen(false)}
            >
              <button
                type="button"
                className="flex items-center gap-1 px-3.5 py-2 rounded-lg hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
              >
                <Package className="w-3.5 h-3.5 text-emerald-600" />
                <span>Hộp Giấy & Carton</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {boxDropdownOpen && (
                <div className="absolute top-full left-0 w-64 bg-white border border-slate-200 rounded-xl shadow-lifted py-2 z-50">
                  <Link
                    href="/san-pham"
                    className="block px-4 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-50 border-b border-slate-100"
                  >
                    Tất cả mẫu hộp giấy →
                  </Link>
                  {paperBoxCats.map((cat) => (
                    <Link
                      key={cat.id}
                      href={categoryHref(cat)}
                      className="block px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-emerald-700 transition-colors"
                    >
                      {cat.name.replace(/^In\s+/i, '')}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* 3. Hộp Cứng Quà Tặng (Dropdown) */}
            <div
              className="relative"
              onMouseEnter={() => setRigidDropdownOpen(true)}
              onMouseLeave={() => setRigidDropdownOpen(false)}
            >
              <button
                type="button"
                className="flex items-center gap-1 px-3.5 py-2 rounded-lg hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
              >
                <Gift className="w-3.5 h-3.5 text-emerald-600" />
                <span>Hộp Cứng Cao Cấp</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {rigidDropdownOpen && (
                <div className="absolute top-full left-0 w-64 bg-white border border-slate-200 rounded-xl shadow-lifted py-2 z-50">
                  {rigidBoxCats.map((cat) => (
                    <Link
                      key={cat.id}
                      href={categoryHref(cat)}
                      className="block px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-emerald-700 transition-colors"
                    >
                      {cat.name.replace(/^In\s+/i, '')}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* 4. Túi Giấy & Tem Nhãn (Dropdown) */}
            <div
              className="relative"
              onMouseEnter={() => setBagDropdownOpen(true)}
              onMouseLeave={() => setBagDropdownOpen(false)}
            >
              <button
                type="button"
                className="flex items-center gap-1 px-3.5 py-2 rounded-lg hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-emerald-600" />
                <span>Túi Giấy Thương Hiệu</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {bagDropdownOpen && (
                <div className="absolute top-full left-0 w-60 bg-white border border-slate-200 rounded-xl shadow-lifted py-2 z-50">
                  {bagCats.map((cat) => (
                    <Link
                      key={cat.id}
                      href={categoryHref(cat)}
                      className="block px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-emerald-700 transition-colors"
                    >
                      {cat.name.replace(/^In\s+/i, '')}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* 5. Cẩm Nang In */}
            <Link
              href="/tin-tuc"
              className="flex items-center gap-1 px-3.5 py-2 rounded-lg hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
              <span>Cẩm Nang In Ấn</span>
            </Link>

            {/* 6. Báo Giá Nhanh (Right aligned) */}
            <Link
              href="/bao-gia"
              className="ml-auto flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold transition-colors"
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Bảng Báo Giá Theo Yêu Cầu</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-3 shadow-xl max-h-[85vh] overflow-y-auto">
          <form onSubmit={handleSearch} className="mb-4">
            <div className="relative">
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Tìm sản phẩm hộp giấy..."
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-xs text-slate-900 outline-none focus:border-emerald-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </form>

          <div className="flex flex-col space-y-1 text-xs font-semibold text-slate-700">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="py-2 px-3 rounded-lg hover:bg-slate-50 hover:text-emerald-600">
              Trang Chủ
            </Link>
            <Link href="/san-pham" onClick={() => setMobileMenuOpen(false)} className="py-2 px-3 rounded-lg hover:bg-slate-50 hover:text-emerald-600">
              Tất Cả Mẫu Hộp
            </Link>
            
            <div className="py-1 px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Hộp Giấy & Carton</div>
            {paperBoxCats.map((cat) => (
              <Link
                key={cat.id}
                href={categoryHref(cat)}
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 pl-6 text-slate-600 hover:text-emerald-700"
              >
                {cat.name.replace(/^In\s+/i, '')}
              </Link>
            ))}

            <div className="py-1 px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider pt-2">Hộp Cứng Cao Cấp</div>
            {rigidBoxCats.map((cat) => (
              <Link
                key={cat.id}
                href={categoryHref(cat)}
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 pl-6 text-slate-600 hover:text-emerald-700"
              >
                {cat.name.replace(/^In\s+/i, '')}
              </Link>
            ))}

            <div className="py-1 px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider pt-2">Túi Giấy</div>
            {bagCats.map((cat) => (
              <Link
                key={cat.id}
                href={categoryHref(cat)}
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 pl-6 text-slate-600 hover:text-emerald-700"
              >
                {cat.name.replace(/^In\s+/i, '')}
              </Link>
            ))}

            <Link href="/tin-tuc" onClick={() => setMobileMenuOpen(false)} className="py-2 px-3 rounded-lg hover:bg-slate-50 hover:text-emerald-600 pt-3">
              Cẩm Nang In Ấn
            </Link>
            <Link href="/bao-gia" onClick={() => setMobileMenuOpen(false)} className="py-2.5 px-3 rounded-lg bg-emerald-600 text-white font-bold mt-2 text-center">
              Yêu Cầu Báo Giá Nhanh
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
