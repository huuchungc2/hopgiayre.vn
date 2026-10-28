export function toInt(value: unknown, fallback = 0): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.trunc(parsed) : fallback;
}

export function clampInt(value: unknown, fallback: number, min: number, max: number): number {
  const parsed = toInt(value, fallback);
  return Math.min(max, Math.max(min, parsed));
}

export function cleanString(value: unknown, maxLength = 255): string {
  return String(value ?? '')
    .replace(/\u0000/g, '')
    .replace(/[\t\r\n]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength);
}

export function cleanText(value: unknown, maxLength = 3000): string {
  return String(value ?? '')
    .replace(/\u0000/g, '')
    .trim()
    .slice(0, maxLength);
}

export function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 180;
}

export function isVietnamPhone(value: string): boolean {
  const phone = value.replace(/[\s.()+-]/g, '');
  return /^(0|84)\d{8,10}$/.test(phone);
}

export function safeJson<T>(value: unknown, fallback: T): T {
  if (value === null || value === undefined || value === '') return fallback;
  if (Array.isArray(value) || typeof value === 'object') return value as T;
  if (typeof value !== 'string') return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function slugify(input: string): string {
  return String(input || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function prefixAsset(folder: string, file?: string | null): string {
  const clean = String(file || '').trim();
  if (!clean) return '';
  if (/^https?:\/\//i.test(clean) || clean.startsWith('/')) return clean;
  if (clean.startsWith('upload/')) return clean;
  return `upload/${folder}/${clean}`;
}

export function productLink(name: string, link: string | null | undefined, id: number): string {
  return `${slugify(link || name || String(id))}-${id}.html`;
}

export class HttpError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
  }
}

export function badRequest(message: string): never {
  throw new HttpError(400, message);
}
