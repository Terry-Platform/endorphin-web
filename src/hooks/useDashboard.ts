import { useAuth } from '../auth/useAuth';
import type { DashboardData } from '../types/dashboard';

export function useDashboard(): {
  data: DashboardData | null;
  loading: boolean;
} {
  const { dashboard, isLoading } = useAuth();
  return { data: dashboard, loading: isLoading };
}
