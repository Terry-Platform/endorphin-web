import { Navigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import { LoadingSpinner } from '../components/LoadingSpinner';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) return <LoadingSpinner />;
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
