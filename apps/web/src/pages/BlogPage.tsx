import { hopgiayreApi } from '../api/hopgiayre';
import { BlogCard } from '../components/BlogCard';
import { ErrorBlock, LoadingBlock } from '../components/StateBlock';
import { useAsync } from '../hooks';

export function BlogPage() {
  const blogs = useAsync(() => hopgiayreApi.getBlogs('article', 1, 18), []);
  return (
    <main className="container section">
      <div className="page-title"><span>Tin tức</span><h1>Bài viết mới</h1></div>
      {blogs.loading ? <LoadingBlock /> : null}
      {blogs.error ? <ErrorBlock message={blogs.error} /> : null}
      {blogs.data ? <div className="blog-grid">{blogs.data.list_data.map((blog) => <BlogCard key={blog.id} blog={blog} />)}</div> : null}
    </main>
  );
}
