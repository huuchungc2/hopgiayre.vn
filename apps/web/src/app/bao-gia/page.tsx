'use client';

import React, { useState } from 'react';
import { Calculator, Send, CheckCircle2, Phone, MessageCircle, Sparkles, ShieldCheck } from 'lucide-react';
import { apiPost } from '../../api/client';

export default function QuotePage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    boxType: 'Hộp carton sóng E đóng hàng COD',
    dimensions: '',
    quantity: '500',
    notes: '',
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      setErrorMessage('Vui lòng nhập Họ tên và Số điện thoại/Zalo');
      return;
    }

    setStatus('submitting');
    setErrorMessage('');

    const content = `[YÊU CẦU BÁO GIÁ CHI TIẾT]:
- Khách hàng: ${formData.name}
- SĐT/Zalo: ${formData.phone}
- Email: ${formData.email || 'Không có'}
- Địa chỉ: ${formData.address || 'Không có'}
- Loại hộp: ${formData.boxType}
- Kích thước: ${formData.dimensions || 'Theo tư vấn'}
- Số lượng: ${formData.quantity} hộp
- Ghi chú: ${formData.notes || 'Không có'}`;

    try {
      await apiPost('/user/sendinfo', {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        content,
      });
      setStatus('success');
    } catch {
      // Fallback to Zalo if API has issues
      const zaloUrl = `https://zalo.me/0985363679?text=${encodeURIComponent(content)}`;
      window.open(zaloUrl, '_blank');
      setStatus('success');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 border border-emerald-200 px-3.5 py-1 rounded-full inline-flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          Tiết Kiệm 20% Chi Phí Tận Xưởng
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
          Yêu Cầu Báo Giá Sản Xuất Hộp Giấy & Bao Bì
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Gửi thông tin quy cách hộp giấy của bạn, đội ngũ kỹ thuật xưởng in HopGiayRe.vn sẽ gửi bảng báo giá chi tiết và tối ưu chi phí nhất sau 5 - 15 phút.
        </p>
      </div>

      {/* Main Quote Form */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-sm">
        {status === 'success' ? (
          <div className="text-center py-8 space-y-4 max-w-md mx-auto">
            <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto" />
            <h2 className="text-2xl font-bold text-slate-900">Đã Gửi Thành Công!</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Cảm ơn <span className="font-semibold text-emerald-700">{formData.name}</span>! Chúng tôi đã tiếp nhận yêu cầu báo giá và sẽ gọi điện/nhắn tin Zalo qua số <span className="font-semibold text-emerald-700">{formData.phone}</span> sớm nhất.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="https://zalo.me/0985363679"
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-6 py-3 rounded-xl shadow-sm inline-flex items-center justify-center gap-2 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                Chat Zalo Với Xưởng Ngay
              </a>
              <button
                type="button"
                onClick={() => setStatus('idle')}
                className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold px-6 py-3 rounded-xl hover:bg-slate-100 transition-colors"
              >
                Gửi thêm yêu cầu khác
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: Customer details */}
              <div className="space-y-4">
                <h3 className="font-bold text-sm uppercase tracking-wider text-emerald-700 border-b border-slate-100 pb-2">
                  1. Thông Tin Khách Hàng
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Nguyễn Văn A..."
                    className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 rounded-lg px-3.5 py-2.5 text-xs text-slate-900 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Số điện thoại / Zalo <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="0985 xxx xxx"
                    className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 rounded-lg px-3.5 py-2.5 text-xs font-semibold text-slate-900 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email (tuỳ chọn)</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="email@example.com"
                    className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 rounded-lg px-3.5 py-2.5 text-xs text-slate-900 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Địa chỉ giao hàng</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Quận/Huyện, Tỉnh/Thành phố..."
                    className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 rounded-lg px-3.5 py-2.5 text-xs text-slate-900 outline-none"
                  />
                </div>
              </div>

              {/* Right Column: Packaging specifications */}
              <div className="space-y-4">
                <h3 className="font-bold text-sm uppercase tracking-wider text-emerald-700 border-b border-slate-100 pb-2">
                  2. Quy Cách Hộp Cần Báo Giá
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Loại hộp giấy</label>
                  <select
                    name="boxType"
                    value={formData.boxType}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 rounded-lg px-3.5 py-2.5 text-xs font-medium text-slate-900 outline-none"
                  >
                    <option value="Hộp carton sóng E đóng hàng COD">Hộp carton sóng E (Đóng hàng COD)</option>
                    <option value="Hộp carton sóng B/C (Chịu lực cao)">Hộp carton sóng B/C (Chịu lực cao)</option>
                    <option value="Hộp cứng cao cấp (Quà tặng, yến, bánh)">Hộp cứng cao cấp (Âm dương, nam châm)</option>
                    <option value="Hộp giấy Kraft nâu mộc">Hộp giấy Kraft nâu mộc vintage</option>
                    <option value="Hộp giấy Ivory/Duplex đựng bánh, mỹ phẩm">Hộp giấy Ivory/Duplex (Bánh, mỹ phẩm)</option>
                    <option value="Túi giấy quai xách thương hiệu">Túi giấy quai xách thương hiệu</option>
                    <option value="Khác (Quy cách đặc biệt)">Khác (Quy cách đặc biệt theo yêu cầu)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kích thước Dài x Rộng x Cao (cm)
                  </label>
                  <input
                    type="text"
                    name="dimensions"
                    value={formData.dimensions}
                    onChange={handleChange}
                    placeholder="Ví dụ: 25 x 18 x 10 cm"
                    className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 rounded-lg px-3.5 py-2.5 text-xs text-slate-900 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Số lượng dự kiến</label>
                  <select
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 rounded-lg px-3.5 py-2.5 text-xs font-medium text-slate-900 outline-none"
                  >
                    <option value="100 - 300">100 - 300 hộp (Số lượng ít)</option>
                    <option value="500">500 hộp (Tiết kiệm)</option>
                    <option value="1.000">1.000 hộp (Giá tối ưu nhất)</option>
                    <option value="2.000 - 5.000">2.000 - 5.000 hộp</option>
                    <option value="10.000+">10.000+ hộp (Giá xưởng quy mô lớn)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Ghi chú thêm</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={2}
                    placeholder="In mấy màu, có cán màng không, thời gian cần hàng..."
                    className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 rounded-lg px-3.5 py-2 text-xs text-slate-900 outline-none"
                  />
                </div>
              </div>
            </div>

            {errorMessage && (
              <p className="text-xs text-red-600 font-semibold bg-red-50 p-3 rounded-xl border border-red-200">
                {errorMessage}
              </p>
            )}

            {/* Submit Action */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200">
              <div className="flex items-center gap-4 text-xs text-slate-600">
                <span className="flex items-center gap-1 font-semibold">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  Hotline: 0985 363 679
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 font-semibold text-blue-600">
                  <MessageCircle className="w-3.5 h-3.5" />
                  Zalo 24/7
                </span>
              </div>

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold py-3 px-8 rounded-xl shadow-sm transition-all active:scale-95 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                {status === 'submitting' ? 'Đang gửi yêu cầu...' : 'Nhận Báo Giá Ngay'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
