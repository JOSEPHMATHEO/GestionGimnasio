import React, { useState, useEffect } from 'react';
import { UserList } from './UserList';
import { UserForm } from './UserForm';
import { useAuthStore } from '../../stores/auth';
import { UserPlus } from 'lucide-react';
import api from '../../lib/axios';

export function Users() {
  const [users, setUsers] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const { user: currentUser } = useAuthStore();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsFormOpen(true);
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/users/${userId}`);
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedUser(null);
  };

  const handleFormSubmit = async (userData) => {
    try {
      if (selectedUser) {
        await api.put(`/users/${selectedUser.id}`, userData);
      } else {
        await api.post('/users', userData);
      }
      fetchUsers();
      handleFormClose();
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-extrabold text-gray-900 mx-24 my-8">Gestion de Usuarios</h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#333333] hover:bg-zinc-600 mx-24"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Añadir Usuario
        </button>
      </div>

      <UserList
        users={users}
        onEdit={handleEdit}
        onDelete={handleDelete}
        currentUserRole={currentUser?.role}
      />

      {isFormOpen && (
        <UserForm
          user={selectedUser}
          onSubmit={handleFormSubmit}
          onClose={handleFormClose}
        />
      )}
    </div>
  );
}