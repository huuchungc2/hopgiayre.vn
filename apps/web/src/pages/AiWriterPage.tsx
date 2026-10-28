import { useEffect, useMemo, useState } from 'react';
import { aiApi } from '../api/ai';
import { getAdminToken } from '../api/admin';
import { AdminLayout } from '../admin/AdminLayout';
import type { BlogDraft, ProductDescriptionDraft, SeoDraft } from '../types/ai';

type Tab = 'blog' | 'product' | 'seo';

type Status = { type: 'idle' | 'loading' | 'success' | 'error'; message: string };

const defaultStatus: Status = { type: 'idle', message: '' };


export function AiWriterPage() {
  const [tab, setTab] = useState<Tab>('blog');
  const [adminToken] = useState(getAdminToken());
  const [status, setStatus] = useState<Status>(defaultStatus);
  const [aiStatus, setAiStatus] = useState<string>('');
  const [blogDraft, setBlogDraft] = useState<BlogDraft | null>(null);
  const [productDraft, setProductDraft] = useState<ProductDescriptionDraft | null>(null);
  const [seoDraft, setSeoDraft] = useState<SeoDraft | null>(null);

  const [blogForm, setBlogForm] = useState({
    topic: 'Hộp giấy đựng mỹ phẩm giá rẻ cho shop mới bắt đầu',
    keywords: 'hộp giấy đựng mỹ phẩm, in hộp mỹ phẩm, hộp giấy giá rẻ',
    tone: 'chuyên nghiệp, dễ hiểu, bán hàng nhẹ',
    length: 'trung bình',
    audience: 'chủ shop mỹ phẩm, spa, thương hiệu mới'
  });
  const [productForm, setProductForm] = useState({
    productName: 'Hộp giấy kraft đựng mỹ phẩm',
    category: 'Hộp giấy mỹ phẩm',
    material: 'Giấy kraft, ivory hoặc duplex; in offset/kỹ thuật số',
    size: 'Theo yêu cầu',
    price: 'Liên hệ báo giá theo số lượng',
    keywords: 'hộp giấy kraft, hộp mỹ phẩm, in hộp giấy'
  });
  const [seoForm, setSeoForm] = useState({
    title: 'In hộp giấy giá rẻ tại xưởng',
    keywords: 'in hộp giấy giá rẻ, xưởng in hộp giấy, hộp giấy theo yêu cầu',
    currentContent: ''
  });

  useEffect(() => {
    aiApi.status(adminToken)
      .then((res) => setAiStatus(res.enabled ? `AI đã bật: ${res.model}` : 'AI chưa bật: cần OPENAI_API_KEY trong apps/api/.env'))
      .catch((error) => setAiStatus(error instanceof Error ? error.message : 'Không kiểm tra được AI'));
  }, [adminToken]);

  const previewHtml = useMemo(() => blogDraft?.contentHtml || productDraft?.contentHtml || '', [blogDraft, productDraft]);

  async function run(action: () => Promise<void>) {
    setStatus({ type: 'loading', message: 'Đang gọi AI, vui lòng chờ trong giây lát...' });
    try {
      await action();
    } catch (error) {
      setStatus({ type: 'error', message: error instanceof Error ? error.message : 'Có lỗi xảy ra' });
    }
  }

  return (
    <AdminLayout title="AI viết bài & tối ưu SEO">
      <p className="muted">Dùng để tạo nháp nội dung. Không nên cho AI tự đăng thẳng khi chưa duyệt.</p>
      <div className="ai-status-card"><p>{aiStatus}</p></div>

      <div className="ai-tabs">
        <button className={tab === 'blog' ? 'active' : ''} onClick={() => setTab('blog')}>Viết bài blog</button>
        <button className={tab === 'product' ? 'active' : ''} onClick={() => setTab('product')}>Mô tả sản phẩm</button>
        <button className={tab === 'seo' ? 'active' : ''} onClick={() => setTab('seo')}>SEO nhanh</button>
      </div>

      {status.message ? <div className={`form-status ${status.type}`}>{status.message}</div> : null}

      <div className="ai-layout">
        <section className="quote-form ai-form">
          {tab === 'blog' ? (
            <>
              <label>Chủ đề<input value={blogForm.topic} onChange={(e) => setBlogForm({ ...blogForm, topic: e.target.value })} /></label>
              <label>Từ khóa<textarea rows={3} value={blogForm.keywords} onChange={(e) => setBlogForm({ ...blogForm, keywords: e.target.value })} /></label>
              <label>Giọng văn<input value={blogForm.tone} onChange={(e) => setBlogForm({ ...blogForm, tone: e.target.value })} /></label>
              <label>Độ dài
                <select value={blogForm.length} onChange={(e) => setBlogForm({ ...blogForm, length: e.target.value })}>
                  <option value="ngắn">Ngắn</option>
                  <option value="trung bình">Trung bình</option>
                  <option value="dài">Dài</option>
                </select>
              </label>
              <label>Đối tượng đọc<input value={blogForm.audience} onChange={(e) => setBlogForm({ ...blogForm, audience: e.target.value })} /></label>
              <button className="primary-btn" disabled={status.type === 'loading'} onClick={() => run(async () => {
                const res = await aiApi.generateBlog(adminToken, blogForm);
                setBlogDraft(res.draft);
                setProductDraft(null);
                setSeoDraft(null);
                setStatus({ type: 'success', message: 'Đã tạo xong bản nháp bài viết.' });
              })}>Viết bài bằng AI</button>
              <button className="ghost-btn" disabled={!blogDraft || status.type === 'loading'} onClick={() => run(async () => {
                if (!blogDraft) return;
                const res = await aiApi.saveBlogDraft(adminToken, blogDraft);
                setStatus({ type: 'success', message: `${res.message}. ID: ${res.id}` });
              })}>Lưu vào blog dạng nháp</button>
            </>
          ) : null}

          {tab === 'product' ? (
            <>
              <label>Tên sản phẩm<input value={productForm.productName} onChange={(e) => setProductForm({ ...productForm, productName: e.target.value })} /></label>
              <label>Danh mục<input value={productForm.category} onChange={(e) => setProductForm({ ...productForm, category: e.target.value })} /></label>
              <label>Chất liệu/quy cách<textarea rows={3} value={productForm.material} onChange={(e) => setProductForm({ ...productForm, material: e.target.value })} /></label>
              <label>Kích thước<input value={productForm.size} onChange={(e) => setProductForm({ ...productForm, size: e.target.value })} /></label>
              <label>Giá<input value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} /></label>
              <label>Từ khóa<textarea rows={3} value={productForm.keywords} onChange={(e) => setProductForm({ ...productForm, keywords: e.target.value })} /></label>
              <button className="primary-btn" disabled={status.type === 'loading'} onClick={() => run(async () => {
                const res = await aiApi.generateProductDescription(adminToken, productForm);
                setProductDraft(res.draft);
                setBlogDraft(null);
                setSeoDraft(null);
                setStatus({ type: 'success', message: 'Đã tạo xong mô tả sản phẩm.' });
              })}>Viết mô tả sản phẩm</button>
            </>
          ) : null}

          {tab === 'seo' ? (
            <>
              <label>Tiêu đề/ý tưởng<input value={seoForm.title} onChange={(e) => setSeoForm({ ...seoForm, title: e.target.value })} /></label>
              <label>Từ khóa<textarea rows={3} value={seoForm.keywords} onChange={(e) => setSeoForm({ ...seoForm, keywords: e.target.value })} /></label>
              <label>Nội dung hiện có<textarea rows={7} value={seoForm.currentContent} onChange={(e) => setSeoForm({ ...seoForm, currentContent: e.target.value })} /></label>
              <button className="primary-btn" disabled={status.type === 'loading'} onClick={() => run(async () => {
                const res = await aiApi.generateSeo(adminToken, seoForm);
                setSeoDraft(res.draft);
                setBlogDraft(null);
                setProductDraft(null);
                setStatus({ type: 'success', message: 'Đã tạo gợi ý SEO.' });
              })}>Tối ưu SEO</button>
            </>
          ) : null}
        </section>

        <section className="ai-result detail-panel">
          <h2>Kết quả</h2>
          {blogDraft ? <DraftBlock title={blogDraft.title} metaTitle={blogDraft.metaTitle} metaDescription={blogDraft.metaDescription} keywords={blogDraft.keywords} summary={blogDraft.summary} html={blogDraft.contentHtml} /> : null}
          {productDraft ? <DraftBlock title={productDraft.title} metaTitle={productDraft.metaTitle} metaDescription={productDraft.metaDescription} keywords={productDraft.keywords} summary={productDraft.shortDescription} html={productDraft.contentHtml} points={productDraft.sellingPoints} /> : null}
          {seoDraft ? <SeoBlock draft={seoDraft} /> : null}
          {!blogDraft && !productDraft && !seoDraft ? <p className="muted">Kết quả AI sẽ hiện ở đây. Bạn có thể copy HTML để đưa vào trình soạn thảo hoặc lưu nháp bài blog.</p> : null}
        </section>
      </div>

      {previewHtml ? (
        <section className="content-panel ai-preview">
          <span className="eyebrow">Preview HTML</span>
          <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
        </section>
      ) : null}
    </AdminLayout>
  );
}

function DraftBlock(props: { title: string; metaTitle: string; metaDescription: string; keywords: string[]; summary: string; html: string; points?: string[] }) {
  return (
    <div className="ai-output">
      <label>Tiêu đề<input readOnly value={props.title} /></label>
      <label>Meta title<input readOnly value={props.metaTitle} /></label>
      <label>Meta description<textarea readOnly rows={3} value={props.metaDescription} /></label>
      <label>Từ khóa<input readOnly value={props.keywords.join(', ')} /></label>
      <label>Tóm tắt<textarea readOnly rows={4} value={props.summary} /></label>
      {props.points?.length ? <label>Ý bán hàng<textarea readOnly rows={4} value={props.points.join('\n')} /></label> : null}
      <label>HTML<textarea readOnly rows={12} value={props.html} /></label>
    </div>
  );
}

function SeoBlock({ draft }: { draft: SeoDraft }) {
  return (
    <div className="ai-output">
      <label>Slug<input readOnly value={draft.slug} /></label>
      <label>Meta title<input readOnly value={draft.metaTitle} /></label>
      <label>Meta description<textarea readOnly rows={3} value={draft.metaDescription} /></label>
      <label>Từ khóa<input readOnly value={draft.keywords.join(', ')} /></label>
      <label>Dàn ý<textarea readOnly rows={8} value={draft.outline.join('\n')} /></label>
    </div>
  );
}
