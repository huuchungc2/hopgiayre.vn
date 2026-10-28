import { useMemo, useState } from 'react';
import { hopgiayreApi } from '../api/hopgiayre';

type QuoteForm = {
  name: string;
  phone: string;
  email: string;
  product: string;
  quantity: string;
  note: string;
};

export function QuotePage() {
  const [form, setForm] = useState<QuoteForm>({ name: '', phone: '', email: '', product: '', quantity: '', note: '' });
  const [status, setStatus] = useState<{ type: 'idle' | 'loading' | 'success' | 'error'; message: string }>({ type: 'idle', message: '' });

  const content = useMemo(() => [
    form.product ? `Sản phẩm: ${form.product}` : '',
    form.quantity ? `Số lượng: ${form.quantity}` : '',
    form.note ? `Ghi chú: ${form.note}` : ''
  ].filter(Boolean).join('\n'), [form.product, form.quantity, form.note]);

  const zaloText = encodeURIComponent(`Tôi cần báo giá:\nTên: ${form.name}\nSĐT: ${form.phone}\nEmail: ${form.email}\n${content}`);

  async function submitQuote(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus({ type: 'loading', message: 'Đang gửi yêu cầu...' });
    try {
      const result = await hopgiayreApi.sendQuote({
        name: form.name,
        phone: form.phone,
        email: form.email,
        content
      });
      setStatus({ type: 'success', message: result.message || 'Đã gửi yêu cầu. Bên mình sẽ liên hệ lại sớm.' });
      setForm({ name: '', phone: '', email: '', product: '', quantity: '', note: '' });
    } catch (error) {
      setStatus({ type: 'error', message: error instanceof Error ? error.message : 'Gửi chưa thành công' });
    }
  }

  return (
    <main className="container section quote-page">
      <div className="page-title"><span>Báo giá</span><h1>Gửi yêu cầu báo giá nhanh</h1></div>
      <div className="quote-layout">
        <form className="quote-form" onSubmit={submitQuote}>
          <label>Họ tên<input value={form.name} required onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
          <label>Số điện thoại<input value={form.phone} required inputMode="tel" onChange={(e) => setForm({ ...form, phone: e.target.value })} /></label>
          <label>Email<input value={form.email} type="email" onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
          <label>Loại sản phẩm<input value={form.product} onChange={(e) => setForm({ ...form, product: e.target.value })} placeholder="Hộp cứng, hộp giấy mềm, túi giấy..." /></label>
          <label>Số lượng<input value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} /></label>
          <label>Quy cách / ghi chú<textarea value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} rows={5} /></label>
          {status.message ? <p className={`form-status ${status.type}`}>{status.message}</p> : null}
          <div className="detail-actions">
            <button className="primary-btn" disabled={status.type === 'loading'}>{status.type === 'loading' ? 'Đang gửi...' : 'Gửi vào hệ thống'}</button>
            <a className="ghost-btn" href={`https://zalo.me/0985363679?text=${zaloText}`}>Gửi qua Zalo</a>
            <a className="ghost-btn" href="tel:0985363679">Gọi trực tiếp</a>
          </div>
        </form>
        <aside className="quote-help">
          <h2>Thông tin nên chuẩn bị</h2>
          <p>Kích thước hộp, chất liệu giấy, định lượng, số màu in, cán màng, ép kim, bế dán và thời gian cần hàng.</p>
          <ul>
            <li>Nên có kích thước dài × rộng × cao.</li>
            <li>Số lượng càng rõ thì báo giá càng sát.</li>
            <li>Có file thiết kế thì gửi thêm qua Zalo.</li>
          </ul>
        </aside>
      </div>
    </main>
  );
}
