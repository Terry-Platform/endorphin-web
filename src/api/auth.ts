import { apiPost } from './client';
import { API_ROUTES } from './routes';
import type { ApiResponse } from '../types/api';

export async function loginWithEmail(
  email: string,
  password: string,
): Promise<ApiResponse<string>> {
  return apiPost<ApiResponse<string>>(API_ROUTES['auth.login'], {
    email,
    password,
    device_name: 'web-app',
  });
}

export async function logout(): Promise<void> {
  try {
    await apiPost(API_ROUTES['auth.logout'], { device_name: 'web-app' });
  } catch {
    // Ignore errors on logout
  }
}
