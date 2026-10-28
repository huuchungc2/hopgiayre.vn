import { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { ErrorBlock, LoadingBlock } from './components/StateBlock';
import { hopgiayreApi } from './api/hopgiayre';
import { useAsync } from './hooks';
import { AiWriterPage } from './pages/AiWriterPage';
import { getAdminToken } from './api/admin';
import { AdminBlogsPage } from './admin/AdminBlogsPage';
import { AdminDashboardPage } from './admin/AdminDashboardPage';
import { AdminLoginPage } from './admin/AdminLoginPage';
import { AdminProductsPage } from './admin/AdminProductsPage';
import { BlogDetailPage } from './pages/BlogDetailPage';
import { BlogPage } from './pages/BlogPage';
import { HomePage } from './pages/HomePage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { ProductListPage } from './pages/ProductListPage';
import { QuotePage } from './pages/QuotePage';
import { extractIdFromSlug } from './utils/format';

function currentRoute() {
  return `${window.location.pathname}${window.location.search}` || '/';
}

function useBrowserRoute() {
  const [route, setRoute] = useState(currentRoute);
  useEffect(() => {
    const onPop = () => setRoute(currentRoute());
    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement).closest('a');
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (!href || href.startsWith('http') || href.startsWith('tel:') || href.startsWith('mailto:') || href.startsWith('#')) return;
      const url = new URL(href, window.location.origin);
      if (url.origin !== window.location.origin) return;
      event.preventDefault();
      window.history.pushState({}, '', `${url.pathname}${url.search}`);
      setRoute(currentRoute());
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    window.addEventListener('popstate', onPop);
    document.addEventListener('click', onClick);
    return () => {
      window.removeEventListener('popstate', onPop);
      document.removeEventListener('click', onClick);
    };
  }, []);
  return route;
}

export default function App() {
  const route = useBrowserRoute();
  const categories = useAsync(() => hopgiayreApi.getCategories(), []);

  const goSearch = (keyword: string) => {
    const url = `/san-pham?keyword=${encodeURIComponent(keyword)}`;
    window.history.pushState({}, '', url);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const params = new URLSearchParams(route.split('?')[1] || '');
  const path = route.split('?')[0];
  const parts = path.split('/').filter(Boolean);

  if (path.startsWith('/admin/login')) {
    return <AdminLoginPage />;
  }

  if (path.startsWith('/admin')) {
    const hasToken = Boolean(getAdminToken());
    if (!hasToken) return <AdminLoginPage />;
    if (path.startsWith('/admin/blogs')) return <AdminBlogsPage />;
    if (path.startsWith('/admin/products')) return <AdminProductsPage />;
    if (path.startsWith('/admin/ai')) return <AiWriterPage />;
    return <AdminDashboardPage />;
  }

  let page = <HomePage />;
  if (path.startsWith('/san-pham/') && parts[1]) page = <ProductDetailPage id={extractIdFromSlug(parts[1]) || parts[1]} />;
  else if (path.startsWith('/san-pham')) page = <ProductListPage keyword={params.get('keyword') || ''} />;
  else if (path.startsWith('/danh-muc/') && parts[1]) page = <ProductListPage categoryId={extractIdFromSlug(parts[1]) || parts[1]} />;
  else if (path.startsWith('/tin-tuc/') && parts[1]) page = <BlogDetailPage id={extractIdFromSlug(parts[1]) || parts[1]} />;
  else if (path.startsWith('/tin-tuc')) page = <BlogPage />;
  else if (path.startsWith('/bao-gia') || path.startsWith('/lien-he')) page = <QuotePage />;

  return (
    <>
      {categories.loading ? <LoadingBlock /> : null}
      {categories.error ? <ErrorBlock message={categories.error} /> : null}
      <Header categories={categories.data || []} onSearch={goSearch} />
      {page}
      <footer className="footer">
        <div className="container footer-inner">
          <div><strong>HopGiayRe.vn</strong><p>React TypeScript + Node.js/Express TypeScript, không còn phụ thuộc CodeIgniter/PHP cũ.</p></div>
          <div><b>Hotline</b><a href="tel:0985363679">0985 363 679</a></div>
          <div><b>Email</b><a href="mailto:hotro@hopgiayre.vn">hotro@hopgiayre.vn</a></div>
        </div>
      </footer>
    </>
  );
}
