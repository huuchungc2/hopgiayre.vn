import type { ApiList, Blog, Product } from './domain';

export type AdminUser = { username: string; role: string };
export type AdminStats = { products: number; publishedBlogs: number; draftBlogs: number; leads: number };

export type AdminBlog = Blog & {
  status: number;
  hot: number;
  keyword: string;
  title_seo: string;
  type: string;
  update_time?: string;
};

export type AdminLoginResponse = { user: AdminUser; token: string };
export type AdminBlogList = ApiList<AdminBlog>;
export type AdminProductList = ApiList<Product>;
