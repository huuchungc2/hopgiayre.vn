import { useEffect, useState } from 'react';
import { adminApi, getAdminToken } from '../api/admin';
import { aiApi } from '../api/ai';
import { AdminLayout } from './AdminLayout';
import type { ProductDescriptionDraft } from '../types/ai';
import type { Product } from '../types/domain';

type Status = { type: 'idle' | 'loading' | 'success' | 'error'; message: string };

export function AdminProductsPage() {
  const token = getAdminToken();
  const [keyword, setKeyword] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [selected, setSelected] = useState<Product | null>(null);
  const [draft, setDraft] = useState<ProductDescriptionDraft | null>(null);
  const [status, setStatus] = useState<Status>({ type: 'idle', message: '' });

  async function load() {
    setStatus({ type: 'loading', message: 'Đang tải sản phẩm...' });
    try {
      const res = await adminApi.products(token, { keyword, limit: 30 });
      setProducts(res.list_data);
      if (!selected && res.list_data[0]) setSelected(res.list_data[0]);
      setStatus({ type: 'idle', message: '' });
    } catch (error) {
      setStatus({ type: 'error', message: error instanceof Error ? error.message : 'Không tải được sản phẩm' });
    }
  }

  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);

  async function generateDescription() {
    if (!selected) return;
    setStatus({ type: 'loading', message: 'Đang nhờ AI viết mô tả sản phẩm...' });
    try {
      const res = await aiApi.generateProductDescription(token, {
        productName: selected.name,
        category: selected.category?.map((c) => c.cname).join(', '),
        price: selected.price ? `${selected.price}` : 'Liên hệ',
        keywords: selected.keyword || selected.name
      });
      setDraft(res.draft);
      setStatus({ type: 'success', message: 'Đã tạo mô tả AI. Kiểm tra rồi bấm lưu vào sản phẩm.' });
    } catch (error) {
      setStatus({ type: 'error', message: error instanceof Error ? error.message : 'Không tạo được mô tả AI' });
    }
  }

  async function saveDescription() {
    if (!selected || !draft) return;
    setStatus({ type: 'loading', message: 'Đang lưu mô tả vào sản phẩm...' });
    try {
      const res = await adminApi.updateProductContent(token, selected.pid, draft);
      setStatus({ type: 'success', message: res.message });
      await load();
    } catch (error) {
      setStatus({ type: 'error', message: error instanceof Error ? error.message : 'Không lưu được mô tả' });
    }
  }

  return (
    <AdminLayout title="Quản lý sản phẩm">
      <div className="admin-toolbar">
        <input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="Tìm tên / mã / keyword" />
        <button className="primary-btn" onClick={load}>Tìm</button>
      </div>
      {status.message ? <div className={`form-status ${status.type}`}>{status.message}</div> : null}
      <div className="admin-split">
        <section className="admin-card admin-list-panel">
          {products.map((product) => (
            <button key={product.pid} className={`admin-row ${selected?.pid === product.pid ? 'active' : ''}`} onClick={() => { setSelected(product); setDraft(null); }}>
              <strong>{product.name}</strong>
              <span>ID {product.pid} · {product.code || 'không mã'}</span>
            </button>
          ))}
        </section>
        <section className="admin-card admin-editor">
          {selected ? (
            <>
              <h2>{selected.name}</h2>
              <p className="muted">Mô tả hiện tại:</p>
              <textarea rows={8} readOnly value={selected.mota || selected.short_desc || ''} />
              <div className="admin-actions">
                <button className="primary-btn" onClick={generateDescription}>AI viết lại mô tả</button>
                <button className="ghost-btn" disabled={!draft} onClick={saveDescription}>Lưu mô tả AI vào sản phẩm</button>
              </div>
              {draft ? (
                <>
                  <label>Mô tả ngắn<textarea rows={4} value={draft.shortDescription} onChange={(e) => setDraft({ ...draft, shortDescription: e.target.value })} /></label>
                  <label>Nội dung HTML<textarea rows={14} value={draft.contentHtml} onChange={(e) => setDraft({ ...draft, contentHtml: e.target.value })} /></label>
                  <div className="content-panel admin-preview" dangerouslySetInnerHTML={{ __html: draft.contentHtml }} />
                </>
              ) : null}
            </>
          ) : <p className="muted">Chọn một sản phẩm để chỉnh mô tả.</p>}
        </section>
      </div>
    </AdminLayout>
  );
}
