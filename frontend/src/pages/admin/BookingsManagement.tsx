import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft, Check, X, Calendar, Clock, User, Mail, Phone, Filter } from 'lucide-react';
import BookingService from '../../services/bookingService';

interface Booking {
  id: string;
  carId: string;
  name: string;
  email: string;
  phone: string;
  date: Date;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  createdAt: Date;
}

const BookingsManagement: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    const filters = statusFilter !== 'all' ? { status: statusFilter } : undefined;
    
    const unsubscribe = BookingService.subscribeToBookings(filters, ({ bookings }) => {
      setBookings(bookings as Booking[]);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [statusFilter]);

  const handleStatusChange = async (id: string, newStatus: Booking['status']) => {
    try {
      await BookingService.updateBookingStatus(id, newStatus);
      toast.success(`Booking ${newStatus}`);
      // Snapshot listener updates the UI automatically
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this booking?')) return;
    
    try {
      await BookingService.deleteBooking(id);
      toast.success('Booking deleted');
      // Snapshot listener updates the UI automatically
    } catch (error) {
      toast.error('Failed to delete booking');
    }
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    completed: 'bg-gray-100 text-gray-800',
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/admin')}
            className="flex items-center text-gray-600 dark:text-gray-400 hover:text-accent"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Test Drive Bookings</h1>
              
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="input-field"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {bookings.length === 0 ? (
                <p className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                  No bookings found
                </p>
              ) : (
                bookings.map((booking) => (
                  <div key={booking.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Booking for Test Drive
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[booking.status]}`}>
                            {booking.status}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4" />
                            <span>{booking.name}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Mail className="h-4 w-4" />
                            <span>{booking.email}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Phone className="h-4 w-4" />
                            <span>{booking.phone}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(booking.date).toLocaleDateString()} at {booking.time}</span>
                          </div>
                        </div>
                        
                        {booking.notes && (
                          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            <span className="font-medium">Notes:</span> {booking.notes}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {booking.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleStatusChange(booking.id, 'confirmed')}
                              className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
                            >
                              <Check className="h-4 w-4" />
                              <span>Confirm</span>
                            </button>
                            <button
                              onClick={() => handleStatusChange(booking.id, 'cancelled')}
                              className="flex items-center space-x-1 px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                            >
                              <X className="h-4 w-4" />
                              <span>Cancel</span>
                            </button>
                          </>
                        )}
                        {booking.status === 'confirmed' && (
                          <button
                            onClick={() => handleStatusChange(booking.id, 'completed')}
                            className="flex items-center space-x-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                          >
                            <Check className="h-4 w-4" />
                            <span>Complete</span>
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(booking.id)}
                          className="px-3 py-1 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingsManagement;
