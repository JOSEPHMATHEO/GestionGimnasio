import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import api from '../../lib/axios';

const userSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters').optional(),
  role: z.enum(['admin', 'manager', 'trainer', 'client']),
  membershipId: z.string().optional(),
});



type UserFormData = {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  role: 'admin' | 'manager' | 'trainer' | 'client';
  membershipId?: string;
};

interface Membership {
  id_: string;
  name: string;
  description: string;
  cost: number;
}

interface UserFormProps {
  user?: UserFormData | null;
  onSubmit: (data: UserFormData) => void;
  onClose: () => void;
}


export function UserForm({ user, onSubmit, onClose }: UserFormProps) {
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const defaultValues = {
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    role: user?.role || 'client',
    membershipId: user?.membershipId || '',
    password: '',
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues,
  });

  // Watch the role field to show/hide membership select
  const roleValue = watch('role');

  useEffect(() => {
    const fetchMemberships = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await api.get('/memberships');
        setMemberships(response.data);
      } catch (error) {
        console.error('Error fetching memberships:', error);
        setError('Failed to load memberships');
      } finally {
        setIsLoading(false);
      }
    };
    fetchMemberships();
  }, []);

  const handleFormSubmit = (data: UserFormData) => {
    // Solo incluir membershipId si el rol es cliente
    const formData = {
      ...data,
      membershipId: data.role === 'client' ? data.membershipId : undefined,
    };
    console.log('Submitting form data:', formData);
    onSubmit(formData);
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            {user ? 'Edit User' : 'Add User'}
          </h3>
          <button
            onClick={onClose}
            type="button"
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
              Nombres
            </label>
            <input
              id="firstName"
              type="text"
              {...register('firstName')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
              Apellidos
            </label>
            <input
              id="lastName"
              type="text"
              {...register('lastName')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            {errors.lastName && (
              <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register('email')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          {!user && (
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                {...register('password')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>
          )}

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <select
              id="role"
              {...register('role')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="client">Cliente</option>
              <option value="trainer">Entrenador</option>
              <option value="manager">Manager</option>
              <option value="admin">Administrador</option>
            </select>
            {errors.role && (
              <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
            )}
          </div>

          {/* Show membership select only for clients */}
          {roleValue === 'client' && (
            <div>
              <label htmlFor="membershipId" className="block text-sm font-medium text-gray-700">
                Membership Plan
              </label>
              <select
                id="membershipId"
                {...register('membershipId')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="">Select a membership plan</option>
                {memberships.map((membership) => (
                  <option key={membership.id} value={membership.id}>
                    {membership.name} - ${membership.cost}/month
                  </option>
                ))}
              </select>
              {errors.membershipId && (
                <p className="mt-1 text-sm text-red-600">{errors.membershipId.message}</p>
              )}

              {/* Show membership details */}
              
              <div className="mt-4 overflow-x-auto">
                <div className="flex space-x-4">
                  {memberships.map((membership) => (
                    <div 
                      key={membership.id} 
                      className="p-3 border rounded-md min-w-[250px] max-w-xs flex-shrink-0"
                    >
                      <h4 className="font-medium">{membership.name}</h4>
                      <p className="text-sm text-gray-600">{membership.description}</p>
                      <p className="mt-1 font-bold">${membership.cost}/month</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#333333] hover:bg-zinc-600"
            >
              {user ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}