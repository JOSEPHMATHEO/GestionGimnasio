import React, { useEffect, useState } from 'react';
import { UseFormRegister } from 'react-hook-form';
import api from '../../lib/axios';

interface Membership {
  id: string;
  name: string;
  description: string;
  cost: number;
}

interface MembershipSelectProps {
  register: UseFormRegister<any>;
  error?: string;
}

export function MembershipSelect({ register, error }: MembershipSelectProps) {
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMemberships = async () => {
      try {
        const response = await api.get('/memberships');
        setMemberships(response.data);
      } catch (err) {
        console.error('Error fetching memberships:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMemberships();
  }, []);

  if (loading) {
    return <div>Cargando membresia...</div>;
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        Seleccione Membresia
      </label>
      <select
        {...register('membershipId')}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
      >
        <option value="">Selecciona una membresia</option>
        {memberships.map((membership) => (
          <option key={membership.id} value={membership.id}>
            {membership.name} - ${membership.cost}/mes
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      
      <div className="mt-4 space-y-4">
        {memberships.map((membership) => (
          <div key={membership.id} className="p-4 border rounded-lg">
            <h3 className="font-medium">{membership.name}</h3>
            <p className="text-sm text-gray-600">{membership.description}</p>
            <p className="mt-2 text-lg font-bold">${membership.cost}/mes</p>
          </div>
        ))}
      </div>
    </div>
  );
}