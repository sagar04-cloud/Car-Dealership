import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import BookingService, { IBooking } from '../services/bookingService';
import CarService, { ICar } from '../services/carService';
import { Calendar, Clock, CheckCircle, Clock3, XCircle } from 'lucide-react';

const MyBookings: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [cars, setCars] = useState<Record<string, ICar>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !user?.email) {
      setLoading(false);
      return;
    }

    const unsubscribe = BookingService.subscribeToBookings({ email: user.email }, async ({ bookings }) => {
      setBookings(bookings);
      
      // Fetch car details for the bookings
      const carData: Record<string, ICar> = {};
      await Promise.all(
        bookings.map(async (booking) => {
          if (!carData[booking.carId]) {
            const car = await CarService.getCar(booking.carId);
            if (car) {
              carData[booking.carId] = car;
            }
          }
        })
      );
      setCars((prev) => ({ ...prev, ...carData }));
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, isAuthenticated]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold">
            <CheckCircle className="h-4 w-4" />
            <span>Accepted</span>
          </span>
        );
      case 'cancelled':
        return (
          <span className="flex items-center space-x-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-bold">
            <XCircle className="h-4 w-4" />
            <span>Cancelled</span>
          </span>
        );
      case 'completed':
        return (
          <span className="flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">
            <CheckCircle className="h-4 w-4" />
            <span>Completed</span>
          </span>
        );
      case 'pending':
      default:
        return (
          <span className="flex items-center space-x-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-bold">
            <Clock3 className="h-4 w-4" />
            <span>Pending</span>
          </span>
        );
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
        <div className="text-center font-bold text-gray-900 dark:text-white text-xl">Please sign in to view your bookings.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-8">My Test Drives</h1>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center shadow-premium">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">No Bookings Found</h2>
            <p className="text-slate-500 dark:text-slate-400">You haven't scheduled any test drives yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => {
              const car = cars[booking.carId];
              return (
                <div key={booking.id} className="bg-white dark:bg-slate-900 rounded-3xl shadow-premium overflow-hidden border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row">
                  {car && car.images && car.images.length > 0 && (
                    <div className="sm:w-48 h-48 sm:h-auto">
                      <img src={car.images[0]} alt={car.model} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        {car && <p className="text-xs font-bold text-accent uppercase tracking-widest mb-1">{car.brand}</p>}
                        <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white">
                          {car ? car.model : 'Loading Car Details...'}
                        </h3>
                      </div>
                      <div>
                        {getStatusBadge(booking.status)}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
                        <Calendar className="h-5 w-5 text-accent" />
                        <span className="font-medium">
                          {new Date(booking.date).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
                        <Clock className="h-5 w-5 text-accent" />
                        <span className="font-medium">{booking.time}</span>
                      </div>
                    </div>
                    
                    {booking.status === 'confirmed' && (
                      <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/30 rounded-xl text-green-800 dark:text-green-300 text-sm font-medium">
                        Your test drive has been accepted by the admin! Please arrive on time with your driver's license.
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
