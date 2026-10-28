const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return (process.env.NEXT_PUBLIC_API_BASE_URL || '/api').replace(/\/$/, '');
  }
  return (process.env.INTERNAL_API_URL || 'http://localhost:3001/api').replace(/\/$/, '');
};

export const ASSET_BASE_URL = (process.env.NEXT_PUBLIC_ASSET_BASE_URL || '').replace(/\/$/, '');

export class ApiError extends Error {
  constructor(message: string, public readonly status?: number) {
    super(message);
  }
}

export function assetUrl(path?: string, fallback = ''): string {
  if (!path) return fallback;
  if (/^https?:\/\//i.test(path)) return path;
  const clean = path.replace(/^\/+/, '');
  return ASSET_BASE_URL ? `${ASSET_BASE_URL}/${clean}` : `/${clean}`;
}

async function parseResponse<T>(response: Response, endpoint: string): Promise<T> {
  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json') ? await response.json().catch(() => null) : null;
  if (!response.ok) {
    throw new ApiError(payload?.message || `API lỗi ${response.status}: ${endpoint}`, response.status);
  }
  return payload as T;
}

export async function apiGet<T>(endpoint: string, params: Record<string, unknown> = {}, init: RequestInit = {}): Promise<T> {
  const base = getBaseUrl();
  const cleanEndpoint = endpoint.replace(/^\/+/, '');
  
  let urlString = `${base}/${cleanEndpoint}`;
  const queryParams = new URLSearchParams();
  const adminToken = typeof params.__adminToken === 'string' ? params.__adminToken : '';

  Object.entries(params).forEach(([key, value]) => {
    if (key === '__adminToken') return;
    if (value !== undefined && value !== null && value !== '') {
      queryParams.set(key, String(value));
    }
  });

  const queryString = queryParams.toString();
  if (queryString) {
    urlString += (urlString.includes('?') ? '&' : '?') + queryString;
  }

  const response = await fetch(urlString, {
    ...init,
    headers: {
      Accept: 'application/json',
      ...(adminToken ? { Authorization: `Bearer ${adminToken}` } : {}),
      ...init.headers,
    },
    cache: typeof window === 'undefined' ? 'no-store' : undefined,
  });

  return parseResponse<T>(response, endpoint);
}

export async function apiPost<T>(endpoint: string, body: Record<string, unknown>): Promise<T> {
  const base = getBaseUrl();
  const cleanEndpoint = endpoint.replace(/^\/+/, '');
  const urlString = `${base}/${cleanEndpoint}`;

  const adminToken = typeof body.__adminToken === 'string' ? body.__adminToken : '';
  const cleanBody = { ...body };
  delete cleanBody.__adminToken;

  const response = await fetch(urlString, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(adminToken ? { Authorization: `Bearer ${adminToken}` } : {}),
    },
    body: JSON.stringify(cleanBody),
  });

  return parseResponse<T>(response, endpoint);
}

export async function apiPut<T>(endpoint: string, body: Record<string, unknown>): Promise<T> {
  const base = getBaseUrl();
  const cleanEndpoint = endpoint.replace(/^\/+/, '');
  const urlString = `${base}/${cleanEndpoint}`;

  const adminToken = typeof body.__adminToken === 'string' ? body.__adminToken : '';
  const cleanBody = { ...body };
  delete cleanBody.__adminToken;

  const response = await fetch(urlString, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(adminToken ? { Authorization: `Bearer ${adminToken}` } : {}),
    },
    body: JSON.stringify(cleanBody),
  });

  return parseResponse<T>(response, endpoint);
}
