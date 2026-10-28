import type { Product } from '../types/domain';
import { assetUrl } from '../api/client';
import { formatMoney, productHref } from '../utils/format';

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const href = productHref(product);
  return (
    <article className="product-card">
      <a href={href} className="product-image-wrap">
        <img src={assetUrl(product.image)} alt={product.image_alt || product.name} loading="lazy" />
        {product.hot ? <span className="badge hot">Hot</span> : null}
        {product.promo && product.discount > 0 ? <span className="badge promo">-{product.discount}%</span> : null}
      </a>
      <div className="product-info">
        <a href={href} className="product-title">{product.name}</a>
        <div className="price-row">
          <strong>{product.price > 0 ? formatMoney(product.price) : 'Liên hệ'}</strong>
          {product.original_price > product.price && product.price > 0 ? <span>{formatMoney(product.original_price)}</span> : null}
        </div>
        <p>{product.category?.[0]?.cname || 'Bao bì giấy'}</p>
      </div>
    </article>
  );
}
