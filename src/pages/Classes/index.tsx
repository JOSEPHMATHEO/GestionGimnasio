import React, { useState, useEffect } from 'react';
import { ClassList } from './ClassList';
import { ClassForm } from './ClassForm';
import { useAuthStore } from '../../stores/auth';
import { Dumbbell, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../../lib/axios';

interface Class {
  id: string;
  name: string;
  description: string;
  trainer: {
    firstName: string;
    lastName: string;
  };
  schedule: {
    dayOfWeek: string;
    startTime: string;
    endTime: string;
  };
  capacity: number;
}

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export function Classes() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const { user: currentUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  });

  const fetchClasses = async (page = 1) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.get(`/classes?page=${page}&limit=${pagination.itemsPerPage}`);
      
      if (!response.data || !Array.isArray(response.data.classes)) {
        throw new Error('Invalid response format from server');
      }
      
      setClasses(response.data.classes);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching classes:', error);
      setError('Failed to load classes. Please try again later.');
      setClasses([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleEdit = (classItem: Class) => {
    setSelectedClass(classItem);
    setIsFormOpen(true);
  };

  const handleDelete = async (classId: string) => {
    if (window.confirm('Are you sure you want to delete this class?')) {
      try {
        await api.delete(`/classes/${classId}`);
        await fetchClasses(pagination.currentPage);
      } catch (error) {
        console.error('Error deleting class:', error);
        setError('Failed to delete class. Please try again.');
      }
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedClass(null);
  };

  const handleFormSubmit = async (classData: Omit<Class, 'id'>) => {
    try {
      if (selectedClass) {
        await api.put(`/classes/${selectedClass.id}`, classData);
      } else {
        await api.post('/classes', classData);
      }
      await fetchClasses(pagination.currentPage);
      handleFormClose();
    } catch (error) {
      console.error('Error saving class:', error);
      setError('Failed to save class. Please try again.');
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchClasses(newPage);
    }
  };

  const canManageClasses = ['admin', 'manager', 'trainer'].includes(currentUser?.role);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-extrabold text-gray-900 mx-24 my-8">Gestion de Clases</h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#333333] hover:bg-zinc-600 mx-24"
        >
          <Dumbbell className="h-4 w-4 mr-2" />
          Añadir Clase
        </button>
      </div>

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
          <ClassList
            classes={classes}
            onEdit={handleEdit}
            onDelete={handleDelete}
            currentUserRole={currentUser?.role || ''}
          />

          {/* Pagination Controls */}
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
        </>
      )}

      {isFormOpen && (
        <ClassForm
          classItem={selectedClass}
          onSubmit={handleFormSubmit}
          onClose={handleFormClose}
        />
      )}
    </div>
  );
}