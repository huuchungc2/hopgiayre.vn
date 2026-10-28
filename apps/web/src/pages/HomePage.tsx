import { hopgiayreApi } from '../api/hopgiayre';
import { assetUrl } from '../api/client';
import { BlogCard } from '../components/BlogCard';
import { ErrorBlock, LoadingBlock } from '../components/StateBlock';
import { ProductCard } from '../components/ProductCard';
import { useAsync } from '../hooks';

export function HomePage() {
  const home = useAsync(async () => {
    const [banners, hotProducts, categories, services, news] = await Promise.all([
      hopgiayreApi.getBanners('main', 1, 6),
      hopgiayreApi.getProducts({ pageIndex: 1, itemPerPage: 10, sortBy: 'hot' }),
      hopgiayreApi.getCategories(true),
      hopgiayreApi.getBlogs('service', 1, 6, '1'),
      hopgiayreApi.getBlogs('article', 1, 6, '1')
    ]);
    return { banners, hotProducts, categories, services, news };
  }, []);

  if (home.loading) return <LoadingBlock />;
  if (home.error || !home.data) return <ErrorBlock message={home.error || 'Không có dữ liệu'} />;

  const hero = home.data.banners.list_data[0];

  return (
    <main>
      <section className="hero container">
        <div className="hero-copy">
          <span className="eyebrow">Bao bì giấy theo yêu cầu</span>
          <h1>In hộp giấy, túi giấy chuyên nghiệp cho thương hiệu của bạn</h1>
          <p>Website mới bằng React TypeScript, lấy dữ liệu từ backend Node.js/Express TypeScript mới.</p>
          <div className="hero-actions">
            <a className="primary-btn" href="/san-pham">Xem sản phẩm</a>
            <a className="ghost-btn" href="/bao-gia">Nhận báo giá</a>
          </div>
        </div>
        <div className="hero-image">
          <img src={assetUrl(hero?.image || 'upload/in-hop-giay.webp')} alt={hero?.title || 'Hộp giấy rẻ'} />
        </div>
      </section>

      <section className="container section">
        <div className="section-head">
          <span>Danh mục</span>
          <h2>Nhóm sản phẩm chính</h2>
        </div>
        <div className="category-grid">
          {home.data.categories.slice(0, 8).map((category) => (
            <a className="category-card" href={`/danh-muc/${category.id}`} key={category.id}>
              <img src={assetUrl(category.image || category.icon, '/upload/img1.webp')} alt={category.name} loading="lazy" />
              <strong>{category.name}</strong>
              <span>{category.subs?.length || 0} nhóm con</span>
            </a>
          ))}
        </div>
      </section>

      <section className="container section">
        <div className="section-head row">
          <div><span>Sản phẩm</span><h2>Mẫu hộp đang nổi bật</h2></div>
          <a href="/san-pham">Xem tất cả</a>
        </div>
        <div className="product-grid">
          {home.data.hotProducts.list_data.map((product) => <ProductCard key={product.pid} product={product} />)}
        </div>
      </section>

      <section className="quote-band">
        <div className="container quote-inner">
          <h2>Cần báo giá hộp giấy theo kích thước riêng?</h2>
          <p>Gửi thông tin sản phẩm, số lượng, chất liệu và quy cách gia công để đội ngũ tư vấn chốt phương án.</p>
          <a className="primary-btn light" href="/bao-gia">Tạo yêu cầu báo giá</a>
        </div>
      </section>

      <section className="container section">
        <div className="section-head row">
          <div><span>Kiến thức</span><h2>Tin tức & dịch vụ</h2></div>
          <a href="/tin-tuc">Xem thêm</a>
        </div>
        <div className="blog-grid">
          {[...home.data.services.list_data, ...home.data.news.list_data].slice(0, 6).map((blog) => <BlogCard key={blog.id} blog={blog} />)}
        </div>
      </section>
    </main>
  );
}
