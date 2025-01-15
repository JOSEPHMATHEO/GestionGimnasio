import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Users } from './pages/Users';
import { Classes } from './pages/Classes';
import { Memberships } from './pages/Memberships';
import { Bookings } from './pages/Bookings';
import { AuthGuard } from './components/AuthGuard';
import { DashboardLayout } from './components/DashboardLayout';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
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

        {/* Protected routes */}
        <Route element={<DashboardLayout />}>
          <Route
            path="/"
            element={
              <AuthGuard>
                <Dashboard />
              </AuthGuard>
            }
          />
          <Route
            path="/dashboard"
            element={
              <AuthGuard>
                <Dashboard />
              </AuthGuard>
            }
          />
          <Route
            path="/users"
            element={
              <AuthGuard>
                <Users />
              </AuthGuard>
            }
          />
          <Route
            path="/classes"
            element={
              <AuthGuard>
                <Classes />
              </AuthGuard>
            }
          />
          <Route
            path="/memberships"
            element={
              <AuthGuard>
                <Memberships />
              </AuthGuard>
            }
          />
          <Route
            path="/bookings"
            element={
              <AuthGuard>
                <Bookings />
              </AuthGuard>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}