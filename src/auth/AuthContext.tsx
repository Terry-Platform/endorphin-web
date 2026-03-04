import { createContext } from 'react';
import type { UserInfo } from '../types/api';
import type { DashboardData } from '../types/dashboard';

export interface AuthContextValue {
  token: string | null;
  user: UserInfo | null;
  dashboard: DashboardData | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithToken: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshDashboard: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
