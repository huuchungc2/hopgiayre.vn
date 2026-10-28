import type { Router } from 'express';
import express from 'express';
import { ResultSetHeader } from 'mysql2';
import { generateBlogDraft, generateProductDescription, generateSeoDraft } from '../ai.service.js';
import { pool } from '../db.js';
import { requireAdminToken } from '../middleware/adminAuth.js';
import { badRequest, cleanString, cleanText, slugify } from '../utils.js';

const nowUnix = () => Math.floor(Date.now() / 1000).toString();

export function createAiRouter(): Router {
  const router = express.Router();

  router.use((req, _res, next) => {
    try { requireAdminToken(req); next(); } catch (error) { next(error); }
  });

  router.get('/status', (_req, res) => {
    res.json({
      enabled: Boolean(process.env.OPENAI_API_KEY),
      model: process.env.AI_MODEL || 'gpt-4o-mini',
      adminTokenRequired: Boolean(process.env.ADMIN_API_TOKEN || process.env.ADMIN_PASSWORD)
    });
  });

  router.post('/blog/generate', async (req, res, next) => {
    try {
      const topic = cleanString(req.body?.topic, 180);
      if (!topic) badRequest('Vui lòng nhập chủ đề bài viết');
      const draft = await generateBlogDraft({
        topic,
        keywords: cleanString(req.body?.keywords, 500),
        tone: cleanString(req.body?.tone, 120),
        length: cleanString(req.body?.length, 60),
        audience: cleanString(req.body?.audience, 160)
      });
      res.json({ draft });
    } catch (error) { next(error); }
  });

  router.post('/blog/save-draft', async (req, res, next) => {
    try {
      const draft = req.body?.draft || {};
      const title = cleanString(draft.title, 200);
      const summary = cleanString(draft.summary || draft.metaDescription, 500);
      const contentHtml = cleanText(draft.contentHtml, 20000);
      if (!title) badRequest('Thiếu tiêu đề bài viết');
      if (!contentHtml) badRequest('Thiếu nội dung bài viết');
      const now = nowUnix();
      const keywords = Array.isArray(draft.keywords) ? draft.keywords.map((x: unknown) => cleanString(x, 80)).filter(Boolean).join(', ') : cleanString(draft.keywords, 200);
      const [result] = await pool.execute<ResultSetHeader>(`INSERT INTO blog
        (title, title_seo, category, keyword, type, image, summary, link_video, content, datetime, update_time, author, author_id, related_blog, status, hot, idx)
        VALUES (?, ?, 0, ?, 'article', '', ?, '', ?, ?, ?, 'AI Writer', 0, '', 0, 0, 1)`, [
        title,
        cleanString(draft.metaTitle || title, 200),
        keywords,
        summary,
        contentHtml,
        now,
        now
      ]);
      res.json({ id: result.insertId, status: 'draft', slug: `${slugify(draft.slug || title)}-${result.insertId}.html`, message: 'Đã lưu bài viết AI ở trạng thái nháp' });
    } catch (error) { next(error); }
  });

  router.post('/product-description/generate', async (req, res, next) => {
    try {
      const productName = cleanString(req.body?.productName, 180);
      if (!productName) badRequest('Vui lòng nhập tên sản phẩm');
      const draft = await generateProductDescription({
        productName,
        category: cleanString(req.body?.category, 120),
        material: cleanString(req.body?.material, 160),
        size: cleanString(req.body?.size, 120),
        price: cleanString(req.body?.price, 120),
        keywords: cleanString(req.body?.keywords, 500)
      });
      res.json({ draft });
    } catch (error) { next(error); }
  });

  router.post('/seo/generate', async (req, res, next) => {
    try {
      const title = cleanString(req.body?.title, 200);
      if (!title) badRequest('Vui lòng nhập tiêu đề hoặc ý tưởng SEO');
      const draft = await generateSeoDraft({
        title,
        currentContent: cleanText(req.body?.currentContent, 2500),
        keywords: cleanString(req.body?.keywords, 500)
      });
      res.json({ draft });
    } catch (error) { next(error); }
  });

  return router;
}
