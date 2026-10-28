import { hopgiayreApi } from '../api/hopgiayre';
import { assetUrl } from '../api/client';
import { ErrorBlock, LoadingBlock } from '../components/StateBlock';
import { useAsync } from '../hooks';
import { formatMoney } from '../utils/format';

export function ProductDetailPage({ id }: { id: string }) {
  const product = useAsync(() => hopgiayreApi.getProduct(id), [id]);

  if (product.loading) return <LoadingBlock />;
  if (product.error || !product.data) return <ErrorBlock message={product.error || 'Không thấy sản phẩm'} />;

  const item = product.data;
  const gallery = [item.image, ...(item.img_path || [])].filter(Boolean);

  return (
    <main className="container section product-detail">
      <div className="gallery-panel">
        <img className="main-photo" src={assetUrl(item.image)} alt={item.image_alt || item.name} />
        <div className="thumb-row">
          {gallery.slice(0, 5).map((img, index) => <img key={`${img}-${index}`} src={assetUrl(img)} alt={item.name} />)}
        </div>
      </div>
      <div className="detail-panel">
        <span className="eyebrow">{item.category?.[0]?.cname || 'Sản phẩm'}</span>
        <h1>{item.name}</h1>
        <div className="detail-price">
          <strong>{item.price > 0 ? formatMoney(item.price) : 'Liên hệ báo giá'}</strong>
          {item.original_price > item.price && item.price > 0 ? <span>{formatMoney(item.original_price)}</span> : null}
        </div>
        {item.short_desc ? <div className="short-desc" dangerouslySetInnerHTML={{ __html: item.short_desc }} /> : null}
        <div className="detail-actions">
          <a className="primary-btn" href="/bao-gia">Yêu cầu báo giá</a>
          <a className="ghost-btn" href="tel:0985363679">Gọi tư vấn</a>
        </div>
        <dl className="spec-list">
          <div><dt>Mã sản phẩm</dt><dd>{item.code || item.pid}</dd></div>
          <div><dt>Tình trạng</dt><dd>{item.quantity > 0 ? 'Còn hàng' : 'Liên hệ'}</dd></div>
          <div><dt>Đánh giá</dt><dd>{item.reviews?.star ? `${item.reviews.star.toFixed(1)}/5` : 'Chưa có'}</dd></div>
        </dl>
      </div>
      {item.mota ? <article className="content-panel" dangerouslySetInnerHTML={{ __html: item.mota }} /> : null}
    </main>
  );
}
