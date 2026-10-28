import React from 'react';
import Link from 'next/link';
import { Phone, MessageCircle, Calculator } from 'lucide-react';

export function MobileBottomBar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#EADBC8] py-2 px-3 flex items-center justify-around gap-2 md:hidden shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
      <a
        href="tel:0985363679"
        className="flex-1 flex flex-col items-center justify-center py-1 rounded-xl bg-[#FAF7F2] text-[#1A1412] hover:bg-[#F5EFE6] transition-colors"
      >
        <Phone className="w-4 h-4 text-[#A35424] mb-0.5" />
        <span className="text-[11px] font-bold">Gọi Điện</span>
      </a>

      <a
        href="https://zalo.me/0985363679"
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 flex flex-col items-center justify-center py-1 rounded-xl bg-[#0068FF]/10 text-[#0068FF] hover:bg-[#0068FF]/20 transition-colors"
      >
        <MessageCircle className="w-4 h-4 text-[#0068FF] mb-0.5" />
        <span className="text-[11px] font-bold">Zalo Xưởng</span>
      </a>

      <Link
        href="/bao-gia"
        className="flex-1 flex flex-col items-center justify-center py-1 rounded-xl bg-[#A35424] text-white hover:bg-[#713616] transition-colors shadow-sm"
      >
        <Calculator className="w-4 h-4 text-[#F4C76B] mb-0.5" />
        <span className="text-[11px] font-bold">Báo Giá</span>
      </Link>
    </div>
  );
}
