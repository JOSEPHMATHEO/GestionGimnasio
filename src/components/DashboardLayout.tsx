import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/auth';
import { 
  Users, 
  Dumbbell, 
  Calendar, 
  CreditCard, 
  LogOut, 
  LayoutDashboard 
} from 'lucide-react';
import { Footer } from '../components/footer'; // Importa el Footer

export function DashboardLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', roles: ['admin', 'manager', 'trainer', 'client'] },
    { label: 'Usuarios', icon: Users, path: '/users', roles: ['admin', 'manager'] },
    { label: 'Membresias', icon: CreditCard, path: '/memberships', roles: ['admin', 'manager'] },
    { label: 'Clases', icon: Dumbbell, path: '/classes', roles: ['admin', 'manager', 'trainer'] },
    { label: 'Reservas', icon: Calendar, path: '/bookings', roles: ['admin', 'manager', 'trainer', 'client'] },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <nav className="bg-[#333333] text-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Dumbbell className="h-8 w-8 text-indigo-600" />
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {menuItems.map((item) => 
                  item.roles.includes(user?.role || '') && (
                    <Link
                      key={item.path}
                      to={item.path}
                      className="inline-flex items-center px-1 pt-1 text-sm font-medium text-white"
                    >
                      <item.icon className="h-4 w-4 mr-2" />
                      {item.label}
                    </Link>
                  )
                )}
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-white mr-4">
                {user?.firstName} {user?.lastName}
              </span>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="w-full flex-grow">
        <Outlet />
      </main>

      {/* Aquí agregamos el Footer */}
      <Footer />
    </div>
  );
}
