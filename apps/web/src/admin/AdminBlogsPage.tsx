import { useEffect, useState } from 'react';
import { adminApi, getAdminToken } from '../api/admin';
import { AdminLayout } from './AdminLayout';
import type { AdminBlog } from '../types/admin';

type Status = { type: 'idle' | 'loading' | 'success' | 'error'; message: string };

export function AdminBlogsPage() {
  const token = getAdminToken();
  const [blogs, setBlogs] = useState<AdminBlog[]>([]);
  const [selected, setSelected] = useState<AdminBlog | null>(null);
  const [filter, setFilter] = useState<'all' | 'draft' | 'published'>('all');
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState<Status>({ type: 'idle', message: '' });

  async function load() {
    setStatus({ type: 'loading', message: 'Đang tải bài viết...' });
    try {
      const res = await adminApi.blogs(token, { status: filter, keyword, limit: 30 });
      setBlogs(res.list_data);
      setStatus({ type: 'idle', message: '' });
      if (!selected && res.list_data[0]) setSelected(res.list_data[0]);
    } catch (error) {
      setStatus({ type: 'error', message: error instanceof Error ? error.message : 'Không tải được bài viết' });
    }
  }

  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [filter]);

  async function saveBlog(nextStatus?: number) {
    if (!selected) return;
    setStatus({ type: 'loading', message: 'Đang lưu bài viết...' });
    try {
      const payload = { ...selected, status: nextStatus ?? selected.status };
      const res = await adminApi.updateBlog(token, payload);
      setSelected(res.blog);
      setStatus({ type: 'success', message: res.message });
      await load();
    } catch (error) {
      setStatus({ type: 'error', message: error instanceof Error ? error.message : 'Không lưu được bài viết' });
    }
  }

  return (
    <AdminLayout title="Quản lý bài viết">
      <div className="admin-toolbar">
        <input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="Tìm tiêu đề / keyword" />
        <select value={filter} onChange={(e) => setFilter(e.target.value as typeof filter)}>
          <option value="all">Tất cả</option>
          <option value="draft">Bài nháp</option>
          <option value="published">Đã xuất bản</option>
        </select>
        <button className="primary-btn" onClick={load}>Tìm</button>
        <a className="ghost-btn" href="/admin/ai">Viết bài bằng AI</a>
      </div>
      {status.message ? <div className={`form-status ${status.type}`}>{status.message}</div> : null}
      <div className="admin-split">
        <section className="admin-card admin-list-panel">
          {blogs.map((blog) => (
            <button key={blog.id} className={`admin-row ${selected?.id === blog.id ? 'active' : ''}`} onClick={() => setSelected(blog)}>
              <strong>{blog.title}</strong>
              <span>{blog.status ? 'Đã xuất bản' : 'Nháp'} · ID {blog.id}</span>
            </button>
          ))}
          {!blogs.length ? <p className="muted">Chưa có bài phù hợp.</p> : null}
        </section>
        <section className="admin-card admin-editor">
          {selected ? (
            <>
              <label>Tiêu đề<input value={selected.title} onChange={(e) => setSelected({ ...selected, title: e.target.value })} /></label>
              <label>Title SEO<input value={selected.title_seo} onChange={(e) => setSelected({ ...selected, title_seo: e.target.value })} /></label>
              <label>Keyword<input value={selected.keyword} onChange={(e) => setSelected({ ...selected, keyword: e.target.value })} /></label>
              <label>Tóm tắt<textarea rows={4} value={selected.summary} onChange={(e) => setSelected({ ...selected, summary: e.target.value })} /></label>
              <label>Nội dung HTML<textarea rows={16} value={selected.content || ''} onChange={(e) => setSelected({ ...selected, content: e.target.value })} /></label>
              <div className="admin-actions">
                <button className="primary-btn" onClick={() => saveBlog()}>Lưu</button>
                {selected.status ? (
                  <button className="ghost-btn" onClick={() => saveBlog(0)}>Chuyển về nháp</button>
                ) : (
                  <button className="ghost-btn" onClick={() => saveBlog(1)}>Duyệt & xuất bản</button>
                )}
              </div>
              <div className="content-panel admin-preview" dangerouslySetInnerHTML={{ __html: selected.content || '' }} />
            </>
          ) : <p className="muted">Chọn một bài để sửa.</p>}
        </section>
      </div>
    </AdminLayout>
  );
}
