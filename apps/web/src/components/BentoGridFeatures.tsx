import React from 'react';
import { Factory, Sparkles, Clock, Palette, ShieldCheck, DollarSign } from 'lucide-react';

export function BentoGridFeatures() {
  return (
    <section className="py-14 sm:py-20 bg-slate-50 border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 border border-emerald-200/70 px-3.5 py-1 rounded-full inline-block">
            Năng Lực Xưởng Sản Xuất
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mt-3 tracking-tight">
            Vì Sao 5.000+ Doanh Nghiệp Chọn HopGiayRe.vn?
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Giải pháp bao bì toàn diện từ thiết kế, in ấn đến gia công thành phẩm trực tiếp tại xưởng TP.HCM.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Card 1: Xưởng trực tiếp (Large) */}
          <div className="md:col-span-2 bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 relative overflow-hidden flex flex-col justify-between shadow-card hover:shadow-card-hover transition-all">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm">
                <Factory className="w-6 h-6" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                Quy Mô Xưởng 2.000m² - Sản Xuất Khép Kín
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md">
                Trang bị hệ thống máy in Offset Komori 4 màu, máy bồi sóng tự động, máy bế ép nhũ và dán hộp tốc độ cao. Chủ động 100% tiến độ và chất lượng từng lô hàng.
              </p>
            </div>
            <div className="mt-6 flex flex-wrap gap-2 text-xs font-semibold text-emerald-700">
              <span className="bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full">In Offset 4 màu</span>
              <span className="bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full">Bồi sóng E/B/C</span>
              <span className="bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full">Ép kim & Dập nổi</span>
            </div>
          </div>

          {/* Card 2: Giá tận gốc */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 flex flex-col justify-between shadow-card hover:shadow-card-hover transition-all">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center">
                <DollarSign className="w-5 h-5 font-bold" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Giá Gốc Tận Xưởng</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Không qua bất kỳ công ty trung gian nào, giúp bạn tiết kiệm từ 15% đến 25% chi phí bao bì.
              </p>
            </div>
            <div className="pt-4 text-xs font-semibold text-emerald-600">Tối ưu chi phí bao bì →</div>
          </div>

          {/* Card 3: Thiết kế miễn phí */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 flex flex-col justify-between shadow-card hover:shadow-card-hover transition-all">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center">
                <Palette className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Thiết Kế Mẫu 3D Free</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Đội ngũ designer tạo mock-up 3D trực quan, chỉnh sửa maket miễn phí đến khi khách hàng ưng ý.
              </p>
            </div>
            <div className="pt-4 text-xs font-semibold text-blue-600">Xem mẫu thiết kế →</div>
          </div>

          {/* Card 4: Nhận in số lượng ít */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 flex flex-col justify-between shadow-card hover:shadow-card-hover transition-all">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 text-purple-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Nhận In Từ 100 Hộp</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Hỗ trợ các shop online, startup, thương hiệu mới thử nghiệm sản phẩm với số lượng tối thiểu linh hoạt.
              </p>
            </div>
            <div className="pt-4 text-xs font-semibold text-purple-600">Hỗ trợ startup & shop →</div>
          </div>

          {/* Card 5: Giao hàng nhanh (Large) */}
          <div className="md:col-span-2 bg-gradient-to-br from-white to-slate-50 border border-slate-200/90 rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-card hover:shadow-card-hover transition-all">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Tiến Độ Đúng Hẹn 24h - 48h</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md">
                Đáp ứng đơn hàng gấp sự kiện, khai trương, xuất khẩu. Giao hàng tận nơi toàn quốc, hỗ trợ gửi chành xe các tỉnh miền Tây và Tây Nguyên.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-emerald-700">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Cam kết 100% hoàn tiền hoặc in lại nếu trễ hẹn cam kết</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
