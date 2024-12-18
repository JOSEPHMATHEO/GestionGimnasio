import React, { useState } from 'react';
import { useAuthStore } from '../stores/auth';
import { Menu, X } from 'lucide-react'; // Iconos para abrir/cerrar el menú

export function Dashboard() {
  const { user } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Ejemplo de métricas (estos valores deberían venir de tu backend o estado global)
  const metrics = {
    totalClientes: 150,
    totalClases: 30,
    dineroGenerado: 5000,
    membresiasActivas: 120,
  };

  return (
    <div className="flex">
      {/* Botón para mostrar/ocultar el menú en pantallas pequeñas */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-50 bg-gray-800 text-white p-2 rounded-lg focus:outline-none"
      >
        {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Barra lateral izquierda */}
      <div
        className={`fixed z-40 inset-y-0 left-0 w-64 bg-zinc-800 text-white transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform md:translate-x-0 md:static h-screen p-4`}
      >
        <h2 className="text-xl font-semibold mb-6">Panel de Administración</h2>

        {/* Módulo de Usuarios */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold">Usuarios</h3>
        </div>

        {/* Módulo de Clases */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold">Clases</h3>
        </div>

        {/* Módulo de Membresías */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold">Membresías</h3>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 md:ml-20 p-6">
        <h1 className="text-2xl font-semibold text-gray-900">Bienvenido, {user?.firstName}!</h1>

        {/* Sección de métricas */}
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {/* Recuadro Total de Clientes */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-700">Total de Clientes</h3>
            <p className="text-3xl font-bold text-gray-900">{metrics.totalClientes}</p>
          </div>

          {/* Recuadro Clases */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-700">Total de Clases</h3>
            <p className="text-3xl font-bold text-gray-900">{metrics.totalClases}</p>
          </div>

          {/* Recuadro Dinero Generado */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-700">Dinero Generado</h3>
            <p className="text-3xl font-bold text-gray-900">${metrics.dineroGenerado}</p>
          </div>

          {/* Recuadro Membresías Activas */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-700">Membresías Activas</h3>
            <p className="text-3xl font-bold text-gray-900">{metrics.membresiasActivas}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
