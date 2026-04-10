import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';
// Pages
import Home from './pages/Home';
import CarListings from './pages/CarListings';
import CarDetail from './pages/CarDetail';
import Compare from './pages/Compare';
import Wishlist from './pages/Wishlist';
import MyBookings from './pages/MyBookings'; // User dashboard
import TestDrive from './pages/TestDrive';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/admin/AdminDashboard';
import CarManagement from './pages/admin/CarManagement';
import CarForm from './pages/admin/CarForm';
import AdminManagement from './pages/admin/AdminManagement';
import BookingsManagement from './pages/admin/BookingsManagement';
import NotFound from './pages/NotFound';
import Contact from './pages/Contact';
import SellCar from './pages/SellCar';
import InfoPage from './pages/InfoPage';
import Sitemap from './pages/Sitemap';

// Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ScrollToTop from './components/layout/ScrollToTop';

function App() {
  return (
    <HelmetProvider><ThemeProvider>
      <AuthProvider>
        <WishlistProvider>
          <Router>
            <ScrollToTop />
          <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                className: 'font-sans font-medium',
                style: {
                  background: 'white',
                  color: '#0f172a',
                  borderRadius: '12px',
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                  border: '1px solid #f1f5f9',
                  padding: '16px 24px',
                },
              }}
            />
            <Routes>
              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Admin Routes */}
              <Route path="/admin/login" element={<Login />} />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute adminOnly>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route
                path="/admin/cars"
                element={
                  <ProtectedRoute adminOnly>
                    <CarManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/cars/new"
                element={
                  <ProtectedRoute adminOnly>
                    <CarForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/cars/edit/:id"
                element={
                  <ProtectedRoute adminOnly>
                    <CarForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/admins"
                element={
                  <ProtectedRoute adminOnly>
                    <AdminManagement />
                  </ProtectedRoute>
                }
              />
              <Route 
                path="/admin/bookings" 
                element={
                  <ProtectedRoute adminOnly>
                    <BookingsManagement />
                  </ProtectedRoute>
                } 
              />
              
              {/* Public Routes */}
              <Route 
                path="/" 
                element={
                  <>
                    <Navbar />
                    <Home />
                    <Footer />
                  </>
                } 
              />
              <Route 
                path="/cars" 
                element={
                  <>
                    <Navbar />
                    <CarListings />
                    <Footer />
                  </>
                } 
              />
              <Route 
                path="/cars/:id" 
                element={
                  <>
                    <Navbar />
                    <CarDetail />
                    <Footer />
                  </>
                } 
              />
              <Route 
                path="/compare" 
                element={
                  <>
                    <Navbar />
                    <Compare />
                    <Footer />
                  </>
                } 
              />
              <Route 
                path="/wishlist" 
                element={
                  <>
                    <Navbar />
                    <Wishlist />
                    <Footer />
                  </>
                } 
              />
              <Route 
                path="/my-bookings" 
                element={
                  <>
                    <Navbar />
                    <MyBookings />
                    <Footer />
                  </>
                } 
              />
              <Route 
                path="/test-drive/:id" 
                element={
                  <>
                    <Navbar />
                    <TestDrive />
                    <Footer />
                  </>
                } 
              />
              <Route 
                path="/contact" 
                element={
                  <>
                    <Navbar />
                    <Contact />
                    <Footer />
                  </>
                } 
              />
              <Route 
                path="/sell" 
                element={
                  <>
                    <Navbar />
                    <SellCar />
                    <Footer />
                  </>
                } 
              />
              
              {/* Auxiliary Footer Routes */}
              {['/about', '/careers', '/press', '/blog', '/faq', '/terms', '/privacy'].map(path => (
                <Route
                  key={path}
                  path={path}
                  element={
                    <>
                      <Navbar />
                      <InfoPage />
                      <Footer />
                    </>
                  }
                />
              ))}
              
              {/* SEO Routes */}
              <Route path="/sitemap.xml" element={<Sitemap />} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </Router>
        </WishlistProvider>
      </AuthProvider>
    </ThemeProvider></HelmetProvider>
  );
}

export default App;
