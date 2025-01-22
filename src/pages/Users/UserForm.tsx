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
  password: z.string().min(6, 'Password must be at least 6 characters').optional().nullable(),
  role: z.enum(['admin', 'manager', 'trainer', 'client']),
  membershipId: z.string().optional().nullable(),
});

type UserFormData = z.infer<typeof userSchema>;

interface Membership {
  _id: string;
  name: string;
  description: string;
  cost: number;
}

interface UserFormProps {
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    membershipId?: string;
  } | null;
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
    password: '',
    role: (user?.role as UserFormData['role']) || 'client',
    membershipId: user?.membershipId || null,
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
    // Prepare form data
    const formData = {
      ...data,
      // Only include password if it's provided and not empty
      password: data.password ? data.password : undefined,
      // Only include membershipId for clients
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

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
              Nombre
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
              Apellido
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
              Correo electrónico
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

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              {user ? 'New Password (optional)' : 'Password'}
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

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">
              Rol
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

          {roleValue === 'client' && (
            <div>
              <label htmlFor="membershipId" className="block text-sm font-medium text-gray-700">
                Planes de Membresia
              </label>
              <select
                id="membershipId"
                {...register('membershipId')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="">Selecciones una membresia</option>
                {memberships.map((membership) => (
                  <option key={membership._id} value={membership._id}>
                    {membership.name} - ${membership.cost}/mes
                  </option>
                ))}
              </select>
              {errors.membershipId && (
                <p className="mt-1 text-sm text-red-600">{errors.membershipId.message}</p>
              )}
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#333333] hover:bg-zinc-600 mx-24"
            >
              {user ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}