import { apiGet, apiPost } from './client';
import type { BlogDraft, ProductDescriptionDraft, SeoDraft } from '../types/ai';

function withToken(token: string, payload: Record<string, unknown>) {
  return { ...payload, __adminToken: token || undefined };
}

export const aiApi = {
  status(token = '') {
    return apiGet<{ enabled: boolean; model: string; adminTokenRequired: boolean }>('ai/status', token ? { __adminToken: token } : {});
  },
  generateBlog(token: string, payload: { topic: string; keywords?: string; tone?: string; length?: string; audience?: string }) {
    return apiPost<{ draft: BlogDraft }>('ai/blog/generate', withToken(token, payload));
  },
  saveBlogDraft(token: string, draft: BlogDraft) {
    return apiPost<{ id: number; status: string; slug: string; message: string }>('ai/blog/save-draft', withToken(token, { draft }));
  },
  generateProductDescription(token: string, payload: { productName: string; category?: string; material?: string; size?: string; price?: string; keywords?: string }) {
    return apiPost<{ draft: ProductDescriptionDraft }>('ai/product-description/generate', withToken(token, payload));
  },
  generateSeo(token: string, payload: { title: string; currentContent?: string; keywords?: string }) {
    return apiPost<{ draft: SeoDraft }>('ai/seo/generate', withToken(token, payload));
  }
};
