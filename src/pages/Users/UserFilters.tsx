import React from 'react';
import { Search, Filter } from 'lucide-react';

interface UserFiltersProps {
  searchTerm: string;
  selectedRole: string;
  onSearchChange: (value: string) => void;
  onRoleChange: (value: string) => void;
  totalUsers: number;
  filteredCount: number;
}

export function UserFilters({
  searchTerm,
  selectedRole,
  onSearchChange,
  onRoleChange,
  totalUsers,
  filteredCount,
}: UserFiltersProps) {
  const roles = [
    { value: '', label: 'Todos los Roles' },
    { value: 'admin', label: 'Administradores' },
    { value: 'manager', label: 'Managers' },
    { value: 'trainer', label: 'Entrenadores' },
    { value: 'client', label: 'Clientes' },
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mx-48 justify-start">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Filtros</span>
          </div>
          <div className="text-sm text-gray-500">
            Mostrando {filteredCount} de {totalUsers} usuarios
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar por nombre o por email..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          {/* Role Filter */}
          <div>
            <select
              value={selectedRole}
              onChange={(e) => onRoleChange(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              {roles.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}