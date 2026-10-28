'use client';

import React, { useState } from 'react';
import { Calculator, Send, CheckCircle2, Sparkles, MessageCircle } from 'lucide-react';
import { apiPost } from '../api/client';

export function QuickQuoteWidget() {
  const [length, setLength] = useState('20');
  const [width, setWidth] = useState('15');
  const [height, setHeight] = useState('10');
  const [material, setMaterial] = useState('Carton sóng E (Đóng hàng)');
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
    <div className="bg-white border-2 border-[#EADBC8] rounded-3xl p-6 sm:p-8 shadow-soft relative overflow-hidden">
      {/* Decorative craft accent badge */}
      <div className="absolute top-0 right-0 bg-[#A35424] text-white text-[11px] font-bold px-4 py-1 rounded-bl-2xl uppercase tracking-wider flex items-center gap-1">
        <Sparkles className="w-3 h-3 text-[#F4C76B]" />
        Báo giá trong 5 phút
      </div>

      <div className="flex items-center gap-2.5 mb-2">
        <div className="w-8 h-8 rounded-lg bg-[#FAF7F2] border border-[#DAC0A3] flex items-center justify-center text-[#A35424]">
          <Calculator className="w-4 h-4" />
        </div>
        <h3 className="text-xl font-black text-[#1A1412]">Ước Tính & Nhận Báo Giá Hộp</h3>
      </div>
      <p className="text-xs text-[#946C45] mb-6">
        Nhập quy cách hộp giấy của bạn, xưởng sẽ phản hồi chi phí in và sản xuất tốt nhất ngay lập tức.
      </p>

      {status === 'success' ? (
        <div className="bg-[#FAF7F2] border border-emerald-300 rounded-2xl p-6 text-center space-y-3">
          <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
          <h4 className="font-extrabold text-[#1A1412] text-base">Đã Gửi Yêu Cầu Báo Giá Thành Công!</h4>
          <p className="text-xs text-[#5C3C1E] leading-relaxed">
            Chuyên viên xưởng HopGiayRe sẽ liên hệ qua SĐT/Zalo <span className="font-bold text-[#A35424]">{phone}</span> trong vòng 5 - 15 phút.
          </p>
          <button
            onClick={() => setStatus('idle')}
            className="text-xs font-bold text-[#A35424] hover:underline pt-2 block mx-auto"
          >
            Gửi yêu cầu hộp khác
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Dimension Inputs */}
          <div>
            <label className="block text-xs font-bold text-[#5C3C1E] mb-1.5">
              1. Kích thước mong muốn (Dài x Rộng x Cao cm)
            </label>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <input
                  type="number"
                  value={length}
                  onChange={(e) => setLength(e.target.value)}
                  placeholder="Dài"
                  className="w-full bg-[#FAF7F2] border border-[#DAC0A3] focus:border-[#A35424] rounded-xl px-3 py-2 text-sm text-center font-bold text-[#1A1412] outline-none"
                  required
                />
                <span className="block text-[10px] text-center text-[#946C45] mt-0.5">Dài (cm)</span>
              </div>
              <div>
                <input
                  type="number"
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  placeholder="Rộng"
                  className="w-full bg-[#FAF7F2] border border-[#DAC0A3] focus:border-[#A35424] rounded-xl px-3 py-2 text-sm text-center font-bold text-[#1A1412] outline-none"
                  required
                />
                <span className="block text-[10px] text-center text-[#946C45] mt-0.5">Rộng (cm)</span>
              </div>
              <div>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="Cao"
                  className="w-full bg-[#FAF7F2] border border-[#DAC0A3] focus:border-[#A35424] rounded-xl px-3 py-2 text-sm text-center font-bold text-[#1A1412] outline-none"
                  required
                />
                <span className="block text-[10px] text-center text-[#946C45] mt-0.5">Cao (cm)</span>
              </div>
            </div>
          </div>

          {/* Material & Quantity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#5C3C1E] mb-1">2. Loại hộp & chất liệu</label>
              <select
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#DAC0A3] focus:border-[#A35424] rounded-xl px-3 py-2 text-xs font-medium text-[#1A1412] outline-none"
              >
                <option value="Carton sóng E (Đóng hàng COD)">Carton sóng E (Đóng hàng COD)</option>
                <option value="Carton sóng B/C (Chịu lực cao)">Carton sóng B/C (Chịu lực cao)</option>
                <option value="Hộp cứng cao cấp (Âm dương, quà tặng)">Hộp cứng cao cấp (Quà tặng, yến)</option>
                <option value="Giấy Kraft nâu mộc vintage">Giấy Kraft nâu mộc (Môi trường)</option>
                <option value="Giấy Ivory/Duplex (Bánh, mỹ phẩm)">Giấy Ivory/Duplex (Mỹ phẩm, bánh)</option>
                <option value="Túi giấy quai xách">Túi giấy quai xách</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#5C3C1E] mb-1">3. Số lượng in dự kiến</label>
              <select
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#DAC0A3] focus:border-[#A35424] rounded-xl px-3 py-2 text-xs font-medium text-[#1A1412] outline-none"
              >
                <option value="100 - 300">100 - 300 hộp (Số lượng ít)</option>
                <option value="500">500 hộp (Phổ biến)</option>
                <option value="1.000">1.000 hộp (Giá tối ưu)</option>
                <option value="2.000 - 5.000">2.000 - 5.000 hộp</option>
                <option value="10.000+">10.000+ hộp (Giá sỉ xưởng)</option>
              </select>
            </div>
          </div>

          {/* Contact Input */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-xs font-bold text-[#5C3C1E] mb-1">Tên của bạn (tuỳ chọn)</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Anh/Chị..."
                className="w-full bg-[#FAF7F2] border border-[#DAC0A3] rounded-xl px-3 py-2 text-xs text-[#1A1412] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#5C3C1E] mb-1">
                Số điện thoại / Zalo <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0985 xxx xxx"
                className="w-full bg-[#FAF7F2] border border-[#DAC0A3] focus:border-[#A35424] rounded-xl px-3 py-2 text-xs font-bold text-[#1A1412] outline-none"
                required
              />
            </div>
          </div>

          {errorMessage && <p className="text-xs text-red-500 font-medium">{errorMessage}</p>}

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="inline-flex items-center justify-center gap-2 bg-[#A35424] hover:bg-[#713616] text-white text-xs font-extrabold py-3 px-4 rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              {status === 'submitting' ? 'Đang gửi...' : 'Nhận Báo Giá Nhanh'}
            </button>

            <button
              type="button"
              onClick={directZalo}
              className="inline-flex items-center justify-center gap-2 bg-[#0068FF] hover:bg-[#0055d4] text-white text-xs font-extrabold py-3 px-4 rounded-xl shadow-md transition-all active:scale-95"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              Báo Giá Qua Zalo
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
