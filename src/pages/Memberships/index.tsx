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

  const fetchMemberships = async () => {
    try {
      setError(null);
      const response = await api.get('/memberships');
      setMemberships(response.data);
    } catch (error) {
      console.error('Error fetching memberships:', error);
      setError('Failed to load memberships');
    }
  };

  useEffect(() => {
    fetchMemberships();
  }, []);

  const handleEdit = (membership: Membership) => {
    setSelectedMembership(membership);
    setIsFormOpen(true);
  };

  const handleDelete = async (membershipId: string) => {
    if (!membershipId) {
      setError('Invalid membership ID');
      return;
    }

    if (window.confirm('Are you sure you want to delete this membership?')) {
      try {
        setError(null);
        await api.delete(`/memberships/${membershipId}`);
        await fetchMemberships();
      } catch (error) {
        console.error('Error deleting membership:', error);
        setError('Failed to delete membership');
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
      if (selectedMembership?.id) {
        await api.put(`/memberships/${selectedMembership.id}`, formData);
      } else {
        await api.post('/memberships', formData);
      }
      await fetchMemberships();
      handleFormClose();
    } catch (error) {
      console.error('Error saving membership:', error);
      setError('Failed to save membership');
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

      <MembershipList
        memberships={memberships}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

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