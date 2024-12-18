import React, { useState, useEffect } from 'react';
import { ClassList } from './ClassList';
import { ClassForm } from './ClassForm';
import { useAuthStore } from '../../stores/auth';
import { Dumbbell } from 'lucide-react';
import api from '../../lib/axios';

export function Classes() {
  const [classes, setClasses] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const { user: currentUser } = useAuthStore();

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await api.get('/classes');
      setClasses(response.data);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const handleEdit = (classItem) => {
    setSelectedClass(classItem);
    setIsFormOpen(true);
  };

  const handleDelete = async (classId) => {
    if (window.confirm('Are you sure you want to delete this class?')) {
      try {
        await api.delete(`/classes/${classId}`);
        fetchClasses();
      } catch (error) {
        console.error('Error deleting class:', error);
      }
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedClass(null);
  };

  const handleFormSubmit = async (classData) => {
    try {
      if (selectedClass) {
        await api.put(`/classes/${selectedClass.id}`, classData);
      } else {
        await api.post('/classes', classData);
      }
      fetchClasses();
      handleFormClose();
    } catch (error) {
      console.error('Error saving class:', error);
    }
  };

  const canManageClasses = ['admin', 'manager', 'trainer'].includes(currentUser?.role);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Class Management</h1>
        {canManageClasses && (
          <button
            onClick={() => setIsFormOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Dumbbell className="h-4 w-4 mr-2" />
            Add Class
          </button>
        )}
      </div>

      <ClassList
        classes={classes}
        onEdit={handleEdit}
        onDelete={handleDelete}
        currentUserRole={currentUser?.role}
      />

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