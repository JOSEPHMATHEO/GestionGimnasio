import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../stores/auth';
import { 
  Users, 
  Dumbbell, 
  Calendar, 
  CreditCard, 
  DollarSign,
  Activity,
  Trophy,
  Clock
} from 'lucide-react';
import api from '../lib/axios';

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
    cost: number;
  };
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  className?: string;
}

function StatCard({ title, value, icon, description, className = '' }: StatCardProps) {
  return (
    <div className={`bg-white rounded-lg shadow-sm p-6 ${className}`}>
      <div className="flex items-center">
        <div className="p-3 rounded-full bg-indigo-50 text-indigo-600">
          {icon}
        </div>
        <div className="ml-5">
          <p className="text-sm font-medium text-gray-500 truncate">{title}</p>
          <p className="mt-1 text-xl font-semibold text-gray-900">{value}</p>
          {description && (
            <p className="mt-1 text-sm text-gray-500">{description}</p>
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
      if (!user) {
        setError('User not authenticated');
        setIsLoading(false);
        return;
      }

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
        setError(error.response?.data?.message || 'Failed to load dashboard statistics');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  if (!user) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        Por favor, inicia sesion para visualizar el dashboard.
      </div>
    );
  }

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
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold text-gray-900 mx-4 my-4">Bienvennido de Vuelta, {user.firstName}!</h1>
      
      {/* Admin and Manager Stats */}
      {(user.role === 'admin' || user.role === 'manager') && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-4">
        <StatCard
          title="Total de Clientes"
          value={stats.totalClients || 0}
          icon={<Users className="h-8 w-8 text-indigo-600" />}
        />
        <StatCard
          title="Total de Entrenadores"
          value={stats.totalTrainers || 0}
          icon={<Dumbbell className="h-8 w-8 text-green-600" />}
        />
        <StatCard
          title="Membresias Activas"
          value={stats.totalMemberships || 0}
          icon={<CreditCard className="h-8 w-8 text-yellow-600" />}
        />
        <StatCard
          title="Total de Ganancias"
          value={`$${(stats.totalRevenue || 0).toLocaleString()}`}
          icon={<DollarSign className="h-8 w-8 text-red-600" />}
        />
      </div>      
      )}

      {/* Trainer Stats */}
      {user.role === 'trainer' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4">
          <StatCard
            title="Clases Activas"
            value={stats.activeClasses || 0}
            icon={<Dumbbell className="h-10 w-10 text-indigo-600" />}
          />
          <StatCard
            title="Resrvas"
            value={stats.upcomingBookings || 0}
            icon={<Calendar className="h-10 w-10 text-green-600" />}
          />
          <StatCard
            title="Sesiones Completadas"
            value={stats.completedBookings || 0}
            icon={<Trophy className="h-10 w-10 text-yellow-600" />}
          />
      </div>
      )}

      {/* Client Stats */}
      {user.role === 'client' && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4">
            <StatCard
              title="Estado de la Membresia"
              value={stats.membershipStatus?.name || 'No active membership'}
              icon={<CreditCard className="h-12 w-12 text-indigo-600" />}
              description={`Valid until: ${stats.membershipStatus?.validUntil || 'N/A'}`}
            />
            <StatCard
              title="Classes"
              value={stats.upcomingBookings || 0}
              icon={<Calendar className="h-12 w-12 text-green-500" />}
            />
            <StatCard
              title="Classes Atendidas"
              value={stats.completedBookings || 0}
              icon={<Activity className="h-12 w-12 text-yellow-500" />}
            />
          </div>

          {stats.membershipStatus?.daysLeft !== undefined && 
           stats.membershipStatus?.daysLeft <= 7 && (
            <div className="mt-6 bg-yellow-50 border border-yellow-200 p-4 rounded-md">
              <div className="flex">
                <Clock className="h-5 w-5 text-yellow-400" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    Membresia Expirara pronto 
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>
                      Tu membresia expirará en {stats.membershipStatus.daysLeft} dias. 
                      Considere renovarla para mantener el acceso a todas las facilidades y clases del gimnasio.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}