import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../stores/auth';
import { 
  Users, 
  Dumbbell, 
  CreditCard, 
  DollarSign, 
  Calendar, 
  Clock, 
  Trophy, 
  Activity,
  Mail,
  UserCircle,
  Calendar as CalendarIcon,
  Clock as ClockIcon,
  Award,
  Shield
} from 'lucide-react';
import api from '../lib/axios';

interface DashboardStats {
  // Admin & Manager stats
  totalClients?: number;
  totalTrainers?: number;
  totalMemberships?: number;
  totalRevenue?: number;

  // Trainer stats
  activeClasses?: number;
  upcomingBookings?: number;
  completedBookings?: number;

  // Client stats
  membershipStatus?: {
    name: string;
    validUntil: string;
    daysLeft: number;
    cost: number;
  };
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
}

function StatCard({ title, value, icon, description }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center">
        <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
          {icon}
        </div>
        <div className="ml-5">
          <p className="text-sm font-medium text-gray-500 truncate">{title}</p>
          <p className="mt-1 text-xl font-semibold text-gray-900">{value}</p>
          {description && (
            <p className="mt-1 text-sm text-gray-600">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
}

function UserPanel({ user }: { user: any }) {
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      case 'manager':
        return 'bg-blue-100 text-blue-800';
      case 'trainer':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-6 h-max">
      {/* Profile Header */}
      <div className="text-center">
        <div className="inline-flex p-4 rounded-full bg-indigo-100 text-indigo-600 mb-4">
          <UserCircle className="h-12 w-12" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">
          {user.firstName + user.lastName}
        </h2>
        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${getRoleBadgeColor(user.role)}`}> 
          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
        </span>
      </div>

      {/* Contact Information */}
      <div className="border-t border-gray-200 pt-4">
        <h3 className="text-sm font-medium text-gray-500 mb-3">Correo electronico</h3>
        <div className="space-y-3">
          <div className="flex items-center text-sm">
            <Mail className="h-4 w-4 text-gray-400 mr-2" />
            <span className="text-gray-900">{user.email}</span>
          </div>
        </div>
      </div>

      {/* Account Details */}
      <div className="border-t border-gray-200 pt-4">
        <h3 className="text-sm font-medium text-gray-500 mb-3">Account Details</h3>
        <div className="space-y-3">
          <div className="flex items-center text-sm">
            <CalendarIcon className="h-4 w-4 text-gray-400 mr-2" />
            <span className="text-gray-900">Joined {new Date(user.createdAt).toLocaleDateString()}</span>
          </div>
          {user.role === 'client' && user.membership && (
            <div className="flex items-center text-sm">
              <CreditCard className="h-4 w-4 text-gray-400 mr-2" />
              <span className="text-gray-900">{user.membership.name} Membresia</span>
            </div>
          )}
        </div>
      </div>

      {/* Role-specific Information */}
      {user.role === 'trainer' && (
        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-sm font-medium text-gray-500 mb-3">Status Entrenador</h3>
          <div className="space-y-3">
            <div className="flex items-center text-sm">
              <Award className="h-4 w-4 text-gray-400 mr-2" />
              <span className="text-gray-900">Entrenador Certificado</span>
            </div>
          </div>
        </div>
      )}

      {user.role === 'admin' && (
        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-sm font-medium text-gray-500 mb-3">Privilegios de Administrador</h3>
          <div className="space-y-3">
            <div className="flex items-center text-sm">
              <Shield className="h-4 w-4 text-gray-400 mr-2" />
              <span className="text-gray-900">Acceso Completo al Sistema</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function Dashboard() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        setError(null);

        let endpoint = '/stats';
        if (user.role === 'trainer') {
          endpoint = '/stats/trainer';
        } else if (user.role === 'client') {
          endpoint = '/stats/client';
        }

        const response = await api.get(endpoint);
        setStats(response.data);
      } catch (error: any) {
        console.error('Error fetching stats:', error);
        setError('Failed to load dashboard statistics');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="flex gap-6 min-h-[calc(100vh-4rem)]">
      {/* User Panel - Right Side */}
      <div className="w-1/4 bg-white rounded-lg shadow-sm">
        <div className="sticky top-6">
          <UserPanel user={user} />
        </div>
      </div>

      {/* Dashboard Content - Left Side */}
      <div className="flex-1 space-y-6">
        <h1 className="text-4xl font-extrabold text-gray-900 mx-4 my-8">Dashboard {user?.role} </h1>
        
        {/* Admin and Manager Stats */}
        {(user?.role === 'admin' || user?.role === 'manager') && (
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
            <StatCard
              title="Total Clients"
              value={stats.totalClients || 0}
              icon={<Users className="h-10 w-10 text-blue-500" />}
              bgColor="bg-blue-100"
              textColor="text-blue-600"
            />
            <StatCard
              title="Total Trainers"
              value={stats.totalTrainers || 0}
              icon={<Dumbbell className="h-10 w-10 text-green-500" />}
              bgColor="bg-green-100"
              textColor="text-green-600"
            />
            <StatCard
              title="Active Memberships"
              value={stats.totalMemberships || 0}
              icon={<CreditCard className="h-10 w-10 text-purple-500" />}
              bgColor="bg-purple-100"
              textColor="text-purple-600"
            />
            <StatCard
              title="Total Revenue"
              value={`$${stats.totalRevenue?.toLocaleString() || '0'}`}
              icon={<DollarSign className="h-10 w-10 text-yellow-500" />}
              bgColor="bg-yellow-100"
              textColor="text-yellow-600"
            />
            <StatCard
              title="Total Mangers"
              value={stats.totalManager || 0}
              icon={<DollarSign className="h-10 w-10 text-yellow-500" />}
              bgColor="bg-yellow-100"
              textColor="text-yellow-600"
            />
          </div>

        )}

        {/* Trainer Stats */}
        {user?.role === 'trainer' && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <StatCard
              title="Active Classes"
              value={stats.activeClasses || 0}
              icon={<Dumbbell className="h-6 w-6" />}
            />
            <StatCard
              title="Upcoming Bookings"
              value={stats.upcomingBookings || 0}
              icon={<Calendar className="h-6 w-6" />}
            />
            <StatCard
              title="Completed Sessions"
              value={stats.completedBookings || 0}
              icon={<Trophy className="h-6 w-6" />}
            />
          </div>
        )}

        {/* Client Stats */}
        {user?.role === 'client' && (
          <>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <StatCard
                title="Membership Status"
                value={stats.membershipStatus?.name || 'No active membership'}
                icon={<CreditCard className="h-6 w-6" />}
                description={`Valid until: ${stats.membershipStatus?.validUntil || 'N/A'}`}
              />
              <StatCard
                title="Upcoming Classes"
                value={stats.upcomingBookings || 0}
                icon={<Calendar className="h-6 w-6" />}
              />
              <StatCard
                title="Classes Attended"
                value={stats.completedBookings || 0}
                icon={<Activity className="h-6 w-6" />}
              />
            </div>

            {stats.membershipStatus?.daysLeft !== undefined && stats.membershipStatus?.daysLeft <= 7 && (
              <div className="mt-6 bg-yellow-50 border border-yellow-200 p-4 rounded-md">
                <div className="flex">
                  <Clock className="h-5 w-5 text-yellow-400" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      Membership Expiring Soon
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>
                        Your membership will expire in {stats.membershipStatus.daysLeft} days. 
                        Consider renewing to maintain access to all gym facilities and classes.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}