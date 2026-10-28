import type { ReactNode } from 'react';
import { clearAdminToken } from '../api/admin';

export function AdminLayout({ title, children }: { title: string; children: ReactNode }) {
  const logout = () => {
    clearAdminToken();
    window.history.pushState({}, '', '/admin/login');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };
  return (
    <main className="admin-shell">
      <aside className="admin-sidebar">
        <a className="admin-brand" href="/admin">HopGiayRe Admin</a>
        <nav>
          <a href="/admin">Dashboard</a>
          <a href="/admin/blogs">Bài viết</a>
          <a href="/admin/products">Sản phẩm</a>
          <a href="/admin/ai">AI Writer</a>
          <a href="/">Xem website</a>
        </nav>
        <button className="ghost-btn" onClick={logout}>Đăng xuất</button>
      </aside>
      <section className="admin-content">
        <div className="admin-topline">
          <div>
            <span className="eyebrow">Admin</span>
            <h1>{title}</h1>
          </div>
        </div>
        {children}
      </section>
    </main>
  );
}
