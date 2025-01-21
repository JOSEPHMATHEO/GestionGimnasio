import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../stores/auth';
import { Users, Dumbbell, CreditCard, DollarSign, Calendar, Clock, Trophy, Activity } from 'lucide-react';
import api from '../lib/axios';
import { Menu, X } from 'lucide-react'; // Iconos para abrir/cerrar el menú

interface DashboardStats {
  totalClients?: number;
  totalTrainers?: number;
  totalMemberships?: number;
  totalRevenue?: number;
  activeClasses?: number;
  upcomingBookings?: number;
  completedBookings?: number;
  membershipStatus?: {
    name: string;
    validUntil: string;
    daysLeft: number;
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

export function Dashboard() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch statistics based on user role
        let endpoint = '/stats';
        if (user?.role === 'trainer') {
          endpoint = '/stats/trainer';
        } else if (user?.role === 'client') {
          endpoint = '/stats/client';
        }

        const response = await api.get(endpoint);
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
        setError('Failed to load dashboard statistics');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [user?.role]);

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

  // Admin and Manager Dashboard
  if (user?.role === 'admin' || user?.role === 'manager') {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard Overview</h1>
        
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Clients"
            value={stats.totalClients || 0}
            icon={<Users className="h-6 w-6" />}
          />
          <StatCard
            title="Total Trainers"
            value={stats.totalTrainers || 0}
            icon={<Dumbbell className="h-6 w-6" />}
          />
          <StatCard
            title="Active Memberships"
            value={stats.totalMemberships || 0}
            icon={<CreditCard className="h-6 w-6" />}
          />
          <StatCard
            title="Total Revenue"
            value={`$${stats.totalRevenue?.toLocaleString() || '0'}`}
            icon={<DollarSign className="h-6 w-6" />}
          />
        </div>
      </div>
    );
  }

  // Trainer Dashboard
  if (user?.role === 'trainer') {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-gray-900">Trainer Dashboard</h1>
        
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
      </div>
    );
  }

  // Client Dashboard
  if (user?.role === 'client') {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-gray-900">My Fitness Dashboard</h1>
        
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
      </div>
    );
  }

  return null;
}