import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Dumbbell } from 'lucide-react';
import { useAuthStore } from '../stores/auth';

interface LoginForm {
  email: string;
  password: string;
}

export function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    try {
      await login(data.email, data.password);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-1 sm:mx-auto sm:w-full sm:max-w-md rounded-md">
        <div className="bg-neutral-800 py-8 px-4 shadow sm:rounded-[55px] sm:px-10">

          <div className="flex justify-center">
            <img src="src\img\logo.png" alt="logo" className="h-45 w-80"/>
          </div>
          <h2 className="mt-0 text-center text-2xl font-extrabold text-gray-50">
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
              <label htmlFor="email" className="block text-sm font-medium text-gray-50">
                Correo electrónico
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  type="email"
                  {...register('email', { required: true })}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">Escriba el correo</p>
                )}
              </div>
              
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-50">
                Contraseña
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  type="password"
                  {...register('password', { required: true })}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">Escriba la contraseña</p>
                )}
              </div>
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-900 bg-gray-200 focus:outline-none hover:bg-zinc-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Ingresar
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}
