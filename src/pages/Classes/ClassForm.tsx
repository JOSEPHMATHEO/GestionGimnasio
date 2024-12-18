import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';

const classSchema = z.object({
  name: z.string().min(2, 'Class name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  trainer: z.string().min(1, 'Trainer is required'),
  schedule: z.object({
    dayOfWeek: z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']),
    startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
    endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
  }),
  capacity: z.preprocess(
    (value) => (value === '' ? 0 : Number(value)),
    z.number().min(1, 'Capacity must be at least 1')
  ),
});

type ClassFormData = {
  name: string;
  description: string;
  trainer: string;
  schedule: {
    dayOfWeek: string;
    startTime: string;
    endTime: string;
  };
  capacity: number;
};

interface ClassFormProps {
  classItem?: ClassFormData | null;
  onSubmit: (data: ClassFormData) => void;
  onClose: () => void;
}

export function ClassForm({ classItem, onSubmit, onClose }: ClassFormProps) {
  const defaultValues = {
    name: classItem?.name || '',
    description: classItem?.description || '',
    trainer: classItem?.trainer || '',
    schedule: {
      dayOfWeek: classItem?.schedule?.dayOfWeek || 'Monday',
      startTime: classItem?.schedule?.startTime || '09:00',
      endTime: classItem?.schedule?.endTime || '10:00',
    },
    capacity: classItem?.capacity || 1,
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClassFormData>({
    resolver: zodResolver(classSchema),
    defaultValues,
  });

  const handleFormSubmit = (data: ClassFormData) => {
    const formattedData = {
      ...data,
      capacity: Number(data.capacity),
    };
  
    console.log('Data being submitted:', formattedData);
    onSubmit(formattedData);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            {classItem ? 'Edit Class' : 'Add Class'}
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
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Nombre de la Clase
            </label>
            <input
              id="name"
              type="text"
              {...register('name')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Descripción
            </label>
            <textarea
              id="description"
              {...register('description')}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="trainer" className="block text-sm font-medium text-gray-700">
              Entrenador
            </label>
            <input
              id="trainer"
              type="text"
              {...register('trainer')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            {errors.trainer && (
              <p className="mt-1 text-sm text-red-600">{errors.trainer.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="dayOfWeek" className="block text-sm font-medium text-gray-700">
              Día de la semana
            </label>
            <select
              id="dayOfWeek"
              {...register('schedule.dayOfWeek')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
                Hora de Inicio
              </label>
              <input
                id="startTime"
                type="time"
                {...register('schedule.startTime')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">
                Hora de Fin
              </label>
              <input
                id="endTime"
                type="time"
                {...register('schedule.endTime')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">
              Capacidad
            </label>
            <input
              id="capacity"
              type="number"
              min="1"
              {...register('capacity')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            {errors.capacity && (
              <p className="mt-1 text-sm text-red-600">{errors.capacity.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              {classItem ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}