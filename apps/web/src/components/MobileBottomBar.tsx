import React from 'react';
import Link from 'next/link';
import { Phone, MessageCircle, Calculator } from 'lucide-react';

export function MobileBottomBar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 py-2 px-3 flex items-center justify-around gap-2 md:hidden shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
      <a
        href="tel:0985363679"
        className="flex-1 flex flex-col items-center justify-center py-1 rounded-xl bg-slate-50 text-slate-800 hover:bg-slate-100 transition-colors"
      >
        <Phone className="w-4 h-4 text-emerald-600 mb-0.5" />
        <span className="text-[11px] font-semibold">Gọi Điện</span>
      </a>

      <a
        href="https://zalo.me/0985363679"
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 flex flex-col items-center justify-center py-1 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
      >
        <MessageCircle className="w-4 h-4 text-blue-600 mb-0.5" />
        <span className="text-[11px] font-semibold">Zalo Xưởng</span>
      </a>

      <Link
        href="/bao-gia"
        className="flex-1 flex flex-col items-center justify-center py-1 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-sm"
      >
        <Calculator className="w-4 h-4 mb-0.5" />
        <span className="text-[11px] font-semibold">Báo Giá</span>
      </Link>
    </div>
  );
}
