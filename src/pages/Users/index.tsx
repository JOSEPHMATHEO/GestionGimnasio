import React, { useState, useEffect } from 'react';
import { UserList } from './UserList';
import { UserForm } from './UserForm';
import { UserFilters } from './UserFilters';
import { useAuthStore } from '../../stores/auth';
import { UserPlus, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../../lib/axios';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  membership?: {
    name: string;
    cost: number;
  };
}

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

interface ApiResponse {
  users: User[];
  pagination: PaginationData;
}

export function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { user: currentUser } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  });

  const fetchUsers = async (page = 1) => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('Fetching users for page:', page);
      
      const response = await api.get<ApiResponse>('/users', {
        params: {
          page,
          limit: pagination.itemsPerPage,
          ...(searchTerm && { search: searchTerm }),
          ...(selectedRole && { role: selectedRole })
        }
      });

      console.log('Response from server:', response.data);

      if (!response.data || !response.data.users) {
        throw new Error('Invalid response format from server');
      }

      setUsers(response.data.users);
      setPagination(response.data.pagination);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      setError(error.response?.data?.message || 'Failed to load users');
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(1);
  }, [searchTerm, selectedRole]);

  const handleEdit = (user: User) => {
    console.log('Editing user:', user);
    setSelectedUser(user);
    setIsFormOpen(true);
  };

  const handleDelete = async (userId: string) => {
    setError(null); // Clear any previous errors

    if (!userId) {
      setError('Invalid user ID');
      return;
    }

    // Find the user to show their name in the confirmation
    const userToDelete = users.find(u => u.id === userId);
    if (!userToDelete) {
      setError('User not found');
      return;
    }

    const confirmMessage = `Are you sure you want to delete ${userToDelete.firstName} ${userToDelete.lastName}?`;
    
    if (window.confirm(confirmMessage)) {
      try {
        console.log('Deleting user with ID:', userId);
        await api.delete(`/users/${userId}`);
        console.log('User deleted successfully');
        await fetchUsers(pagination.currentPage);
        // Clear any error if deletion was successful
        setError(null);
      } catch (error: any) {
        console.error('Error deleting user:', error);
        setError(error.response?.data?.message || 'Failed to delete user');
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
      await fetchUsers(pagination.currentPage);
      handleFormClose();
    } catch (error: any) {
      console.error('Error saving user:', error);
      setError(error.response?.data?.message || 'Failed to save user');
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchUsers(newPage);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-extrabold text-gray-900 mx-24 my-8">User Management</h1>
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
        onSearchChange={setSearchTerm}
        onRoleChange={setSelectedRole}
        totalUsers={pagination.totalItems}
        filteredCount={users.length}
      />

      {isLoading ? (
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      ) : (
        <>
          <UserList
            users={users}
            onEdit={handleEdit}
            onDelete={handleDelete}
            currentUserRole={currentUser?.role || ''}
          />

          {users.length > 0 && (
            <div className="flex justify-between items-center mt-4 mx-20 p-4">
              <p className="text-sm text-gray-700">
                Mostrando {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} desde{' '}
                {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} de{' '}
                {pagination.totalItems} resultados
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Anterior
                </button>
                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Siguiente
                  <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

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