import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Calendar, Clock, User, Mail, Phone, ChevronLeft } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Car } from '../types';
import CarService from '../services/carService';
import BookingService from '../services/bookingService';

const timeSlots = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM',
  '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM',
];

const TestDrive: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: null as Date | null,
    time: '',
    notes: '',
  });

  useEffect(() => {
    if (id) {
      fetchCar();
    }
  }, [id]);

  const fetchCar = async () => {
    try {
      const carData = await CarService.getCar(id!);
      setCar(carData);
    } catch (error) {
      toast.error('Failed to load car details');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.date || !formData.time) {
      toast.error('Please select date and time');
      return;
    }

    setSubmitting(true);
    try {
      await BookingService.createBooking({
        carId: id!,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        date: formData.date,
        time: formData.time,
        notes: formData.notes,
        status: 'pending'
      });
      toast.success('Test drive booked successfully!');
      navigate('/');
    } catch (error) {
      toast.error('Failed to book test drive');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Car not found</h2>
          <Link to="/cars" className="btn-primary">Browse Cars</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto section-padding py-8">
        <button
          onClick={() => navigate(`/cars/${car.id}`)}
          className="flex items-center space-x-2 text-slate-500 dark:text-slate-400 hover:text-accent transition-all mb-8 group"
        >
          <ChevronLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-semibold text-sm">Return to Details</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Car Summary */}
          <div>
            <span className="text-accent font-bold uppercase tracking-[0.2em] text-[10px] md:text-xs mb-3 block">Reservation</span>
            <h1 className="text-4xl font-display font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
              Book Your <span className="italic font-light">Experience</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mb-10 leading-relaxed font-light">
              Schedule a personalized test drive for the {car.brand} {car.model} and feel the performance firsthand.
            </p>

            <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-premium border border-slate-100 dark:border-slate-700/50">
              <div className="relative group mb-6 overflow-hidden rounded-2xl aspect-video">
                <img
                  src={car.images && car.images.length > 0 ? car.images[0] : 'https://placehold.co/600x400?text=No+Image'}
                  alt={`${car.brand} ${car.model}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[10px] font-bold text-accent uppercase tracking-[0.2em] mb-1">{car.brand}</p>
                  <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white">
                    {car.model}
                  </h2>
                </div>
                <p className="text-2xl font-display font-extrabold text-accent">
                  ${car.price.toLocaleString()}
                </p>
              </div>
              
              <div className="mt-8 grid grid-cols-3 gap-6 pt-6 border-t border-slate-100 dark:border-slate-700/50">
                <div className="text-center">
                  <p className="text-lg font-display font-bold text-slate-900 dark:text-white">{car.year}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Model Year</p>
                </div>
                <div className="text-center border-x border-slate-100 dark:border-slate-700/50">
                  <p className="text-lg font-display font-bold text-slate-900 dark:text-white">{car.fuelType}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Drivetrain</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-display font-bold text-slate-900 dark:text-white truncate px-2">{car.transmission}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Shifting</p>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-premium p-8 md:p-12 border border-slate-100 dark:border-slate-800 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl -mr-16 -mt-16" />
            
            <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-8 relative z-10">
              Your Selection
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <User className="inline h-4 w-4 mr-1" />
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  minLength={3}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Mail className="inline h-4 w-4 mr-1" />
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input-field"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Phone className="inline h-4 w-4 mr-1" />
                  Phone
                </label>
                <input
                  type="tel"
                  required
                  pattern="[0-9]{10,15}"
                  title="Phone number must be between 10 and 15 digits"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="input-field"
                  placeholder="Enter your phone number (e.g. 1234567890)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Calendar className="inline h-4 w-4 mr-1" />
                  Preferred Date
                </label>
                <DatePicker
                  selected={formData.date}
                  onChange={(date) => setFormData({ ...formData, date })}
                  minDate={new Date()}
                  className="input-field"
                  placeholderText="Select a date"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Clock className="inline h-4 w-4 mr-1" />
                  Preferred Time
                </label>
                <select
                  required
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="input-field"
                >
                  <option value="">Select time slot</option>
                  {timeSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Additional Notes (Optional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="input-field"
                  rows={3}
                  placeholder="Any special requests or questions..."
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full btn-primary py-4 flex items-center justify-center"
              >
                {submitting ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                ) : (
                  'Book Test Drive'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestDrive;
