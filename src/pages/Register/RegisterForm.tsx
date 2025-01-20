import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { Dumbbell } from 'lucide-react';
import api from '../../lib/axios';

const registerSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  membershipId: z.string().min(1, 'Please select a membership plan'),
});

type RegisterForm = z.infer<typeof registerSchema>;

interface Membership {
  _id: string;
  name: string;
  description: string;
  cost: number;
}

export function RegisterForm() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>();

  useEffect(() => {
    const fetchMemberships = async () => {
      try {
        setError('');
        console.log('Fetching memberships...');
        const response = await api.get('/memberships');
        console.log('Memberships response:', response.data);
        setMemberships(response.data);
      } catch (err: any) {
        console.error('Membership fetch error:', err.message);
        setError('Failed to load membership plans. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMemberships();
  }, []);

  const onSubmit = async (data: RegisterForm) => {
    try {
      setError('');
      await api.post('/auth/register', {
        ...data,
        role: 'client'
      });
      navigate('/login', { 
        state: { message: 'Registration successful! Please login to continue.' }
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Dumbbell className="h-8 w-8 text-indigo-600 animate-spin mx-auto" />
          <p className="mt-2 text-sm text-gray-500">Loading membership plans...</p>
        </div>
      </div>
    );
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
          First Name
        </label>
        <input
          {...register('firstName')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.firstName && (
          <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
          Last Name
        </label>
        <input
          {...register('lastName')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.lastName && (
          <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email address
        </label>
        <input
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
          Password
        </label>
        <input
          type="password"
          {...register('password')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="membershipId" className="block text-sm font-medium text-gray-700">
          Select Membership Plan
        </label>
        <select
          {...register('membershipId')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="">Choose a membership plan</option>
          {memberships.map((membership) => (
            <option key={membership._id} value={membership._id}>
              {membership.name} - ${membership.cost}/month
            </option>
          ))}
        </select>
        {errors.membershipId && (
          <p className="mt-1 text-sm text-red-600">{errors.membershipId.message}</p>
        )}
      </div>

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

      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Register
      </button>
    </form>
  );
}