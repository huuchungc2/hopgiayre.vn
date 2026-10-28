import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { one } from './db.js';
import { HttpError } from './utils.js';
import { createAiRouter } from './routes/ai.routes.js';
import { createAdminRouter } from './routes/admin.routes.js';
import { createPublicRouter } from './routes/public.routes.js';

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '../../..');
const assetsDir = path.resolve(rootDir, 'public-assets');
const webDistDir = path.resolve(rootDir, 'apps/web/dist');
const isDev = process.env.NODE_ENV === 'development';

const allowedOrigins = (process.env.WEB_ORIGIN || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.disable('x-powered-by');
app.use(helmet({
  crossOriginResourcePolicy: false,
  contentSecurityPolicy: false
}));
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error(`CORS blocked origin: ${origin}`));
  },
  credentials: true
}));
app.use(express.json({ limit: process.env.JSON_LIMIT || '1mb' }));
app.use(express.urlencoded({ extended: true, limit: process.env.FORM_LIMIT || '1mb' }));

app.use('/upload', express.static(path.join(assetsDir, 'upload'), { maxAge: isDev ? 0 : '30d', immutable: !isDev }));
app.use('/images', express.static(path.join(assetsDir, 'images'), { maxAge: isDev ? 0 : '30d', immutable: !isDev }));
app.use('/includehome', express.static(path.join(assetsDir, 'includehome'), { maxAge: isDev ? 0 : '30d', immutable: !isDev }));

app.get('/health', async (_req, res, next) => {
  try {
    await one('SELECT 1 ok');
    res.json({ ok: true, service: 'hopgiayre-api', version: '2.2.0' });
  } catch (error) {
    next(error);
  }
});

app.use('/api', createPublicRouter());
app.use('/api/ai', createAiRouter());
app.use('/api/admin', createAdminRouter());

app.use(express.static(webDistDir, { maxAge: isDev ? 0 : '1h' }));
app.use((req, res, next) => {
  if (req.method !== 'GET' || req.path.startsWith('/api/')) return next();
  res.sendFile(path.join(webDistDir, 'index.html'));
});

app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  const status = error instanceof HttpError ? error.status : 500;
  const message = error instanceof Error ? error.message : 'Lỗi server';
  if (status >= 500) console.error(error);
  res.status(status).json({ message: status >= 500 ? 'Lỗi server' : message, detail: isDev ? String(error) : undefined });
});

const port = Number(process.env.PORT || 4000);
app.listen(port, () => console.log(`HopGiayRe API listening on http://localhost:${port}`));
