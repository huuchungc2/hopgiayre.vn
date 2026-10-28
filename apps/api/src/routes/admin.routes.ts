import type { Router } from 'express';
import express from 'express';
import { ResultSetHeader } from 'mysql2';
import { mapBlog, mapProduct } from '../mappers.js';
import { one, pool, query } from '../db.js';
import { createAdminSession, requireAdminToken, verifyAdminCredentials } from '../middleware/adminAuth.js';
import { badRequest, clampInt, cleanString, cleanText, toInt } from '../utils.js';

const nowUnix = () => Math.floor(Date.now() / 1000).toString();

function draftBlog(row: any) {
  return {
    ...mapBlog(row, true),
    status: toInt(row.status),
    hot: toInt(row.hot),
    keyword: row.keyword || '',
    title_seo: row.title_seo || '',
    type: row.type || 'article',
    update_time: row.update_time || ''
  };
}

export function createAdminRouter(): Router {
  const router = express.Router();

  router.post('/auth/login', (req, res, next) => {
    try {
      const username = cleanString(req.body?.username, 100);
      const password = cleanString(req.body?.password, 200);
      const directToken = cleanString(req.body?.token, 255);
      const expectedStaticToken = process.env.ADMIN_API_TOKEN || '';
      if (directToken && expectedStaticToken && directToken === expectedStaticToken) {
        return res.json({ user: { username: 'admin', role: 'owner' }, token: expectedStaticToken });
      }
      if (!verifyAdminCredentials(username, password)) badRequest('Sai tài khoản admin hoặc mật khẩu');
      const session = createAdminSession(username);
      res.json({ user: { username: session.username, role: session.role }, token: session.token });
    } catch (error) { next(error); }
  });

  router.get('/auth/me', (req, res, next) => {
    try {
      requireAdminToken(req);
      res.json({ ok: true, user: { username: 'admin', role: 'owner' } });
    } catch (error) { next(error); }
  });

  router.use((req, _res, next) => {
    try { requireAdminToken(req); next(); } catch (error) { next(error); }
  });

  router.get('/stats', async (_req, res, next) => {
    try {
      const [products, blogs, drafts, quotes] = await Promise.all([
        one<any>('SELECT COUNT(*) total FROM products'),
        one<any>('SELECT COUNT(*) total FROM blog WHERE status = 1'),
        one<any>('SELECT COUNT(*) total FROM blog WHERE status = 0'),
        one<any>('SELECT COUNT(*) total FROM email_reg')
      ]);
      res.json({
        products: toInt(products?.total),
        publishedBlogs: toInt(blogs?.total),
        draftBlogs: toInt(drafts?.total),
        leads: toInt(quotes?.total)
      });
    } catch (error) { next(error); }
  });

  router.get('/blogs', async (req, res, next) => {
    try {
      const page = clampInt(req.query.page, 1, 1, 500);
      const limit = clampInt(req.query.limit, 12, 1, 60);
      const offset = (page - 1) * limit;
      const status = cleanString(req.query.status ?? 'all', 20);
      const keyword = cleanString(req.query.keyword || '', 120);
      const where: string[] = ['type = ?'];
      const params: unknown[] = ['article'];
      if (status !== 'all') { where.push('status = ?'); params.push(status === 'published' ? 1 : 0); }
      if (keyword) { where.push('(title LIKE ? OR summary LIKE ? OR keyword LIKE ?)'); params.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`); }
      const whereSql = `WHERE ${where.join(' AND ')}`;
      const rows = await query<any>(`SELECT * FROM blog ${whereSql} ORDER BY id DESC LIMIT ? OFFSET ?`, [...params, limit, offset]);
      const totalRow = await one<any>(`SELECT COUNT(*) total FROM blog ${whereSql}`, params);
      res.json({ list_data: rows.map(draftBlog), total: toInt(totalRow?.total), page, limit });
    } catch (error) { next(error); }
  });

  router.get('/blogs/:id', async (req, res, next) => {
    try {
      const id = toInt(req.params.id);
      const row = await one<any>('SELECT * FROM blog WHERE id = ?', [id]);
      if (!row) return res.status(404).json({ message: 'Không tìm thấy bài viết' });
      res.json(draftBlog(row));
    } catch (error) { next(error); }
  });

  router.put('/blogs/:id', async (req, res, next) => {
    try {
      const id = toInt(req.params.id);
      const title = cleanString(req.body?.title, 200);
      const titleSeo = cleanString(req.body?.title_seo || req.body?.metaTitle || title, 200);
      const keyword = Array.isArray(req.body?.keywords) ? req.body.keywords.map((x: unknown) => cleanString(x, 80)).filter(Boolean).join(', ') : cleanString(req.body?.keyword || req.body?.keywords, 200);
      const summary = cleanString(req.body?.summary, 500);
      const content = cleanText(req.body?.content || req.body?.contentHtml, 30000);
      const status = toInt(req.body?.status, 0) ? 1 : 0;
      const hot = toInt(req.body?.hot, 0) ? 1 : 0;
      if (!title) badRequest('Thiếu tiêu đề bài viết');
      if (!content) badRequest('Thiếu nội dung bài viết');
      const [result] = await pool.execute<ResultSetHeader>(`UPDATE blog SET title = ?, title_seo = ?, keyword = ?, summary = ?, content = ?, status = ?, hot = ?, update_time = ? WHERE id = ?`, [title, titleSeo, keyword, summary, content, status, hot, nowUnix(), id]);
      if (!result.affectedRows) return res.status(404).json({ message: 'Không tìm thấy bài viết' });
      const row = await one<any>('SELECT * FROM blog WHERE id = ?', [id]);
      res.json({ message: 'Đã cập nhật bài viết', blog: draftBlog(row) });
    } catch (error) { next(error); }
  });

  router.post('/blogs/:id/publish', async (req, res, next) => {
    try {
      const id = toInt(req.params.id);
      const [result] = await pool.execute<ResultSetHeader>('UPDATE blog SET status = 1, update_time = ? WHERE id = ?', [nowUnix(), id]);
      if (!result.affectedRows) return res.status(404).json({ message: 'Không tìm thấy bài viết' });
      res.json({ message: 'Đã xuất bản bài viết', id });
    } catch (error) { next(error); }
  });

  router.post('/blogs/:id/unpublish', async (req, res, next) => {
    try {
      const id = toInt(req.params.id);
      const [result] = await pool.execute<ResultSetHeader>('UPDATE blog SET status = 0, update_time = ? WHERE id = ?', [nowUnix(), id]);
      if (!result.affectedRows) return res.status(404).json({ message: 'Không tìm thấy bài viết' });
      res.json({ message: 'Đã chuyển bài viết về nháp', id });
    } catch (error) { next(error); }
  });

  router.get('/products', async (req, res, next) => {
    try {
      const page = clampInt(req.query.page, 1, 1, 500);
      const limit = clampInt(req.query.limit, 12, 1, 60);
      const offset = (page - 1) * limit;
      const keyword = cleanString(req.query.keyword || '', 120);
      const where: string[] = [];
      const params: unknown[] = [];
      if (keyword) { where.push('(name LIKE ? OR code LIKE ? OR keyword LIKE ?)'); params.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`); }
      const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
      const rows = await query<any>(`SELECT * FROM products ${whereSql} ORDER BY pid DESC LIMIT ? OFFSET ?`, [...params, limit, offset]);
      const totalRow = await one<any>(`SELECT COUNT(*) total FROM products ${whereSql}`, params);
      res.json({ list_data: rows.map((row) => mapProduct(row, [])), total: toInt(totalRow?.total), page, limit });
    } catch (error) { next(error); }
  });

  router.get('/products/:id', async (req, res, next) => {
    try {
      const id = toInt(req.params.id);
      const row = await one<any>('SELECT * FROM products WHERE pid = ?', [id]);
      if (!row) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
      res.json(mapProduct(row, []));
    } catch (error) { next(error); }
  });

  router.put('/products/:id/content', async (req, res, next) => {
    try {
      const id = toInt(req.params.id);
      const shortDesc = cleanString(req.body?.short_desc || req.body?.shortDescription, 500);
      const content = cleanText(req.body?.mota || req.body?.contentHtml, 30000);
      const keyword = cleanString(req.body?.keyword || req.body?.keywords, 200);
      if (!content) badRequest('Thiếu nội dung mô tả sản phẩm');
      const [result] = await pool.execute<ResultSetHeader>('UPDATE products SET short_desc = ?, mota = ?, desc_html = ?, keyword = COALESCE(NULLIF(?, \'\'), keyword), updated_at = ? WHERE pid = ?', [shortDesc, content, content, keyword, nowUnix(), id]);
      if (!result.affectedRows) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
      res.json({ message: 'Đã cập nhật mô tả sản phẩm', id });
    } catch (error) { next(error); }
  });

  return router;
}
