import { prefixAsset, productLink, safeJson, toInt } from './utils.js';

type Row = Record<string, any>;

export function mapCategory(row: Row, children: Row[] = []) {
  return {
    id: toInt(row.cid),
    name: row.cname || '',
    position: row.pos_index ?? '',
    link: `danh-muc/${productLink(row.cname || '', row.cname_seo || row.cname, toInt(row.cid))}`,
    icon: prefixAsset('imgcategory', row.icon),
    image: prefixAsset('imgcategory', row.image),
    banner_image: prefixAsset('imgcategory', row.banner_image),
    banner_link: row.banner_link || '',
    menu_link: row.menu_link || '',
    color_icon: prefixAsset('imgcategory', row.color_icon),
    color_text: row.color_text || '',
    menu_image: prefixAsset('imgcategory', row.menu_image || row.image),
    top_image1: prefixAsset('imgcategory', row.top_image1),
    top_image2: prefixAsset('imgcategory', row.top_image2),
    subs: children
  };
}

export function mapBanner(row: Row) {
  return {
    id: toInt(row.bid),
    title: row.bname || '',
    image: prefixAsset('imgbanner', row.image),
    mobile_image: prefixAsset('imgbanner', row.image_mobile),
    link: row.link || '',
    description: row.description || '',
    button: row.btn_text || '',
    position: row.position || ''
  };
}

export function mapBlog(row: Row, withContent = false) {
  const base: Row = {
    id: toInt(row.id),
    title: row.title || '',
    link: `blog/${productLink(row.title || '', row.title, toInt(row.id))}`,
    image: prefixAsset('imgblog', row.image),
    summary: row.summary || '',
    datetime: row.datetime || '',
    author: row.author || ''
  };
  if (withContent) {
    base.content = row.content || '';
    base.related_blog = safeJson<number[]>(row.related_blog, []);
  }
  return base;
}

export function mapProduct(row: Row, categories: Row[] = []) {
  const original = toInt(row.original_price);
  const price = toInt(row.price);
  const gallery = safeJson<string[]>(row.img_path, []);
  const images = [row.image, ...gallery].filter(Boolean).map((img) => prefixAsset('imgproduct', img));
  return {
    pid: toInt(row.pid),
    code: row.code || '',
    name: row.name || '',
    name_seo: row.name_seo || '',
    keyword: row.keyword || '',
    link: productLink(row.name || '', row.link || row.name, toInt(row.pid)),
    image: prefixAsset('imgproduct', row.image),
    image_alt: row.image_alt || row.name || '',
    img_path: images,
    new: toInt(row.new),
    hot: toInt(row.hot),
    promo: toInt(row.promo),
    combo: toInt(row.combo),
    accept_voucher: toInt(row.accept_voucher),
    index: toInt(row.status),
    original_price: original,
    discount: original > 0 && price > 0 ? Math.max(0, Math.round((100 * (original - price)) / original)) : 0,
    price,
    short_desc: row.short_desc || '',
    mota: row.mota || row.desc_html || '',
    size: safeJson<unknown[]>(row.size, []),
    color: safeJson<unknown[]>(row.color, []),
    status: toInt(row.status),
    quantity: toInt(row.quantity),
    created_at: row.created_at || '',
    updated_at: row.updated_at || '',
    eid: toInt(row.eid),
    event_name: row.event_name || '',
    event: {
      eid: toInt(row.eid),
      event_name: row.event_name || '',
      content: row.event_content || row.content || '',
      remain_time: row.remain_time || ''
    },
    category: categories.map((cat) => ({ cid: toInt(cat.cid), cname: cat.cname || '', cparent: cat.cparent || '' })),
    related_product: safeJson<number[]>(row.related_product, [])
  };
}
