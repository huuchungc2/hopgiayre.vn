import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hopgiayre.vn';
  const apiBase = process.env.INTERNAL_API_URL || 'http://localhost:3001/api';

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/san-pham`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/bao-gia`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/tin-tuc`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];

  try {
    const res = await fetch(`${apiBase}/home`, { next: { revalidate: 3600 } }).catch(() => null);
    if (!res || !res.ok) return staticRoutes;
    const data = await res.json();

    const categoryUrls = (data.category || []).map((cat: any) => ({
      url: `${baseUrl}/${cat.link}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    }));

    const productUrls = (data.product || []).map((p: any) => ({
      url: `${baseUrl}/san-pham/${p.link}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    }));

    const blogUrls = (data.blog || []).map((b: any) => ({
      url: `${baseUrl}/${b.link}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));

    return [...staticRoutes, ...categoryUrls, ...productUrls, ...blogUrls];
  } catch {
    return staticRoutes;
  }
}
