import { useMemo, useState } from 'react';
import { hopgiayreApi } from '../api/hopgiayre';
import { ProductCard } from '../components/ProductCard';
import { ErrorBlock, LoadingBlock } from '../components/StateBlock';
import { useAsync } from '../hooks';

export function ProductListPage({ categoryId, keyword: initialKeyword = '' }: { categoryId?: string; keyword?: string }) {
  const [keyword, setKeyword] = useState(initialKeyword);
  const [sortBy, setSortBy] = useState('hot');
  const filters = useMemo(() => ({ pageIndex: 1, itemPerPage: 24, categoryId, keyword: keyword || '--', sortBy: sortBy as never }), [categoryId, keyword, sortBy]);
  const products = useAsync(() => hopgiayreApi.getProducts(filters), [filters]);

  return (
    <main className="container section">
      <div className="page-title">
        <span>{categoryId ? 'Danh mục' : 'Sản phẩm'}</span>
        <h1>{categoryId ? `Danh mục #${categoryId}` : 'Tất cả sản phẩm'}</h1>
      </div>
      <div className="toolbar">
        <input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="Tìm theo tên sản phẩm..." />
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="hot">Hot</option>
          <option value="new">Mới</option>
          <option value="promo">Khuyến mãi</option>
          <option value="asc_price">Giá tăng dần</option>
          <option value="desc_price">Giá giảm dần</option>
          <option value="pos_index_desc">Ưu tiên hiển thị</option>
        </select>
      </div>
      {products.loading ? <LoadingBlock /> : null}
      {products.error ? <ErrorBlock message={products.error} /> : null}
      {products.data ? (
        <>
          <p className="muted">Tìm thấy {products.data.total} sản phẩm</p>
          <div className="product-grid">
            {products.data.list_data.map((product) => <ProductCard key={product.pid} product={product} />)}
          </div>
        </>
      ) : null}
    </main>
  );
}
