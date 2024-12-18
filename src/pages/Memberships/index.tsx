import React, { useState, useEffect } from 'react';
import { MembershipList } from './MembershipList';
import { MembershipForm } from './MembershipForm';
import { CreditCard } from 'lucide-react';
import api from '../../lib/axios';

type Membership = {
  id: string;
  name: string;
  description: string;
  cost: number;
};

export function Memberships() {
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedMembership, setSelectedMembership] = useState<Membership | null>(null);

  useEffect(() => {
    fetchMemberships();
  }, []);

  const fetchMemberships = async () => {
    try {
      const response = await api.get('/memberships');
      setMemberships(response.data);
    } catch (error) {
      console.error('Error fetching memberships:', error);
    }
  };

  const handleEdit = (membership: Membership) => {
    setSelectedMembership(membership);
    setIsFormOpen(true);
  };

  const handleDelete = async (membershipId: string) => {
    if (window.confirm('Are you sure you want to delete this membership?')) {
      try {
        await api.delete(`/memberships/${membershipId}`);
        fetchMemberships();
      } catch (error) {
        console.error('Error deleting membership:', error);
      }
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedMembership(null);
  };

  const handleFormSubmit = async (membershipData: Omit<Membership, 'id'>) => {
    try {
      if (selectedMembership) {
        await api.put(`/memberships/${selectedMembership.id}`, membershipData);
      } else {
        await api.post('/memberships', membershipData);
      }
      fetchMemberships();
      handleFormClose();
    } catch (error) {
      console.error('Error saving membership:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Membership Management</h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <CreditCard className="h-4 w-4 mr-2" />
          Add Membership
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