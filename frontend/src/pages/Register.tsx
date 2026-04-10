import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { auth, realtimeDb } from '../config/firebase';
import { Lock, Mail, ArrowRight, User, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const credential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      
      const saveUserData = set(ref(realtimeDb, `users/${credential.user.uid}`), {
        id: credential.user.uid,
        email: formData.email,
        name: formData.name,
        role: 'user',
        createdAt: new Date().toISOString(),
      });
      
      const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error('Database timeout')), 8000));
      
      try {
        await Promise.race([saveUserData, timeout]);
      } catch (err) {
        console.warn('Could not save user profile to database, but account was created', err);
      }

      toast.success('Account created! Please sign in.');
      navigate('/login');
    } catch (error: any) {
      const code = error?.code || '';
      if (code === 'auth/email-already-in-use') {
        toast.error('An account with this email already exists.');
      } else if (code === 'auth/operation-not-allowed' || code === 'auth/configuration-not-found') {
        toast.error('Sign-up is currently unavailable. Please contact the admin.');
      } else if (code === 'auth/weak-password') {
        toast.error('Password is too weak. Use at least 6 characters.');
      } else if (code === 'auth/invalid-email') {
        toast.error('Invalid email address.');
      } else {
        toast.error(error.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <img src="/logo.png" alt="SSX MOTORS Logo" className="h-14 w-auto object-contain dark:invert" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              SSX<span className="text-accent">MOTORS</span>
            </span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Create an Account
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Join us and start your journey
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field pl-10"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input-field pl-10"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="input-field pl-10"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="input-field pl-10"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-3 flex items-center justify-center space-x-2"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
            ) : (
              <>
                <span>Sign Up</span>
                <UserPlus className="h-5 w-5" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-accent font-medium hover:underline inline-flex items-center space-x-1">
            <span>Sign in</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
