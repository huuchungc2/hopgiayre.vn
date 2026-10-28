import { useEffect, useState } from 'react';
import { adminApi, getAdminToken } from '../api/admin';
import { AdminLayout } from './AdminLayout';
import type { AdminStats } from '../types/admin';

export function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState('');
  useEffect(() => {
    adminApi.stats(getAdminToken()).then(setStats).catch((err) => setError(err instanceof Error ? err.message : 'Không tải được dashboard'));
  }, []);

  return (
    <AdminLayout title="Dashboard">
      {error ? <div className="form-status error">{error}</div> : null}
      <div className="admin-stat-grid">
        <Stat title="Sản phẩm" value={stats?.products} />
        <Stat title="Bài đã xuất bản" value={stats?.publishedBlogs} />
        <Stat title="Bài nháp" value={stats?.draftBlogs} />
        <Stat title="Lead báo giá" value={stats?.leads} />
      </div>
      <div className="admin-card">
        <h2>Việc nên làm tiếp</h2>
        <ol className="admin-list">
          <li>Duyệt các bài AI đang ở trạng thái nháp.</li>
          <li>Chọn sản phẩm thiếu mô tả rồi dùng AI viết lại nội dung.</li>
          <li>Sau khi nội dung ổn, publish bài viết để hiện ngoài website.</li>
        </ol>
      </div>
    </AdminLayout>
  );
}

function Stat({ title, value }: { title: string; value?: number }) {
  return <div className="admin-stat"><span>{title}</span><strong>{value ?? '...'}</strong></div>;
}
