import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from './AuthProvider';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireOnboarding?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAuth = true,
  requireOnboarding = false
}) => {
  const { isAuthenticated, isOnboarded, loading } = useAuthContext();
  const location = useLocation();

  // If still loading auth state, show loading indicator
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-midnight-navy">
        <div className="w-12 h-12 border-4 border-champagne-gold/30 border-t-champagne-gold rounded-full animate-spin"></div>
      </div>
    );
  }

  // If authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If onboarding is required but user hasn't completed it
  if (requireAuth && requireOnboarding && !isOnboarded) {
    return <Navigate to="/onboarding" state={{ from: location }} replace />;
  }

  // If user is authenticated but tries to access auth pages
  if (!requireAuth && isAuthenticated) {
    return <Navigate to="/discover" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;