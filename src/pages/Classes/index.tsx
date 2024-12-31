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
  const [trainers, setTrainers] = useState<any[]>([]); // Estado para entrenadores
  const [error, setError] = useState('');
  const { user: currentUser } = useAuthStore();

  useEffect(() => {
    fetchClasses();
    fetchTrainers(); // Llamar a la función para obtener los entrenadores
  }, []);

  const fetchClasses = async () => {
    try {
      setError('');
      console.log('Fetching classes...');
      const response = await api.get('/classes');
      console.log('Classes response:', response.data);
      setClasses(response.data);
    } catch (error) {
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      setError('Failed to load classes. Please try again later.');
    }
  };
  
  const fetchTrainers = async () => {
    try {
      const response = await api.get('/users'); // Obtener lista de usuarios
      setTrainers(response.data.filter((user: any) => user.role === 'trainer')); // Filtrar entrenadores
    } catch (error) {
      console.error('Error fetching trainers:', error);
    }
  };

  const handleEdit = (classItem) => {
    // Verificar que classItem tenga un _id válido antes de actualizar el estado
    if (classItem && classItem._id) {
      setSelectedClass(classItem);
      setIsFormOpen(true);
    } else {
      alert('Class ID is missing or undefined');
    }
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
      console.log('Datos a enviar:', classData);  // Verifica la estructura de classData
  
      // Si estamos actualizando una clase, enviamos el id
      if (selectedClass && selectedClass._id) {
        await api.put(`/classes/${selectedClass._id}`, classData);
      } else {
        // Si estamos creando una nueva clase, no enviamos el id
        await api.post('/classes', classData);
      }
  
      fetchClasses();
      handleFormClose();
    } catch (error) {
      if (error.response) {
        console.error('Error en la respuesta del servidor:', error.response);
        alert(`Error al guardar la clase: ${error.response.data.message || 'Error desconocido'}`);
      } else if (error.request) {
        console.error('No se recibió respuesta del servidor:', error.request);
        alert('No se pudo conectar al servidor.');
      } else {
        console.error('Error en la solicitud:', error.message);
        alert(`Error desconocido: ${error.message}`);
      }
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
          trainers={trainers} // Pasar la lista de entrenadores
        />
      )}
    </div>
  );
}