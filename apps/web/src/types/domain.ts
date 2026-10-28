export type ApiList<T> = {
  list_data: T[];
  total: number;
};

export type Category = {
  id: number;
  name: string;
  position?: string | number;
  link: string;
  icon?: string;
  color_icon?: string;
  color_text?: string;
  menu_image?: string;
  menu_link?: string;
  image?: string;
  banner_image?: string;
  banner_link?: string;
  top_image1?: string;
  top_image2?: string;
  subs: Category[];
};

export type ProductCategory = {
  cid: number;
  cname: string;
  cparent: string;
};

export type ProductReview = {
  star: number;
  num_reviews: number;
};

export type ProductEvent = {
  eid: number;
  event_name: string;
  content?: string;
  remain_time?: string;
};

export type Product = {
  pid: number;
  code?: string;
  name: string;
  name_seo?: string;
  keyword?: string;
  link: string;
  image: string;
  image_alt?: string;
  img_path?: string[];
  new: number;
  hot: number;
  promo: number;
  combo: number;
  accept_voucher?: number;
  index?: number | string;
  original_price: number;
  discount: number;
  price: number;
  short_desc?: string;
  mota?: string;
  size?: unknown[];
  color?: unknown[];
  status: number;
  quantity: number;
  created_at?: string;
  updated_at?: string;
  eid?: number;
  event_name?: string;
  event?: ProductEvent;
  category: ProductCategory[];
  related_product?: number[];
  reviews?: ProductReview;
};

export type Banner = {
  id?: number;
  title: string;
  image: string;
  mobile_image?: string;
  link?: string;
  description?: string;
  button?: string;
  position?: string;
};

export type Blog = {
  id: number;
  title: string;
  link: string;
  image: string;
  summary: string;
  content?: string;
  datetime?: string;
  author?: string;
  related_blog?: number[];
};

export type ProductFilters = {
  pageIndex?: number;
  itemPerPage?: number;
  categoryId?: number | string;
  brandId?: number | string;
  keyword?: string;
  sortBy?: 'desc_price' | 'asc_price' | 'hot' | 'promo' | 'new' | 'combo' | 'pos_index' | 'pos_index_desc' | '';
  minPrice?: number;
  maxPrice?: number;
};
