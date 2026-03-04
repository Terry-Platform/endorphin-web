import { AuthError } from '../types/api';
import { getItem } from '../utils/storage';

const BASE_URL = import.meta.env.VITE_API_URL || 'https://api.terry.earth';

async function fetchCsrfToken(): Promise<string> {
  const res = await fetch(`${BASE_URL}/auth/csrf-token`, {
    credentials: 'include',
  });
  return res.text();
}

export async function apiGet<T>(path: string): Promise<T> {
  const token = getItem('auth_token');
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: 'include',
  });
  if (res.status === 401) throw new AuthError();
  return res.json();
}

export async function apiPost<T>(path: string, body: Record<string, unknown> = {}): Promise<T> {
  const _token = await fetchCsrfToken();
  const token = getItem('auth_token');
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: 'include',
    body: JSON.stringify({ ...body, _token }),
  });
  if (res.status === 401) throw new AuthError();
  return res.json();
}

export function getSocialAuthUrl(type: 'google' | 'apple'): string {
  // Pass web_redirect so the API callback can redirect the popup back to the SPA
  // This is the Safari fallback: window.opener is null after cross-origin redirects
  const callbackUrl = window.location.origin + window.location.pathname + '#/oauth-callback';
  return `${BASE_URL}/auth/social-auth/${type}?web_redirect=${encodeURIComponent(callbackUrl)}`;
}
