import { apiGet, apiPost } from './client';
import type { ApiList, Banner, Blog, Category, Product, ProductFilters } from '../types/domain';

export const hopgiayreApi = {
  getCategories(showHome?: boolean) {
    return apiGet<Category[]>('catalog/get_all', { show_home: showHome ? 'show' : undefined });
  },
  getCategory(id: number | string) {
    return apiGet<Category>('catalog/get', { cid: id });
  },
  getBanners(position = 'main', pageIndex = 1, itemPerPage = 10) {
    return apiGet<ApiList<Banner>>('banner/get_all', {
      position,
      page_index: pageIndex,
      item_per_page: itemPerPage
    });
  },
  getProducts(filters: ProductFilters = {}) {
    return apiGet<ApiList<Product>>('product/get_slice', {
      page_index: filters.pageIndex ?? 1,
      item_per_page: filters.itemPerPage ?? 12,
      cate_search: filters.categoryId ?? '--',
      brand_search: filters.brandId ?? '--',
      keyword: filters.keyword ?? '--',
      sort_by: filters.sortBy ?? '',
      min_price: filters.minPrice ?? -1,
      max_price: filters.maxPrice ?? -1
    });
  },
  getProduct(id: number | string) {
    return apiGet<Product>('product/get', { pid: id });
  },
  getBlogs(type: 'article' | 'service' | 'video' = 'article', pageIndex = 1, itemPerPage = 6, hot = '') {
    return apiGet<ApiList<Blog>>('blog/get_all', {
      type,
      page_index: pageIndex,
      item_per_page: itemPerPage,
      hot
    });
  },
  getBlog(id: number | string) {
    return apiGet<Blog>('blog/get', { bid: id });
  },
  sendQuote(payload: { name: string; phone: string; email?: string; address?: string; content: string }) {
    return apiPost<{ error: number; id: number; message: string }>('user/sendinfo', payload);
  },
  subscribeEmail(email: string) {
    return apiPost<{ error: number; id: number; message: string }>('user/email', { email });
  }
};
