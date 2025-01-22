import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';

interface Class {
  id: string;
  name: string;
  description: string;
  trainer: {
    firstName: string;
    lastName: string;
  };
  schedule: {
    dayOfWeek: string;
    startTime: string;
    endTime: string;
  };
  capacity: number;
}

interface ClassListProps {
  classes: Class[];
  onEdit: (classItem: Class) => void;
  onDelete: (classId: string) => void;
  currentUserRole: string;
}

export function ClassList({ classes = [], onEdit, onDelete, currentUserRole }: ClassListProps) {
  const canManageClass = ['admin', 'manager', 'trainer'].includes(currentUserRole);

  if (!Array.isArray(classes)) {
    console.error('Classes prop is not an array:', classes);
    return (
      <div className="bg-white shadow-sm rounded-lg p-6 text-center">
        <p className="text-gray-500">Error loading classes. Please try again later.</p>
      </div>
    );
  }

  if (classes.length === 0) {
    return (
      <div className="bg-white shadow-sm rounded-lg p-6 text-center">
        <p className="text-gray-500">No classes available.</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden ring-1 ring-gray-200 mx-24 my-26">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 table-auto">

          <thead className="bg-[#333333] text-white">
            <tr>
              <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-left">
                Nombre de la Clase
              </th>
              <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-left">
                Entrenador
              </th>
              <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-left">
                Horario
              </th>
              <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-left">
                Capacidad
              </th>
              <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-left">
                Acciones
              </th>
            </tr>
          </thead>
          {/* Table Body */}
          <tbody className="bg-white divide-y divide-gray-200">
            {classes.map((classItem) => (
              <tr
                key={classItem.id}
                className="hover:bg-gray-100 transition duration-300 ease-in-out"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-base font-medium text-gray-900">
                    {classItem.name}
                  </div>
                  <div className="text-sm text-gray-500">{classItem.description}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-base text-gray-900">
                    {classItem.trainer.firstName} {classItem.trainer.lastName}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-base text-gray-900">
                    {classItem.schedule.dayOfWeek}
                  </div>
                  <div className="text-sm text-gray-500">
                    {classItem.schedule.startTime} - {classItem.schedule.endTime}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-base text-gray-900">
                  {classItem.capacity}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  {canManageClass && (
                    <div className="flex justify-normal space-x-4">
                      <button
                        onClick={() => onEdit(classItem)}
                        className="text-bg-[#333333] hover:text-indigo-900 transition duration-200 ease-in-out"
                      >
                        <Edit2 className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => onDelete(classItem._id)}
                        className="text-red-600 hover:text-red-800 transition duration-150"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );    
}