import React from 'react';
import { Factory, Sparkles, Clock, Palette, ShieldCheck, DollarSign } from 'lucide-react';

export function BentoGridFeatures() {
  return (
    <section className="py-12 sm:py-16 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#A35424] bg-[#EADBC8]/60 px-3 py-1 rounded-full">
            Năng Lực Xưởng Sản Xuất
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#1A1412] mt-3 tracking-tight">
            Vì Sao 5.000+ Khách Hàng Chọn HopGiayRe.vn?
          </h2>
          <p className="text-sm text-[#7A522E] mt-2">
            Giải pháp bao bì toàn diện từ thiết kế, in ấn đến gia công thành phẩm tại xưởng TP.HCM.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Card 1: Xưởng trực tiếp (Large) */}
          <div className="md:col-span-2 bg-gradient-to-br from-[#FAF7F2] to-[#F5EFE6] border border-[#EADBC8] rounded-3xl p-6 sm:p-8 relative overflow-hidden flex flex-col justify-between shadow-soft hover:shadow-lifted transition-all">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#A35424] text-white flex items-center justify-center shadow-md">
                <Factory className="w-6 h-6" />
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-[#1A1412]">
                Quy Mô Xưởng 2.000m² - Sản Xuất Khép Kín
              </h3>
              <p className="text-xs sm:text-sm text-[#5C3C1E] leading-relaxed max-w-md">
                Trang bị hệ thống máy in Offset Komori 4 màu, máy bồi sóng tự động, máy bế ép nhũ và dán hộp tốc độ cao. Chủ động 100% tiến độ và chất lượng từng lô hàng.
              </p>
            </div>
            <div className="mt-6 flex flex-wrap gap-2 text-xs font-bold text-[#A35424]">
              <span className="bg-white/80 border border-[#DAC0A3] px-3 py-1 rounded-full">In Offset 4 màu</span>
              <span className="bg-white/80 border border-[#DAC0A3] px-3 py-1 rounded-full">Bồi sóng E/B/C</span>
              <span className="bg-white/80 border border-[#DAC0A3] px-3 py-1 rounded-full">Ép kim & Dập nổi</span>
            </div>
          </div>

          {/* Card 2: Giá tận gốc */}
          <div className="bg-white border border-[#EADBC8] rounded-3xl p-6 flex flex-col justify-between shadow-soft hover:shadow-lifted transition-all">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#F4C76B]/30 border border-[#F4C76B] text-[#713616] flex items-center justify-center">
                <DollarSign className="w-5 h-5 font-bold" />
              </div>
              <h3 className="text-lg font-black text-[#1A1412]">Giá Gốc Tận Xưởng</h3>
              <p className="text-xs text-[#7A522E] leading-relaxed">
                Không qua bất kỳ công ty trung gian nào, giúp bạn tiết kiệm từ 15% đến 25% chi phí bao bì.
              </p>
            </div>
            <div className="pt-4 text-xs font-bold text-[#A35424]">Tối ưu chi phí bao bì →</div>
          </div>

          {/* Card 3: Thiết kế miễn phí */}
          <div className="bg-white border border-[#EADBC8] rounded-3xl p-6 flex flex-col justify-between shadow-soft hover:shadow-lifted transition-all">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#A35424]/10 border border-[#A35424]/30 text-[#A35424] flex items-center justify-center">
                <Palette className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-black text-[#1A1412]">Thiết Kế Mẫu Miễn Phí</h3>
              <p className="text-xs text-[#7A522E] leading-relaxed">
                Đội ngũ thiết kế hỗ trợ lên mẫu 3D và chỉnh sửa layout in ấn đến khi bạn ưng ý nhất.
              </p>
            </div>
            <div className="pt-4 text-xs font-bold text-[#A35424]">Xem mẫu 3D trước khi in →</div>
          </div>

          {/* Card 4: Nhận số lượng ít */}
          <div className="bg-white border border-[#EADBC8] rounded-3xl p-6 flex flex-col justify-between shadow-soft hover:shadow-lifted transition-all">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-800 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-black text-[#1A1412]">Nhận In Từ 100 Hộp</h3>
              <p className="text-xs text-[#7A522E] leading-relaxed">
                Đồng hành cùng các shop khởi nghiệp và thương hiệu mới: không ép số lượng lớn, linh hoạt ngân sách.
              </p>
            </div>
            <div className="pt-4 text-xs font-bold text-emerald-700">Khởi đầu nhẹ nhàng →</div>
          </div>

          {/* Card 5: Giao hàng nhanh (Large 2 cols) */}
          <div className="md:col-span-2 bg-[#FAF7F2] border border-[#EADBC8] rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-soft hover:shadow-lifted transition-all">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#A35424] text-white flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-black text-[#1A1412]">Tiến Độ 24h - 48h Cho Đơn Hàng Gấp</h3>
              <p className="text-xs sm:text-sm text-[#5C3C1E] leading-relaxed">
                Với năng lực sản xuất 3 ca liên tục, chúng tôi đáp ứng hoàn hảo các chiến dịch chạy chương trình khuyến mãi, sự kiện khai trương hoặc cần hàng đóng gói gấp.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-3 text-xs font-bold text-[#A35424]">
              <span className="flex items-center gap-1">✓ Giao hàng tận nơi TP.HCM</span>
              <span className="flex items-center gap-1">✓ Gửi chành xe toàn quốc</span>
            </div>
          </div>

          {/* Card 6: Bảo hành 100% */}
          <div className="bg-white border border-[#EADBC8] rounded-3xl p-6 flex flex-col justify-between shadow-soft hover:shadow-lifted transition-all">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 border border-blue-300 text-blue-800 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-black text-[#1A1412]">Bảo Hành Chuẩn Màu</h3>
              <p className="text-xs text-[#7A522E] leading-relaxed">
                Cam kết in đúng file duyệt, đúng chất liệu giấy và sóng carton. Lỗi từ xưởng đổi 100% không mất phí.
              </p>
            </div>
            <div className="pt-4 text-xs font-bold text-blue-700">Yên tâm tuyệt đối →</div>
          </div>
        </div>
      </div>
    </section>
  );
}
