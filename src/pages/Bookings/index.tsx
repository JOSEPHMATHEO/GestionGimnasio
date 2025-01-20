import React, { useState, useEffect } from 'react';
import { BookingList } from './BookingList';
import { BookingForm } from './BookingForm';
import { useAuthStore } from '../../stores/auth';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../../lib/axios';

interface Booking {
  id: string;
  class: {
    name: string;
    schedule: {
      dayOfWeek: string;
      startTime: string;
      endTime: string;
    };
  };
  client: {
    firstName: string;
    lastName: string;
  };
  date: string;
  status: 'confirmed' | 'cancelled';
}

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export function Bookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const { user: currentUser } = useAuthStore();
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = async (page = 1) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.get(`/bookings?page=${page}&limit=${pagination.itemsPerPage}`);
      setBookings(response.data.bookings);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setError('Failed to load bookings. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handlePageChange = (newPage: number) => {
    fetchBookings(newPage);
  };

  const handleEdit = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsFormOpen(true);
  };

  const handleDelete = async (bookingId: string) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        await api.delete(`/bookings/${bookingId}`);
        await fetchBookings(pagination.currentPage);
      } catch (error) {
        console.error('Error deleting booking:', error);
      }
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedBooking(null);
  };

  const handleFormSubmit = async (bookingData: any) => {
    try {
      if (selectedBooking) {
        await api.put(`/bookings/${selectedBooking.id}`, bookingData);
      } else {
        await api.post('/bookings', bookingData);
      }
      await fetchBookings(pagination.currentPage);
      handleFormClose();
    } catch (error) {
      console.error('Error saving booking:', error);
    }
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
        bookings={bookings || []}
        onEdit={handleEdit}
        onDelete={handleDelete}
        currentUserRole={currentUser?.role || ''}
        currentUserId={currentUser?.id || ''}
      />

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <p className="text-sm text-gray-700">
          Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} to{' '}
          {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of{' '}
          {pagination.totalItems} results
        </p>
        <div className="flex space-x-2">
          <button
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </button>
          <button
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.totalPages}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

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