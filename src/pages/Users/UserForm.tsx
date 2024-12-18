import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';

const userSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters').optional(),
  role: z.enum(['admin', 'manager', 'trainer', 'client']),
});

type UserFormData = {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  role: 'admin' | 'manager' | 'trainer' | 'client';
};

interface UserFormProps {
  user?: UserFormData | null;
  onSubmit: (data: UserFormData) => void;
  onClose: () => void;
}

export function UserForm({ user, onSubmit, onClose }: UserFormProps) {
  const defaultValues = {
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    role: user?.role || 'client',
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues,
  });

  const handleFormSubmit = (data: UserFormData) => {
    onSubmit(data);
  };

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
              <option value="client">Client</option>
              <option value="trainer">Trainer</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
            {errors.role && (
              <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
            )}
          </div>

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
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              {user ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}