import { useState, useEffect, useCallback, type ReactNode } from 'react';
import { AuthContext } from './AuthContext';
import { loginWithEmail, logout as apiLogout } from '../api/auth';
import { fetchDashboard } from '../api/dashboard';
import { getItem, setItem, removeItem } from '../utils/storage';
import type { UserInfo } from '../types/api';
import type { DashboardData } from '../types/dashboard';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadDashboard = useCallback(async () => {
    try {
      const res = await fetchDashboard();
      console.log('[DEBUG] Dashboard API response:', JSON.stringify(res, null, 2));
      if (res.error === 0) {
        setDashboard(res.data);
        if ('user' in res) setUser(res.user);
      }
    } catch (err) {
      console.error('[DEBUG] Dashboard fetch error:', err);
      // Token invalid — clear auth
      setToken(null);
      setUser(null);
      setDashboard(null);
      removeItem('auth_token');
    }
  }, []);

  const loginWithToken = useCallback(async (newToken: string) => {
    setItem('auth_token', newToken);
    setToken(newToken);
    // Dashboard will be loaded by the useEffect below
  }, []);

  // Load dashboard whenever token changes
  useEffect(() => {
    if (token) {
      loadDashboard();
    }
  }, [token, loadDashboard]);

  // On mount: restore token from storage or URL hash
  useEffect(() => {
    const stored = getItem('auth_token');
    if (stored) {
      setToken(stored);
    } else {
      setIsLoading(false);
    }

    // Listen for OAuth postMessage from popup
    const handleMessage = (event: MessageEvent) => {
      const { data } = event;
      // Log all messages for debugging (filter out noise like webpack HMR)
      if (data && typeof data === 'object' && data.token) {
        console.log('[Auth] postMessage received:', JSON.stringify(data));
      }
      // Match blade template: { action, token, status: "success" }
      if (data?.token && data?.status === 'success') {
        console.log('[Auth] OAuth token received, logging in...');
        loginWithToken(data.token);
      }
      // Also accept: { action: "LOGIN_WITH_GOOGLE", token: "..." } without status
      if (data?.token && (data?.action === 'LOGIN_WITH_GOOGLE' || data?.action === 'LOGIN_WITH_APPLE') && !data?.status) {
        console.log('[Auth] OAuth token received (action-only format)');
        loginWithToken(data.token);
      }
      // Restore token from parent frame (iframe embed)
      if (data?.type === 'AUTH_TOKEN_RESTORE' && data?.token) {
        loginWithToken(data.token);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [loginWithToken]);

  // Mark loading done once dashboard is loaded or token is confirmed absent
  useEffect(() => {
    if (dashboard || (!token && isLoading)) {
      setIsLoading(false);
    }
  }, [dashboard, token, isLoading]);

  const login = useCallback(async (email: string, password: string) => {
    const res = await loginWithEmail(email, password);
    if (res.error === 0 && typeof res.data === 'string') {
      await loginWithToken(res.data);
    } else if (res.error === 1) {
      throw new Error(res.msg || 'Login mislukt');
    }
  }, [loginWithToken]);

  const logout = useCallback(async () => {
    await apiLogout();
    removeItem('auth_token');
    setToken(null);
    setUser(null);
    setDashboard(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        dashboard,
        isLoggedIn: !!token && !!user,
        isLoading,
        login,
        loginWithToken,
        logout,
        refreshDashboard: loadDashboard,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
