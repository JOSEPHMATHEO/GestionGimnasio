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
          <p className="mt-2 text-sm text-gray-500">Cragando planes de membresia...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-1 sm:mx-auto sm:w-full sm:max-w-lg rounded-md">
        <div className="bg-neutral-800 py-8 px-4 shadow sm:rounded-[55px] sm:px-10">
  
          <div className="flex justify-center">
            <img src="src\\img\\logo.png" alt="logo" className="h-18 w-15"/>
          </div>
          <h2 className="mt-0 text-center text-1xl font-extrabold text-gray-50">
            Te damos la Bienvenida
          </h2>
          <p className="mt-1 text-center text-sm text-gray-50">
            ¿No tienes una cuenta?{' '}
            <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
              Crear una cuenta
            </Link>
          </p>
  
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="mt-6">
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-50">
                Nombre
              </label>
              <input
                {...register('firstName')}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
              )}
            </div>
  
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-50">
                Apellido
              </label>
              <input
                {...register('lastName')}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
              )}
            </div>
  
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-50">
                Correo electrónico
              </label>
              <input
                type="email"
                {...register('email')}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>
  
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-50">
                Contraseña
              </label>
              <input
                type="password"
                {...register('password')}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>
  
            <div>
              <label htmlFor="membershipId" className="block text-sm font-medium text-gray-50">
                Seleccione un Plan de Membresia
              </label>
              <select
                {...register('membershipId')}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Elija una membresia</option>
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
  
            <div className="mt-6 overflow-x-auto">
              <div className="flex space-x-4">
                {memberships.map((membership) => (
                  <div
                    key={membership.id} 
                    className="p-2 border border-gray-300 bg-indigo-100 rounded-md min-w-[230px] max-w-xs flex-shrink-2 text-gray-900"
                  >
                    <h4 className="font-medium text-lg">{membership.name}</h4>
                    <p className="text-sm text-gray-600">{membership.description}</p>
                    <p className="mt-1 font-bold">${membership.cost}/mes</p>
                  </div>
                ))}
              </div>
            </div>
  
            <div className="flex justify-center">
              <button
                type="submit"
                className="flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-900 bg-gray-200 focus:outline-none hover:bg-zinc-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Registrar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
  
}