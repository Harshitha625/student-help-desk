import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-cream">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-brand-teal border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-brand-teal tracking-wider uppercase">Loading Session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // Redirect user to their own role's primary landing space
    if (user?.role === 'STUDENT') return <Navigate to="/student" replace />;
    if (user?.role === 'WARDEN') return <Navigate to="/warden" replace />;
    if (user?.role === 'ADMIN') return <Navigate to="/admin" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
}
