import type { Router } from 'express';
import express from 'express';
import { ResultSetHeader } from 'mysql2';
import { mapBanner, mapBlog, mapCategory, mapProduct } from '../mappers.js';
import { one, pool, query } from '../db.js';
import { badRequest, clampInt, cleanString, cleanText, isEmail, isVietnamPhone, toInt } from '../utils.js';

const nowUnix = () => Math.floor(Date.now() / 1000).toString();

async function productCategories(ids: number[]): Promise<Map<number, any[]>> {
  const cleanIds = [...new Set(ids.filter(Boolean))].slice(0, 200);
  if (!cleanIds.length) return new Map();
  const rows = await query<any>(`SELECT pc.pid, c.cid, c.cname, c.cparent FROM product_cates pc LEFT JOIN category c ON c.cid = pc.cid WHERE pc.pid IN (${cleanIds.map(() => '?').join(',')})`, cleanIds);
  const map = new Map<number, any[]>();
  for (const row of rows) {
    const pid = toInt(row.pid);
    if (!map.has(pid)) map.set(pid, []);
    if (row.cid) map.get(pid)!.push(row);
  }
  return map;
}

export function createPublicRouter(): Router {
  const router = express.Router();

  router.get('/setting/get_all', async (_req, res, next) => {
    try {
      const rows = await query<any>('SELECT name, value FROM setting');
      res.json(Object.fromEntries(rows.map((row) => [row.name, row.value])));
    } catch (error) { next(error); }
  });

  router.get('/catalog/get_all', async (req, res, next) => {
    try {
      const showHome = cleanString(req.query.show_home, 20);
      let where = 'WHERE enable = 1';
      if (showHome === 'show') where += ' AND product_page = 1';
      const rows = await query<any>(`SELECT * FROM category ${where} ORDER BY pos_index DESC, cid ASC`);
      const byParent = new Map<string, any[]>();
      for (const row of rows) {
        const parent = String(row.cparent || '').trim();
        if (!byParent.has(parent)) byParent.set(parent, []);
        byParent.get(parent)!.push(row);
      }
      const allNames = new Set(rows.map((r) => String(r.cname || '').trim()).filter(Boolean));
      const roots = rows.filter((r) => !String(r.cparent || '').trim() || !allNames.has(String(r.cparent || '').trim()));
      res.json(roots.map((row) => mapCategory(row, (byParent.get(String(row.cname || '').trim()) || []).map((child) => mapCategory(child)))));
    } catch (error) { next(error); }
  });

  router.get('/catalog/get', async (req, res, next) => {
    try {
      const cid = toInt(req.query.cid);
      if (!cid) badRequest('Thiếu mã danh mục');
      const row = await one<any>('SELECT * FROM category WHERE cid = ? AND enable = 1', [cid]);
      if (!row) return res.status(404).json({ message: 'Không tìm thấy danh mục' });
      const children = await query<any>('SELECT * FROM category WHERE cparent = ? AND enable = 1 ORDER BY pos_index DESC, cid ASC', [row.cname]);
      res.json(mapCategory(row, children.map((child) => mapCategory(child))));
    } catch (error) { next(error); }
  });

  router.get('/banner/get_all', async (req, res, next) => {
    try {
      const page = clampInt(req.query.page_index, 1, 1, 500);
      const limit = clampInt(req.query.item_per_page, 10, 1, 50);
      const offset = (page - 1) * limit;
      const position = cleanString(req.query.position || 'main', 60);
      const rows = await query<any>('SELECT * FROM banner WHERE status = 1 AND position = ? ORDER BY pos_index DESC, bid DESC LIMIT ? OFFSET ?', [position, limit, offset]);
      const totalRow = await one<any>('SELECT COUNT(*) total FROM banner WHERE status = 1 AND position = ?', [position]);
      res.json({ list_data: rows.map(mapBanner), total: toInt(totalRow?.total), page, limit });
    } catch (error) { next(error); }
  });

  router.get('/product/get_slice', async (req, res, next) => {
    try {
      const page = clampInt(req.query.page_index, 1, 1, 500);
      const limit = clampInt(req.query.item_per_page, 12, 1, 60);
      const offset = (page - 1) * limit;
      const keyword = cleanString(req.query.keyword || '--', 120);
      const categoryId = cleanString(req.query.cate_search || req.query.category || '--', 30);
      const brandId = cleanString(req.query.brand_search || '--', 30);
      const sortBy = cleanString(req.query.sort_by || '', 30);
      const minPrice = toInt(req.query.min_price, -1);
      const maxPrice = toInt(req.query.max_price, -1);
      const where: string[] = ['p.enable = 1'];
      const params: unknown[] = [];
      if (keyword && keyword !== '--') { where.push('(p.name LIKE ? OR p.keyword LIKE ? OR p.code LIKE ?)'); params.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`); }
      if (categoryId && categoryId !== '--') { where.push('pc.cid = ?'); params.push(toInt(categoryId)); }
      if (brandId && brandId !== '--') { where.push('p.brand_id = ?'); params.push(toInt(brandId)); }
      if (minPrice >= 0) { where.push('p.price >= ?'); params.push(minPrice); }
      if (maxPrice >= 0) { where.push('p.price <= ?'); params.push(maxPrice); }
      if (['hot', 'promo', 'new', 'combo'].includes(sortBy)) where.push(`p.${sortBy} = 1`);
      const whereSql = `WHERE ${where.join(' AND ')}`;
      const orderMap: Record<string, string> = {
        desc_price: 'ORDER BY p.price DESC, p.pid DESC',
        asc_price: 'ORDER BY p.price ASC, p.pid DESC',
        pos_index: 'ORDER BY p.pos_index DESC, p.pid DESC',
        pos_index_desc: 'ORDER BY p.pos_index DESC, p.pid DESC',
        hot: 'ORDER BY p.hot DESC, p.pos_index DESC, p.pid DESC',
        new: 'ORDER BY p.new DESC, p.pid DESC',
        promo: 'ORDER BY p.promo DESC, p.pid DESC'
      };
      const orderSql = orderMap[sortBy] || 'ORDER BY p.pos_index DESC, p.pid DESC';
      const rows = await query<any>(`
        SELECT p.*, e.title event_name, e.content event_content, e.remain_time
        FROM products p
        LEFT JOIN product_cates pc ON pc.pid = p.pid
        LEFT JOIN events e ON e.eid = p.eid
        ${whereSql}
        GROUP BY p.pid
        ${orderSql}
        LIMIT ? OFFSET ?`, [...params, limit, offset]);
      const totalRow = await one<any>(`SELECT COUNT(DISTINCT p.pid) total FROM products p LEFT JOIN product_cates pc ON pc.pid = p.pid ${whereSql}`, params);
      const catMap = await productCategories(rows.map((r) => toInt(r.pid)));
      res.json({ list_data: rows.map((row) => mapProduct(row, catMap.get(toInt(row.pid)) || [])), total: toInt(totalRow?.total), page, limit });
    } catch (error) { next(error); }
  });

  router.get('/product/get', async (req, res, next) => {
    try {
      const pid = toInt(req.query.pid);
      if (!pid) badRequest('Thiếu mã sản phẩm');
      const row = await one<any>('SELECT p.*, e.title event_name, e.content event_content, e.remain_time FROM products p LEFT JOIN events e ON e.eid = p.eid WHERE p.pid = ? AND p.enable = 1', [pid]);
      if (!row) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
      const catMap = await productCategories([pid]);
      res.json(mapProduct(row, catMap.get(pid) || []));
    } catch (error) { next(error); }
  });

  router.get('/product/mget', async (req, res, next) => {
    try {
      const ids = String(req.query.ids || '').split(',').map((x) => toInt(x)).filter(Boolean).slice(0, 50);
      if (!ids.length) return res.json({ list_data: [], total: 0 });
      const rows = await query<any>(`SELECT * FROM products WHERE enable = 1 AND pid IN (${ids.map(() => '?').join(',')})`, ids);
      const catMap = await productCategories(rows.map((r) => toInt(r.pid)));
      res.json({ list_data: rows.map((row) => mapProduct(row, catMap.get(toInt(row.pid)) || [])), total: rows.length });
    } catch (error) { next(error); }
  });

  router.get('/blog/get_all', async (req, res, next) => {
    try {
      const page = clampInt(req.query.page_index, 1, 1, 500);
      const limit = clampInt(req.query.item_per_page, 10, 1, 60);
      const offset = (page - 1) * limit;
      const type = cleanString(req.query.type || 'article', 30);
      const keyword = cleanString(req.query.keyword || '--', 120);
      const hot = cleanString(req.query.hot || '', 10);
      const where: string[] = ['status = 1', 'type = ?'];
      const params: unknown[] = [type];
      if (keyword && keyword !== '--') { where.push('(title LIKE ? OR summary LIKE ?)'); params.push(`%${keyword}%`, `%${keyword}%`); }
      if (hot) where.push('hot = 1');
      const whereSql = `WHERE ${where.join(' AND ')}`;
      const rows = await query<any>(`SELECT id, title, image, summary, datetime, author FROM blog ${whereSql} ORDER BY id DESC LIMIT ? OFFSET ?`, [...params, limit, offset]);
      const totalRow = await one<any>(`SELECT COUNT(*) total FROM blog ${whereSql}`, params);
      res.json({ list_data: rows.map((row) => mapBlog(row)), total: toInt(totalRow?.total), page, limit });
    } catch (error) { next(error); }
  });

  router.get('/blog/get', async (req, res, next) => {
    try {
      const id = toInt(req.query.bid);
      if (!id) badRequest('Thiếu mã bài viết');
      const row = await one<any>('SELECT * FROM blog WHERE id = ? AND status = 1', [id]);
      if (!row) return res.status(404).json({ message: 'Không tìm thấy bài viết' });
      res.json(mapBlog(row, true));
    } catch (error) { next(error); }
  });

  router.get('/voucher/get_all', async (_req, res, next) => {
    try {
      const rows = await query<any>('SELECT vid, name, code, type, end_date, value, max FROM vouchers WHERE status = 1 ORDER BY vid DESC LIMIT 100');
      res.json({ list_data: rows, total: rows.length });
    } catch (error) { next(error); }
  });

  router.post('/user/sendinfo', async (req, res, next) => {
    try {
      const name = cleanString(req.body?.name, 120);
      const phone = cleanString(req.body?.phone, 40);
      const email = cleanString(req.body?.email, 180);
      const address = cleanString(req.body?.address, 255);
      const content = cleanText(req.body?.content, 3000);
      if (!name) badRequest('Vui lòng nhập họ tên');
      if (!phone || !isVietnamPhone(phone)) badRequest('Số điện thoại chưa đúng');
      if (email && !isEmail(email)) badRequest('Email chưa đúng');
      const [result] = await pool.execute<ResultSetHeader>('INSERT INTO email_reg (name, phone, email, address, content, datetime) VALUES (?, ?, ?, ?, ?, ?)', [name, phone, email, address, content, nowUnix()]);
      res.json({ error: result.insertId > 0 ? 0 : -1, id: result.insertId, message: 'Đã nhận thông tin báo giá' });
    } catch (error) { next(error); }
  });

  router.post('/user/email', async (req, res, next) => {
    try {
      const email = cleanString(req.body?.email, 180);
      if (!isEmail(email)) badRequest('Email chưa đúng');
      const [result] = await pool.execute<ResultSetHeader>('INSERT INTO email_reg (email, datetime) VALUES (?, ?)', [email, nowUnix()]);
      res.json({ error: result.insertId > 0 ? 0 : -1, id: result.insertId, message: 'Đã đăng ký email' });
    } catch (error) { next(error); }
  });

  return router;
}
