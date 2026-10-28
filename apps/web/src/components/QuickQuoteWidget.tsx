'use client';

import React, { useState } from 'react';
import { Calculator, Send, CheckCircle2, Sparkles, MessageCircle, ArrowRight } from 'lucide-react';
import { apiPost } from '../api/client';

export function QuickQuoteWidget() {
  const [length, setLength] = useState('20');
  const [width, setWidth] = useState('15');
  const [height, setHeight] = useState('10');
  const [material, setMaterial] = useState('Carton sóng E (Đóng hàng, ship COD)');
  const [quantity, setQuantity] = useState('500');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) {
      setErrorMessage('Vui lòng nhập số điện thoại hoặc Zalo');
      return;
    }
    setStatus('submitting');
    setErrorMessage('');

    const content = `[Yêu cầu báo giá nhanh]:\n- Kích thước: ${length} x ${width} x ${height} cm\n- Chất liệu: ${material}\n- Số lượng dự kiến: ${quantity} hộp\n- Khách hàng: ${name || 'Khách web'}`;

    try {
      await apiPost('/user/sendinfo', {
        name: name || 'Khách web',
        phone,
        content,
      });
      setStatus('success');
    } catch (err: any) {
      // Fallback: If API returns error or fails, open Zalo with prefilled text
      const zaloUrl = `https://zalo.me/0985363679?text=${encodeURIComponent(content + `\nSĐT liên hệ: ${phone}`)}`;
      window.open(zaloUrl, '_blank');
      setStatus('success');
    }
  };

  const directZalo = () => {
    const text = `Chào xưởng HopGiayRe.vn, mình cần tư vấn và báo giá hộp:\n- Kích thước: ${length}x${width}x${height} cm\n- Chất liệu: ${material}\n- Số lượng: ${quantity} hộp`;
    window.open(`https://zalo.me/0985363679?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-sm relative overflow-hidden">
      {/* Top accent badge */}
      <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[11px] font-semibold px-3.5 py-1 rounded-bl-xl uppercase tracking-wider flex items-center gap-1">
        <Sparkles className="w-3 h-3 text-emerald-200" />
        Báo giá trong 5 phút
      </div>

      <div className="flex items-center gap-2.5 mb-2">
        <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
          <Calculator className="w-4 h-4" />
        </div>
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">Tính Giá In Hộp Theo Kích Thước</h2>
      </div>
      <p className="text-xs text-slate-500 mb-5">
        Nhập số đo phủ bì hộp (Dài x Rộng x Cao) để nhận bảng giá sỉ tốt nhất.
      </p>

      {status === 'success' ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 text-center space-y-3 my-4">
          <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
          <h4 className="font-bold text-emerald-950 text-base">Đã Gửi Yêu Cầu Thành Công!</h4>
          <p className="text-xs text-emerald-800">
            Chuyên viên tư vấn của xưởng sẽ liên hệ lại qua SĐT/Zalo <strong>{phone}</strong> trong vòng 5 phút để gửi thiết kế 3D và báo giá chi tiết.
          </p>
          <button
            onClick={() => setStatus('idle')}
            className="text-xs font-semibold text-emerald-700 underline pt-2"
          >
            Gửi thêm yêu cầu kích thước khác
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Dimension Grid */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Kích thước hộp (Dài x Rộng x Cao cm):
            </label>
            <div className="grid grid-cols-3 gap-2">
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  value={length}
                  onChange={(e) => setLength(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-xs font-semibold text-slate-900 outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
                  placeholder="Dài"
                  required
                />
                <span className="absolute right-2 top-2 text-[10px] text-slate-400 font-medium">cm</span>
              </div>

              <div className="relative">
                <input
                  type="number"
                  min="1"
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-xs font-semibold text-slate-900 outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
                  placeholder="Rộng"
                  required
                />
                <span className="absolute right-2 top-2 text-[10px] text-slate-400 font-medium">cm</span>
              </div>

              <div className="relative">
                <input
                  type="number"
                  min="1"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-xs font-semibold text-slate-900 outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
                  placeholder="Cao"
                  required
                />
                <span className="absolute right-2 top-2 text-[10px] text-slate-400 font-medium">cm</span>
              </div>
            </div>
          </div>

          {/* Material & Quantity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Loại hộp:</label>
              <select
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-xs font-medium text-slate-900 outline-none focus:bg-white focus:border-emerald-500"
              >
                <option value="Carton sóng E (Đóng hàng, ship COD)">Carton sóng E (Ship COD)</option>
                <option value="Carton sóng B/C (Chịu lực cao)">Carton sóng B/C (Nặng)</option>
                <option value="Hộp cứng cao cấp (Quà tặng, mỹ phẩm)">Hộp cứng cao cấp</option>
                <option value="Hộp giấy Kraft bảo vệ môi trường">Hộp giấy Kraft</option>
                <option value="Hộp giấy Ivory/Duplex in Offset">Hộp Ivory / Duplex</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Số lượng dự kiến:</label>
              <select
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-xs font-medium text-slate-900 outline-none focus:bg-white focus:border-emerald-500"
              >
                <option value="100">100 hộp (SL ít)</option>
                <option value="300">300 hộp</option>
                <option value="500">500 hộp (Phổ biến)</option>
                <option value="1000">1.000 hộp (Giá tốt)</option>
                <option value="2000">2.000 hộp trở lên (Giá sỉ)</option>
              </select>
            </div>
          </div>

          {/* Contact Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tên khách hàng:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Anh / Chị..."
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-xs font-medium text-slate-900 outline-none focus:bg-white focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Số ĐT / Zalo <span className="text-red-500">*</span>:
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0985 xxx xxx"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-xs font-semibold text-slate-900 outline-none focus:bg-white focus:border-emerald-500"
                required
              />
            </div>
          </div>

          {errorMessage && (
            <p className="text-xs text-red-600 font-medium">{errorMessage}</p>
          )}

          {/* Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs py-2.5 px-4 rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5 active:scale-95 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{status === 'submitting' ? 'Đang gửi...' : 'Nhận Báo Giá Trong 5 Phút'}</span>
            </button>

            <button
              type="button"
              onClick={directZalo}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold py-2.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <MessageCircle className="w-3.5 h-3.5 text-blue-600" />
              <span>Chat Zalo</span>
            </button>
          </div>
        </form>
      )}

      {/* Trust Footer */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <span className="flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Miễn phí thiết kế 3D
        </span>
        <span className="flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> In mẫu trước khi sản xuất
        </span>
      </div>
    </div>
  );
}
