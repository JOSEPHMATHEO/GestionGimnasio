import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../stores/auth';

export function AuthLayout() {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Outlet />
    </div>
  );
}