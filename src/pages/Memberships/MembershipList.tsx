import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';

interface Membership {
  id: string;
  name: string;
  description: string;
  cost: number;
}

interface MembershipListProps {
  memberships: Membership[];
  onEdit: (membership: Membership) => void;
  onDelete: (membershipId: string) => void;
}

export function MembershipList({ memberships, onEdit, onDelete }: MembershipListProps) {
  return (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden ring-1 ring-gray-200 mx-24 my-26">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-[#333333] text-white">
          <tr>
            <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-left">
              Nombre
            </th>
            <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-left">
              Descripción
            </th>
            <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-left">
              Costo
            </th>
            <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-left">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {memberships.map((membership) => (
            <tr key={membership.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {membership.name}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-500">{membership.description}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  ${membership.cost.toFixed(2)}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-normal space-x-2">
                  <button
                    onClick={() => onEdit(membership)}
                    className="text-bg-[#333333] hover:text-indigo-900 transition duration-200 ease-in-out"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDelete(membership.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}