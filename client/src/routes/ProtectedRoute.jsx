import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ allowedRole }) => {
  const { user, role, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-mono text-outline">Verifying Institutional Authorization...</p>
        </div>
      </div>
    );
  }

  // Not authenticated -> redirect to login with role hint
  if (!isAuthenticated || !user) {
    return <Navigate to={`/login?role=${allowedRole}`} state={{ from: location }} replace />;
  }

  // Authenticated, but role does not match allowedRole -> redirect to user's OWN dedicated portal
  if (role !== allowedRole) {
    const targetDashboard = role === 'admin' ? '/admin' : role === 'authority' ? '/authority' : '/student';
    return <Navigate to={targetDashboard} replace />;
  }

  // Authorized role match
  return <Outlet />;
};

export default ProtectedRoute;
