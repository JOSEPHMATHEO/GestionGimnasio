import React, { useState, useEffect, useMemo } from 'react';
import { UserList } from './UserList';
import { UserForm } from './UserForm';
import { UserFilters } from './UserFilters';
import { useAuthStore } from '../../stores/auth';
import { UserPlus } from 'lucide-react';
import api from '../../lib/axios';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { user: currentUser } = useAuthStore();
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.get('/users');
      console.log('Fetched users:', response.data); // Debug log
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to load users. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsFormOpen(true);
  };

  const handleDelete = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/users/${userId}`);
        await fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedUser(null);
  };

  const handleFormSubmit = async (userData: Omit<User, 'id'>) => {
    try {
      if (selectedUser) {
        await api.put(`/users/${selectedUser.id}`, userData);
      } else {
        await api.post('/users', userData);
      }
      await fetchUsers();
      handleFormClose();
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  // Filter users based on search term and selected role
  const filteredUsers = useMemo(() => {
    console.log('Filtering users:', { searchTerm, selectedRole, totalUsers: users.length }); // Debug log
    return users.filter((user) => {
      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
      const searchLower = searchTerm.toLowerCase();
      
      const matchesSearch = searchTerm === '' || 
        fullName.includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower);
        
      const matchesRole = selectedRole === '' || user.role === selectedRole;

      return matchesSearch && matchesRole;
    });
  }, [users, searchTerm, selectedRole]);

  const handleSearchChange = (value: string) => {
    console.log('Search term changed:', value); // Debug log
    setSearchTerm(value);
  };

  const handleRoleChange = (value: string) => {
    console.log('Role filter changed:', value); // Debug log
    setSelectedRole(value);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
        {error}
      </div>
    );
  }

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

      <UserFilters
        searchTerm={searchTerm}
        selectedRole={selectedRole}
        onSearchChange={handleSearchChange}
        onRoleChange={handleRoleChange}
        totalUsers={users.length}
        filteredCount={filteredUsers.length}
      />

      <UserList
        users={filteredUsers}
        onEdit={handleEdit}
        onDelete={handleDelete}
        currentUserRole={currentUser?.role || ''}
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