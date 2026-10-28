'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { FaqSchema } from './seo/JsonLd';

const FAQ_ITEMS = [
  {
    question: 'Xưởng HopGiayRe.vn nhận in số lượng tối thiểu bao nhiêu hộp?',
    answer:
      'Chúng tôi hỗ trợ nhận in từ số lượng ít chỉ từ 100 - 300 hộp cho các shop mới hoặc thử nghiệm mẫu mới. Với các đơn hàng từ 1.000 hộp trở lên, bạn sẽ nhận được mức giá sỉ tận xưởng tối ưu nhất.',
  },
  {
    question: 'Thời gian sản xuất và giao hàng mất bao lâu?',
    answer:
      'Thông thường từ 3 - 5 ngày làm việc sau khi chốt file thiết kế và duyệt mẫu. Với các đơn hàng cần gấp để chạy sự kiện, xưởng có thể tăng ca hỗ trợ hoàn thành trong vòng 24h - 48h.',
  },
  {
    question: 'Tôi chưa có file thiết kế, xưởng có hỗ trợ thiết kế không?',
    answer:
      'Có! Đội ngũ thiết kế của HopGiayRe.vn sẽ hỗ trợ lên mẫu thiết kế 3D, bố cục logo, thông tin thương hiệu hoàn toàn miễn phí cho đến khi bạn ưng ý mới tiến hành xuất bản in.',
  },
  {
    question: 'Xưởng có hỗ trợ in mẫu thử (sample) trước khi sản xuất hàng loạt không?',
    answer:
      'Có. Với các đơn hàng in offset số lượng hoặc hộp cứng cao cấp, chúng tôi hỗ trợ in test màu hoặc cắt mẫu trắng để khách hàng kiểm tra kích thước và form dáng thực tế trước khi chạy hàng loạt.',
  },
  {
    question: 'Quy trình đặt in và thanh toán như thế nào?',
    answer:
      'Bước 1: Bạn gửi kích thước (Dài x Rộng x Cao) và số lượng qua Zalo hoặc Form báo giá. Bước 2: Nhận báo giá sau 5 phút. Bước 3: Lên maket thiết kế duyệt in. Bước 4: Đặt cọc 50% để xưởng chạy hàng. Bước 5: Kiểm tra hàng tận nơi và thanh toán phần còn lại khi nhận hàng.',
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-14 sm:py-20 bg-white border-t border-slate-200">
      <FaqSchema items={FAQ_ITEMS} />
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 border border-emerald-200 px-3.5 py-1 rounded-full inline-flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5" />
            Hỏi Đáp & Tư Vấn
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-3 tracking-tight">
            Những Câu Hỏi Thường Gặp Khi Đặt In Hộp Giấy
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Giải đáp nhanh các thắc mắc về số lượng, giá cả, thời gian và chính sách in ấn tại xưởng.
          </p>
        </div>

        <div className="space-y-3">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="border border-slate-200/90 rounded-xl overflow-hidden transition-all bg-white"
              >
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  className="w-full p-4 sm:p-5 text-left font-semibold text-slate-900 flex justify-between items-center gap-4 hover:text-emerald-700 transition-colors"
                >
                  <span className="text-sm sm:text-base">{item.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-emerald-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-5 sm:px-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
