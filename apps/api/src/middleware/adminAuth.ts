import type { Request } from 'express';
import crypto from 'node:crypto';
import { HttpError, cleanString } from '../utils.js';

export type AdminSession = {
  username: string;
  token: string;
  role: 'owner' | 'admin';
};

const issuedTokens = new Map<string, { username: string; expiresAt: number }>();

function configuredAdminToken(): string {
  return process.env.ADMIN_API_TOKEN || '';
}

export function isAdminProtectionEnabled(): boolean {
  return Boolean(configuredAdminToken() || process.env.ADMIN_USERNAME || process.env.ADMIN_PASSWORD);
}

export function createAdminSession(username: string): AdminSession {
  const staticToken = configuredAdminToken();
  const token = staticToken || crypto.randomBytes(32).toString('hex');
  issuedTokens.set(token, { username, expiresAt: Date.now() + 1000 * 60 * 60 * 24 });
  return { username, token, role: 'owner' };
}

export function verifyAdminCredentials(username: string, password: string): boolean {
  const expectedUser = process.env.ADMIN_USERNAME || 'admin';
  const expectedPassword = process.env.ADMIN_PASSWORD || '';
  if (!expectedPassword && configuredAdminToken()) return false;
  if (!expectedPassword) return false;
  return username === expectedUser && password === expectedPassword;
}

export function requireAdminToken(req: Request) {
  const staticToken = configuredAdminToken();
  const header = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '').trim();
  const token = header || cleanString(req.headers['x-admin-token'], 255);

  if (!isAdminProtectionEnabled()) return;
  if (!token) throw new HttpError(401, 'Chưa đăng nhập admin hoặc thiếu admin token');
  if (staticToken && token === staticToken) return;

  const session = issuedTokens.get(token);
  if (!session || session.expiresAt < Date.now()) {
    issuedTokens.delete(token);
    throw new HttpError(401, 'Phiên admin đã hết hạn hoặc token không đúng');
  }
}
