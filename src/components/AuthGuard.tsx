import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/auth';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export function AuthGuard({ children, requireAuth = true }: AuthGuardProps) {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  // If we require auth and user is not authenticated, redirect to login
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If we don't require auth (login/register pages) and user is authenticated,
  // redirect to dashboard
  if (!requireAuth && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}