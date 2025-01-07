import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

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

interface BookingListProps {
  bookings: Booking[];
  onEdit: (booking: Booking) => void;
  onDelete: (bookingId: string) => void;
  currentUserRole: string;
  currentUserId: string;
}

export function BookingList({
  bookings,
  onEdit,
  onDelete,
  currentUserRole,
  currentUserId,
}: BookingListProps) {
  const canManageBooking = (booking: Booking) => {
    if (['admin', 'manager'].includes(currentUserRole)) return true;
    if (currentUserRole === 'trainer') return true;
    return booking.client.id === currentUserId;
  };
  return (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden ring-1 ring-gray-200 mx-12 my-14">
      <table className="min-w-full divide-y divide-gray-200 table-auto">
        <thead className="bg-indigo-600 text-white">
          <tr>
            <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-left">
              Class
            </th>
            <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-left">
              Client
            </th>
            <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-left">
              Date & Time
            </th>
            <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-left">
              Status
            </th>
            <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-right">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {bookings.map((booking) => (
            <tr key={booking.id} className="hover:bg-gray-50 transition duration-300 ease-in-out">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{booking.class.name}</div>
                <div className="text-xs text-gray-500">
                  {booking.class.schedule.dayOfWeek} {booking.class.schedule.startTime} - {booking.class.schedule.endTime}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {booking.client.firstName} {booking.client.lastName}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{format(new Date(booking.date), 'PPP')}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}
                >
                  {booking.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                {canManageBooking(booking) && (
                  <div className="flex justify-end space-x-4">
                    <button
                      onClick={() => onEdit(booking)}
                      className="text-indigo-600 hover:text-indigo-900 transition duration-200 ease-in-out"
                    >
                      <Edit2 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => onDelete(booking.id)}
                      className="text-red-600 hover:text-red-900 transition duration-200 ease-in-out"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};