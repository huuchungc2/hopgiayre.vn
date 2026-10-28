export const formatMoney = (value?: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(value || 0);

export function formatDateTime(val?: string | number): string {
  if (!val) return '';
  const num = Number(val);
  if (!isNaN(num) && num > 1000000000) {
    const d = new Date(num * 1000);
    return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }
  return String(val);
}

export function extractIdFromSlug(input: string): string | null {
  const clean = input.split('?')[0].replace(/\/$/, '');
  const match = clean.match(/-(\d+)(?:\.html|\.htm)?$/i) || clean.match(/^(\d+)$/);
  return match?.[1] || null;
}

export function stripHtml(html = '', limit = 160): string {
  const text = html.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
  return text.length > limit ? `${text.slice(0, limit)}...` : text;
}

export function productHref(product: { pid: number; link?: string }): string {
  return `/san-pham/${product.link || product.pid}`;
}

export function blogHref(blog: { id: number; link?: string }): string {
  return blog.link?.startsWith('blog/') ? `/${blog.link.replace(/^blog\//, 'tin-tuc/')}` : `/tin-tuc/${blog.id}`;
}

export function categoryHref(category: { id: number; link?: string }): string {
  return category.link?.startsWith('danh-muc/') ? `/${category.link}` : `/danh-muc/${category.id}`;
}
