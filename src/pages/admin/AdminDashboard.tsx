import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Shield, Calendar, TrendingUp, LogOut, Plus, List, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import CarService from '../../services/carService';
import BookingService from '../../services/bookingService';

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({
    totalCars: 0,
    availableCars: 0,
    soldCars: 0,
    totalBookings: 0,
    pendingBookings: 0,
  });
  const [recentBookings, setRecentBookings] = useState<any[]>([]);

  useEffect(() => {
    // Subscribe to real-time cars data
    const unsubscribeCars = CarService.subscribeToCars({}, null, 1, 1000, ({ cars, total }) => {
      setStats((prev) => ({
        ...prev,
        totalCars: total || 0,
        availableCars: cars.filter((c: any) => c.status === 'available').length,
        soldCars: cars.filter((c: any) => c.status === 'sold').length,
      }));
    });

    // Subscribe to real-time bookings data
    const unsubscribeBookings = BookingService.subscribeToBookings({}, ({ bookings, total }) => {
      setStats((prev) => ({
        ...prev,
        totalBookings: total || 0,
        pendingBookings: bookings.filter((b: any) => b.status === 'pending').length,
      }));
      setRecentBookings(bookings.slice(0, 5));
    });

    // Cleanup listeners on unmount
    return () => {
      unsubscribeCars();
      unsubscribeBookings();
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
  };

  const statCards = [
    { label: 'Total Cars', value: stats.totalCars, icon: Shield, color: 'bg-blue-500' },
    { label: 'Available', value: stats.availableCars, icon: TrendingUp, color: 'bg-green-500' },
    { label: 'Sold', value: stats.soldCars, icon: Shield, color: 'bg-red-500' },
    { label: 'Bookings', value: stats.totalBookings, icon: Calendar, color: 'bg-purple-500' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Admin Navbar */}
      <nav className="bg-white dark:bg-gray-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-4">
              <Shield className="h-8 w-8 text-accent" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">Admin Dashboard</span>
            </div>
            <div className="flex items-center space-x-2 md:space-x-4">
              <span className="hidden sm:inline text-gray-600 dark:text-gray-400 max-w-[150px] truncate">{user?.email}</span>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 md:space-x-2 text-red-500 hover:text-red-600 font-medium text-sm md:text-base"
              >
                <LogOut className="h-4 w-4 md:h-5 md:w-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Link
            to="/admin/cars"
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow flex items-center justify-between"
          >
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Manage Cars</h3>
              <p className="text-gray-500 dark:text-gray-400">Add, edit, or remove cars</p>
            </div>
            <List className="h-8 w-8 text-accent" />
          </Link>

          <Link
            to="/admin/cars"
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow flex items-center justify-between"
          >
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Add New Car</h3>
              <p className="text-gray-500 dark:text-gray-400">Create a new car listing</p>
            </div>
            <Plus className="h-8 w-8 text-green-500" />
          </Link>

          <Link
            to="/admin/bookings"
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow flex items-center justify-between"
          >
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">View Bookings</h3>
              <p className="text-gray-500 dark:text-gray-400">{stats.pendingBookings} pending bookings</p>
            </div>
            <Calendar className="h-8 w-8 text-purple-500" />
          </Link>

          <Link
            to="/admin/admins"
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow flex items-center justify-between"
          >
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Manage Admins</h3>
              <p className="text-gray-500 dark:text-gray-400">Add admins & change password</p>
            </div>
            <Shield className="h-8 w-8 text-blue-500" />
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat) => (
            <div key={stat.label} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 dark:text-gray-400">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Bookings */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Bookings</h3>
            <Link to="/admin/bookings" className="text-accent hover:text-accent-hover flex items-center">
              View All <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {recentBookings.length === 0 ? (
              <p className="px-6 py-4 text-gray-500 dark:text-gray-400">No bookings yet</p>
            ) : (
              recentBookings.map((booking: any) => (
                <div key={booking.id} className="px-6 py-4 flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{booking.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {booking.car?.brand} {booking.car?.model} - {new Date(booking.date).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                    booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {booking.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
