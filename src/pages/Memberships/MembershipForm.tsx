import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';

const membershipSchema = z.object({
  name: z.string().min(2, 'El nombre debe contener 2 caracteres minimo'),
  description: z.string().min(10, 'La descripcion debe tener almenos 10 caracteres'),
  cost: z.preprocess(
    (value) => (value === '' ? 0 : Number(value)),
    z.number().min(0, 'El costo debe ser un valor positivo')
  ),
});

type MembershipFormData = {
  name: string;
  description: string;
  cost: number;
};

interface MembershipFormProps {
  membership?: MembershipFormData | null;
  onSubmit: (data: MembershipFormData) => void;
  onClose: () => void;
}

export function MembershipForm({ membership, onSubmit, onClose }: MembershipFormProps) {
  const defaultValues = {
    name: membership?.name || '',
    description: membership?.description || '',
    cost: membership?.cost || 0,
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MembershipFormData>({
    resolver: zodResolver(membershipSchema),
    defaultValues,
  });

  const handleFormSubmit = (data: MembershipFormData) => {
    const formattedData = {
      ...data,
      cost: Number(data.cost),
    };
    onSubmit(formattedData);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            {membership ? 'Edit Membership' : 'Add Membership'}
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
              Nombre de la Membresia
            </label>
            <input
              id="name"
              type="text"
              {...register('name')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="e.g., Premium Plan"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Descripcion
            </label>
            <textarea
              id="description"
              {...register('description')}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Describe the membership benefits..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="cost" className="block text-sm font-medium text-gray-700">
              Costo (USD)
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                id="cost"
                type="number"
                step="0.01"
                min="0"
                {...register('cost')}
                className="mt-1 block w-full pl-7 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="0.00"
              />
            </div>
            {errors.cost && (
              <p className="mt-1 text-sm text-red-600">{errors.cost.message}</p>
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
              {membership ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}