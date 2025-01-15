import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

interface UserListProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
  currentUserRole: string;
}

export function UserList({ users, onEdit, onDelete, currentUserRole }: UserListProps) {
  const canManageUser = (userRole: string) => {
    if (currentUserRole === 'admin') return true;
    if (currentUserRole === 'manager') {
      return ['trainer', 'client'].includes(userRole);
    }
    return false;
  };

  if (users.length === 0) {
    return (
      <div className="bg-white shadow-sm rounded-lg p-6 text-center">
        <p className="text-gray-500">No users found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden ring-1 ring-gray-200 mx-24 my-26">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-[#333333] text-white">
          <tr>
            <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-left">
              Nombre
            </th>
            <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-left">
              Email
            </th>
            <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-left">
              Rol
            </th>
            <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-left">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {user.firstName} {user.lastName}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">{user.email}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                    user.role === 'manager' ? 'bg-blue-100 text-blue-800' :
                    user.role === 'trainer' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </span>
                </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                {canManageUser(user.role) && (
                  <div className="flex justify-normal space-x-2">
                    <button
                      onClick={() => onEdit(user)}
                      className="text-bg-[#333333] hover:text-indigo-900 transition duration-200 ease-in-out"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDelete(user._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}