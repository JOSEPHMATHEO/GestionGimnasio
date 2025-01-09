import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';

// Enum de los días de la semana para el campo de 'schedule'
const daysOfWeek = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

const classSchema = z.object({
  name: z.string().min(2, 'Class name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  trainer: z.string().min(1, 'Trainer is required'),
  schedule: z.object({
    dayOfWeek: z.enum(daysOfWeek),
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
  trainer: string; // Este es el ObjectId del entrenador
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
  trainers: any[]; // Recibir lista de entrenadores
}

export function ClassForm({ classItem, onSubmit, onClose, trainers }: ClassFormProps) {
  const defaultValues = {
    name: classItem?.name || '',
    description: classItem?.description || '',
    trainer: classItem?.trainer || '', // Esto será el ObjectId del entrenador
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
      name: data.name,
      description: data.description,
      trainer: data.trainer,
      schedule: {
        dayOfWeek: data.schedule.dayOfWeek,
        startTime: String(data.schedule.startTime), // Asegúrate de enviar cadenas.
        endTime: String(data.schedule.endTime),
      },
      capacity: Number(data.capacity),
    };
    
    console.log("Datos enviados al backend:", formattedData);
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
            <select
              id="trainer"
              {...register('trainer')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">Seleccione un entrenador</option>
              {trainers.map((trainer) => (
                <option key={trainer._id} value={trainer._id}>
                  {trainer.firstName} {trainer.lastName}
                </option>
              ))}
            </select>
            {errors.trainer && (
              <p className="mt-1 text-sm text-red-600">{errors.trainer.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="schedule.dayOfWeek" className="block text-sm font-medium text-gray-700">
              Día de la semana
            </label>
            <select
              id="schedule.dayOfWeek"
              {...register('schedule.dayOfWeek')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              {daysOfWeek.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          </div>

          <div className="flex space-x-4">
            <div className="w-1/2">
              <label htmlFor="schedule.startTime" className="block text-sm font-medium text-gray-700">
                Hora de inicio
              </label>
              <input
                id="schedule.startTime"
                type="time"
                {...register('schedule.startTime')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div className="w-1/2">
              <label htmlFor="schedule.endTime" className="block text-sm font-medium text-gray-700">
                Hora de fin
              </label>
              <input
                id="schedule.endTime"
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
              {...register('capacity')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            {errors.capacity && (
              <p className="mt-1 text-sm text-red-600">{errors.capacity.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#333333] hover:bg-zinc-600"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
