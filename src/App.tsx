import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { DashboardLayout } from './components/DashboardLayout';
import { Dashboard } from './pages/Dashboard';
import { Users } from './pages/Users';
import { Memberships } from './pages/Memberships';
import { Classes } from './pages/Classes';
import { Bookings } from './pages/Bookings';
import { AuthGuard } from './components/AuhthGuard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes - redirect to dashboard if already authenticated */}
        <Route
          path="/login"
          element={
            <AuthGuard requireAuth={false}>
              <Login />
            </AuthGuard>
          }
        />
        <Route
          path="/register"
          element={
            <AuthGuard requireAuth={false}>
              <Register />
            </AuthGuard>
          }
        />

        {/* Protected routes - require authentication */}
        <Route
          path="/"
          element={
            <AuthGuard>
              <DashboardLayout />
            </AuthGuard>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="memberships" element={<Memberships />} />
          <Route path="classes" element={<Classes />} />
          <Route path="bookings" element={<Bookings />} />
        </Route>

        {/* Catch all - redirect to dashboard if authenticated, otherwise to login */}
        <Route
          path="*"
          element={
            <AuthGuard>
              <Navigate to="/dashboard" replace />
            </AuthGuard>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;