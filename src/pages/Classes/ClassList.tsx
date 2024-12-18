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

export function ClassList({ classes, onEdit, onDelete, currentUserRole }: ClassListProps) {
  const canManageClass = ['admin', 'manager', 'trainer'].includes(currentUserRole);

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Class Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Trainer
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Schedule
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Capacity
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {classes.map((classItem) => (
            <tr key={classItem.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {classItem.name}
                </div>
                <div className="text-sm text-gray-500">{classItem.description}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {classItem.trainer.firstName} {classItem.trainer.lastName}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {classItem.schedule.dayOfWeek}
                </div>
                <div className="text-sm text-gray-500">
                  {classItem.schedule.startTime} - {classItem.schedule.endTime}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {classItem.capacity}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                {canManageClass && (
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => onEdit(classItem)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDelete(classItem.id)}
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