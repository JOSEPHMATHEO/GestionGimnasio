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
  ChevronRight,
  Bell,
  Search,
  Settings
} from 'lucide-react';

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
    { label: 'Usuarios', icon: Users, path: '/users', roles: ['admin', 'manager'] },
    { label: 'Membresías', icon: CreditCard, path: '/memberships', roles: ['admin', 'manager'] },
    { label: 'Clases', icon: Dumbbell, path: '/classes', roles: ['admin', 'manager', 'trainer'] },
    { label: 'Reservas', icon: Calendar, path: '/bookings', roles: ['admin', 'manager', 'trainer', 'client'] },
  ];

  const getCurrentPageTitle = () => {
    const currentMenuItem = menuItems.find(item => item.path === location.pathname);
    return currentMenuItem?.label || 'Dashboard';
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-64 bg-zinc-900 shadow-lg fixed h-full">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 bg-zinc-900">
          <Dumbbell className="h-8 w-8 text-white" />
          <span className="ml-2 text-lg font-semibold text-white">Gym Active</span>
        </div>

        {/* User info */}
        <div className="px-6 py-4 bg-gradient-to-r  bg-zinc-900  bg-zinc-900">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
              <span className="text-bg-gray-900 font-semibold text-lg">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-indigo-100 capitalize">{user?.role}</p>
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
                    className={`flex items-center px-4 py-2.5 text-sm rounded-lg transition-all duration-200 ${
                      location.pathname === item.path
                        ? 'bg-gray-600 text-white font-medium'
                        : 'text-white hover:bg-gray-600'
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
        <div className="absolute bottom-0 w-64 p-4 border-t bg-zinc-900">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-2 text-sm text-white hover:bg-gray-600 rounded-lg transition-colors duration-200"
          >
            <LogOut className="h-5 w-5 mr-3" />
            Cerrar Sesión
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 ml-64">
        {/* Top bar */}
        <div className="h-16 bg-zinc-800 shadow-sm flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-white">{getCurrentPageTitle()}</h1>
          </div>
          <div className="flex items-center space-x-6">
            {/* Search bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-64 pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <Search className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
            </div>
            
            {/* Notification bell */}
            <button className="relative p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500">
              <Bell className="h-6 w-6" />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"></span>
            </button>
            
            {/* Settings */}
            <button className="p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500">
              <Settings className="h-6 w-6" />
            </button>

            {/* User profile */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                <span className="text-gray-900 font-semibold">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-8 bg-gray-50 min-h-[calc(100vh-4rem)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}