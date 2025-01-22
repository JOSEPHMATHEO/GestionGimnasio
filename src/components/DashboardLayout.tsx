import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/auth';
import { 
  Users, 
  Dumbbell, 
  Calendar, 
  CreditCard, 
  LogOut, 
  LayoutDashboard,
  ChevronRight
} from 'lucide-react';
import { Footer } from './footer';

export function DashboardLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', roles: ['admin', 'manager', 'trainer', 'client'] },
    { label: 'Users', icon: Users, path: '/users', roles: ['admin', 'manager'] },
    { label: 'Memberships', icon: CreditCard, path: '/memberships', roles: ['admin', 'manager'] },
    { label: 'Classes', icon: Dumbbell, path: '/classes', roles: ['admin', 'manager', 'trainer'] },
    { label: 'Bookings', icon: Calendar, path: '/bookings', roles: ['admin', 'manager', 'trainer', 'client'] },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b">
          <Dumbbell className="h-8 w-8 text-indigo-600" />
          <span className="ml-2 text-lg font-semibold text-gray-900">Gym Manager</span>
        </div>

        {/* User info */}
        <div className="px-6 py-4 border-b">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
              <span className="text-indigo-600 font-semibold">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="px-4 py-4">
          <ul className="space-y-1">
            {menuItems.map((item) => 
              item.roles.includes(user?.role || '') && (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center px-4 py-2 text-sm rounded-lg ${
                      location.pathname === item.path
                        ? 'bg-indigo-50 text-indigo-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    {item.label}
                    {location.pathname === item.path && (
                      <ChevronRight className="ml-auto h-4 w-4" />
                    )}
                  </Link>
                </li>
              )
            )}
          </ul>
        </nav>
        

        {/* Logout button */}
        <div className="absolute bottom-0 w-64 p-4 border-t">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
          >
            <LogOut className="h-5 w-5 mr-3" />
            Cerrar Sesión
          </button>
        </div>
      </div>
      {/* Main content */}
      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        <main className="flex-grow p-8">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}