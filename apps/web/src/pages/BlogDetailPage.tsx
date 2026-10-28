import { hopgiayreApi } from '../api/hopgiayre';
import { assetUrl } from '../api/client';
import { ErrorBlock, LoadingBlock } from '../components/StateBlock';
import { useAsync } from '../hooks';

export function BlogDetailPage({ id }: { id: string }) {
  const blog = useAsync(() => hopgiayreApi.getBlog(id), [id]);
  if (blog.loading) return <LoadingBlock />;
  if (blog.error || !blog.data) return <ErrorBlock message={blog.error || 'Không thấy bài viết'} />;
  return (
    <main className="container section article-page">
      <img src={assetUrl(blog.data.image)} alt={blog.data.title} />
      <h1>{blog.data.title}</h1>
      <p className="muted">{blog.data.author || 'HopGiayRe.vn'} {blog.data.datetime ? `- ${blog.data.datetime}` : ''}</p>
      <article dangerouslySetInnerHTML={{ __html: blog.data.content || blog.data.summary }} />
    </main>
  );
}
