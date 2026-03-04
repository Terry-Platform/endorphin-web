export interface ApiSuccessResponse<T> {
  success: 1;
  data: T;
  error: 0;
  msg?: string | null;
}

export interface ApiUserResponse<T> {
  success: 1;
  data: T;
  user: UserInfo;
  error: 0;
}

export interface ApiErrorResponse {
  success: 1;
  data: false;
  error: 1;
  msg: string | null;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
export type ApiUserResponseOrError<T> = ApiUserResponse<T> | ApiErrorResponse;

export interface UserInfo {
  id: number;
  first_name: string;
  last_name: string;
  name: string;
  email: string;
  referral_code?: string;
  project_id?: number;
  [key: string]: unknown;
}

export class AuthError extends Error {
  constructor() {
    super('Unauthorized');
    this.name = 'AuthError';
  }
}
