import React from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin, ShieldCheck, Clock, Truck, Award } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#1A1412] text-[#FAF7F2] pt-14 pb-20 md:pb-12 border-t-4 border-[#A35424]">
      {/* Top Value Propositions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-12 border-b border-[#3D2713]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#A35424]/20 border border-[#A35424]/40 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5 text-[#F4C76B]" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">Giá Gốc Tại Xưởng</h4>
              <p className="text-xs text-[#DAC0A3] mt-1 leading-relaxed">
                Sản xuất trực tiếp tại xưởng TP.HCM, không qua thương mại, tiết kiệm 15-20%.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#A35424]/20 border border-[#A35424]/40 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 text-[#F4C76B]" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">Giao Hàng Siêu Tốc</h4>
              <p className="text-xs text-[#DAC0A3] mt-1 leading-relaxed">
                Máy in chạy liên tục 24/7, đáp ứng đơn hàng gấp trong 24h - 48h.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#A35424]/20 border border-[#A35424]/40 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-[#F4C76B]" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">Đổi Trả 100% Miễn Phí</h4>
              <p className="text-xs text-[#DAC0A3] mt-1 leading-relaxed">
                Bảo hành chuẩn màu in và kích thước. Đổi mới 100% nếu có lỗi từ xưởng.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#A35424]/20 border border-[#A35424]/40 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5 text-[#F4C76B]" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">Vận Chuyển Toàn Quốc</h4>
              <p className="text-xs text-[#DAC0A3] mt-1 leading-relaxed">
                Hỗ trợ giao chành xe và ship tận nơi trên toàn quốc an toàn, tiết kiệm.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Col 1: About */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#A35424] flex items-center justify-center text-white font-extrabold text-base">
              H
            </div>
            <span className="text-xl font-black text-white">
              HopGiay<span className="text-[#A35424]">Re</span>.vn
            </span>
          </div>
          <p className="text-xs text-[#DAC0A3] leading-relaxed">
            Chuyên sản xuất thùng carton sóng, hộp cứng quà tặng cao cấp, hộp giấy mỹ phẩm, thức ăn nhanh và túi giấy theo yêu cầu tại TP.HCM.
          </p>
          <div className="text-xs text-[#B89774] space-y-1">
            <p>Xưởng sản xuất: TP. Hồ Chí Minh</p>
            <p>Hotline/Zalo: 0985 363 679</p>
            <p>Email: hotro@hopgiayre.vn</p>
          </div>
        </div>

        {/* Col 2: Danh Mục Sản Phẩm */}
        <div>
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-[#A35424] pl-2.5">
            Sản Phẩm Chủ Lực
          </h4>
          <ul className="space-y-2.5 text-xs text-[#DAC0A3]">
            <li><Link href="/san-pham" className="hover:text-white transition-colors">Hộp Carton Đóng Hàng COD</Link></li>
            <li><Link href="/san-pham" className="hover:text-white transition-colors">Hộp Cứng Quà Tặng Âm Dương</Link></li>
            <li><Link href="/san-pham" className="hover:text-white transition-colors">Hộp Giấy Kraft Nâu Mộc</Link></li>
            <li><Link href="/san-pham" className="hover:text-white transition-colors">Hộp Giấy Đựng Bánh / Fastfood</Link></li>
            <li><Link href="/san-pham" className="hover:text-white transition-colors">Túi Giấy Quai Xách Theo Yêu Cầu</Link></li>
          </ul>
        </div>

        {/* Col 3: Dịch vụ & Chính Sách */}
        <div>
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-[#A35424] pl-2.5">
            Dịch Vụ & Hỗ Trợ
          </h4>
          <ul className="space-y-2.5 text-xs text-[#DAC0A3]">
            <li><Link href="/bao-gia" className="hover:text-white transition-colors">Quy Trình Báo Giá & Đặt Hàng</Link></li>
            <li><Link href="/tin-tuc" className="hover:text-white transition-colors">Cẩm Nang & Kinh Nghiệm Chọn Hộp</Link></li>
            <li><span className="text-[#946C45]">Chính sách đổi trả & bảo hành</span></li>
            <li><span className="text-[#946C45]">Chính sách vận chuyển & giao nhận</span></li>
            <li><Link href="/admin" className="hover:text-white transition-colors text-[#946C45]">Quản trị hệ thống</Link></li>
          </ul>
        </div>

        {/* Col 4: Hỗ trợ tư vấn */}
        <div>
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-[#A35424] pl-2.5">
            Tư Vấn Trực Tiếp 24/7
          </h4>
          <p className="text-xs text-[#DAC0A3] mb-3 leading-relaxed">
            Gửi yêu cầu kích thước (Dài x Rộng x Cao) qua Zalo để nhận báo giá chi tiết sau 5 phút:
          </p>
          <a
            href="https://zalo.me/0985363679"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 w-full bg-[#A35424] hover:bg-[#713616] text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-md transition-colors"
          >
            Chat Zalo Báo Giá Ngay
          </a>
          <div className="mt-3 text-center">
            <a href="tel:0985363679" className="text-sm font-bold text-[#F4C76B] hover:underline">
              Hotline: 0985 363 679
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 border-t border-[#3D2713] text-center text-xs text-[#946C45]">
        <p>© {new Date().getFullYear()} HopGiayRe.vn. All rights reserved. Xưởng in & sản xuất bao bì giấy giá rẻ uy tín.</p>
      </div>
    </footer>
  );
}
