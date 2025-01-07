import React, { useState, useEffect } from 'react';
import { BookingList } from './BookingList';
import { BookingForm } from './BookingForm';
import { useAuthStore } from '../../stores/auth';
import { Calendar } from 'lucide-react';
import api from '../../lib/axios';

export function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const { user: currentUser } = useAuthStore();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await api.get('/bookings');
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const handleEdit = (booking) => {
    setSelectedBooking(booking);
    setIsFormOpen(true);
  };

  const handleDelete = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await api.delete(`/bookings/${bookingId}`);
        fetchBookings();
      } catch (error) {
        console.error('Error canceling booking:', error);
      }
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedBooking(null);
  };

  const handleFormSubmit = async (bookingData) => {
    try {
      console.log('Datos enviados al backend:', bookingData);
  
      if (selectedBooking) {
        await api.put(`/bookings/${selectedBooking._id}`, bookingData);
      } else {
        const response = await api.post('/bookings', bookingData);
        console.log('Respuesta del servidor:', response.data);
      }
  
      fetchBookings();
      handleFormClose();
    } catch (error) {
      console.error('Error al guardar la reserva:', error.response?.data || error.message);
    }
  };
  
  

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Class Bookings</h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Calendar className="h-4 w-4 mr-2" />
          Book Class
        </button>
      </div>

      <BookingList
        bookings={bookings}
        onEdit={handleEdit}
        onDelete={handleDelete}
        currentUserRole={currentUser?.role}
        currentUserId={currentUser?.id}
      />

      {isFormOpen && (
        <BookingForm
          booking={selectedBooking}
          onSubmit={handleFormSubmit}
          onClose={handleFormClose}
        />
      )}
    </div>
  );
}