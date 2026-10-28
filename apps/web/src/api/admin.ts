import { apiGet, apiPost, apiPut } from './client';
import type { ProductDescriptionDraft } from '../types/ai';
import type { AdminBlog, AdminBlogList, AdminLoginResponse, AdminProductList, AdminStats } from '../types/admin';

function withToken(token: string, payload: Record<string, unknown> = {}) {
  return { ...payload, __adminToken: token || undefined };
}

export const ADMIN_TOKEN_KEY = 'hgr_admin_token';

export function getAdminToken() {
  return localStorage.getItem(ADMIN_TOKEN_KEY) || '';
}

export function setAdminToken(token: string) {
  localStorage.setItem(ADMIN_TOKEN_KEY, token);
}

export function clearAdminToken() {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
}

export const adminApi = {
  login(payload: { username?: string; password?: string; token?: string }) {
    return apiPost<AdminLoginResponse>('admin/auth/login', payload);
  },
  me(token: string) {
    return apiGet<{ ok: boolean }>('admin/auth/me', withToken(token));
  },
  stats(token: string) {
    return apiGet<AdminStats>('admin/stats', withToken(token));
  },
  blogs(token: string, params: { page?: number; limit?: number; status?: 'all' | 'draft' | 'published'; keyword?: string } = {}) {
    return apiGet<AdminBlogList>('admin/blogs', withToken(token, params));
  },
  blog(token: string, id: number | string) {
    return apiGet<AdminBlog>(`admin/blogs/${id}`, withToken(token));
  },
  updateBlog(token: string, blog: Partial<AdminBlog> & { id: number }) {
    return apiPut<{ message: string; blog: AdminBlog }>(`admin/blogs/${blog.id}`, withToken(token, blog as Record<string, unknown>));
  },
  publishBlog(token: string, id: number | string) {
    return apiPost<{ message: string; id: number }>(`admin/blogs/${id}/publish`, withToken(token));
  },
  unpublishBlog(token: string, id: number | string) {
    return apiPost<{ message: string; id: number }>(`admin/blogs/${id}/unpublish`, withToken(token));
  },
  products(token: string, params: { page?: number; limit?: number; keyword?: string } = {}) {
    return apiGet<AdminProductList>('admin/products', withToken(token, params));
  },
  updateProductContent(token: string, id: number | string, draft: ProductDescriptionDraft | { short_desc?: string; contentHtml?: string; keywords?: string[] | string }) {
    const keywords = Array.isArray(draft.keywords) ? draft.keywords.join(', ') : draft.keywords;
    return apiPut<{ message: string; id: number }>(`admin/products/${id}/content`, withToken(token, {
      shortDescription: 'shortDescription' in draft ? draft.shortDescription : draft.short_desc,
      contentHtml: draft.contentHtml,
      keywords
    }));
  }
};
