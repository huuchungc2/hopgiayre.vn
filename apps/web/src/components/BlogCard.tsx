import type { Blog } from '../types/domain';
import { assetUrl } from '../api/client';
import { blogHref, stripHtml } from '../utils/format';

export function BlogCard({ blog }: { blog: Blog }) {
  const href = blogHref(blog);
  return (
    <article className="blog-card">
      <a href={href}>
        <img src={assetUrl(blog.image)} alt={blog.title} loading="lazy" />
      </a>
      <div>
        <a href={href} className="blog-title">{blog.title}</a>
        <p>{stripHtml(blog.summary, 130)}</p>
      </div>
    </article>
  );
}
