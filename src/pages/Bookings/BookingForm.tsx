import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import api from '../../lib/axios';

const bookingSchema = z.object({
  classId: z.string().min(1, 'Class is required'),
  date: z.string().min(1, 'Date is required'),
  status: z.enum(['confirmed', 'cancelled']).optional(),
});

type BookingFormData = {
  classId: string;
  date: string;
  status?: 'confirmed' | 'cancelled';
};

interface ClassOption {
  id: string;
  name: string;
  schedule: {
    dayOfWeek: string;
    startTime: string;
    endTime: string;
  };
  trainer: {
    firstName: string;
    lastName: string;
  };
}

interface BookingFormProps {
  booking?: BookingFormData | null;
  onSubmit: (data: BookingFormData) => void;
  onClose: () => void;
}

export function BookingForm({ booking, onSubmit, onClose }: BookingFormProps) {
  const [classes, setClasses] = useState<ClassOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const defaultValues = {
    classId: booking?.classId || '',
    date: booking?.date || '',
    status: booking?.status || 'confirmed',
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues,
  });

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await api.get('/classes');
        
        if (!response.data || !Array.isArray(response.data.classes)) {
          throw new Error('Invalid response format from server');
        }
        
        setClasses(response.data.classes);
      } catch (error) {
        console.error('Error fetching classes:', error);
        setError('Failed to load classes. Please try again later.');
        setClasses([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchClasses();
  }, []);

  const handleFormSubmit = (data: BookingFormData) => {
    onSubmit(data);
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
        <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            {booking ? 'Edit Booking' : 'Book a Class'}
          </h3>
          <button
            onClick={onClose}
            type="button"
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div>
            <label htmlFor="classId" className="block text-sm font-medium text-gray-700">
              Class
            </label>
            <select
              id="classId"
              {...register('classId')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">Select a class</option>
              {classes.map((classOption) => (
                <option key={classOption.id} value={classOption.id}>
                  {classOption.name} - {classOption.schedule.dayOfWeek} {classOption.schedule.startTime} - {classOption.trainer.firstName} {classOption.trainer.lastName}
                </option>
              ))}
            </select>
            {errors.classId && (
              <p className="mt-1 text-sm text-red-600">{errors.classId.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
              Date
            </label>
            <input
              id="date"
              type="date"
              {...register('date')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            {errors.date && (
              <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
            )}
          </div>

          {booking && (
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                id="status"
                {...register('status')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              {booking ? 'Update' : 'Book'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}