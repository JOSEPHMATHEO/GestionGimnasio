import React, { useState, useEffect } from 'react';
import { MembershipList } from './MembershipList';
import { MembershipForm } from './MembershipForm';
import { CreditCard } from 'lucide-react';
import api from '../../lib/axios';

interface Membership {
  id: string;
  name: string;
  description: string;
  cost: number;
}

interface MembershipFormData {
  name: string;
  description: string;
  cost: number;
}

export function Memberships() {
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedMembership, setSelectedMembership] = useState<Membership | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMemberships = async () => {
    try {
      setError(null);
      setIsLoading(true);
      const response = await api.get('/memberships');
      
      // Transformar los datos para asegurar que el id esté en el formato correcto
      const transformedMemberships = response.data.map((membership: any) => ({
        id: membership._id,
        name: membership.name,
        description: membership.description,
        cost: membership.cost
      }));
      
      setMemberships(transformedMemberships);
    } catch (error: any) {
      console.error('Error fetching memberships:', error);
      setError(error.response?.data?.message || 'Failed to load memberships');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMemberships();
  }, []);

  const handleEdit = (membership: Membership) => {
    console.log('Editando mebresia:', membership);
    setSelectedMembership(membership);
    setIsFormOpen(true);
  };

  const handleDelete = async (membershipId: string) => {
    const membership = memberships.find(m => m.id === membershipId);
    if (!membership) {
      setError('Membresia no encontrada');
      return;
    }

    if (window.confirm(`Esta seguro que desea eliminar la mebresia "${membership.name}"?`)) {
      try {
        setError(null);
        await api.delete(`/memberships/${membershipId}`);
        await fetchMemberships();
      } catch (error: any) {
        console.error('Error eliminado la membreisa:', error);
        setError(error.response?.data?.message || 'Fallo al eliminar membresia');
      }
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedMembership(null);
    setError(null);
  };

  const handleFormSubmit = async (formData: MembershipFormData) => {
    try {
      setError(null);
      if (selectedMembership) {
        await api.put(`/memberships/${selectedMembership.id}`, formData);
      } else {
        await api.post('/memberships', formData);
      }
      await fetchMemberships();
      handleFormClose();
    } catch (error: any) {
      console.error('Error saving membership:', error);
      setError(error.response?.data?.message || 'Failed to save membership');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-extrabold text-gray-900 mx-24 my-8">Gestion de Membresias</h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#333333] hover:bg-zinc-600 mx-24"
        >
          <CreditCard className="h-4 w-4 mr-2" />
          Añadir Membresia
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <MembershipList
          memberships={memberships}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {isFormOpen && (
        <MembershipForm
          membership={selectedMembership}
          onSubmit={handleFormSubmit}
          onClose={handleFormClose}
        />
      )}
    </div>
  );
}