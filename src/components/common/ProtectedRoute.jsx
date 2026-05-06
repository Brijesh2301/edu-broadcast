import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { LoadingSpinner } from './LoadingSpinner';

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { isAuthenticated, isInitializing, user } = useAuth();

  if (isInitializing) {
    return <LoadingSpinner fullscreen size="lg" />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    const fallback =
      user?.role === 'principal'
        ? '/principal/dashboard'
        : '/teacher/dashboard';
    return <Navigate to={fallback} replace />;
  }

  return <Outlet />;
};

export { ProtectedRoute };
export default ProtectedRoute;
