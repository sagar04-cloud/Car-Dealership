import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Heart, Sun, Moon, Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

const Navbar: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { isAdmin, logout, isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/cars?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Browse Cars', path: '/cars' },
    { name: 'Compare', path: '/compare' },
    { name: 'Wishlist', path: '/wishlist' },
  ];

  return (
    <header>
      <nav className="sticky top-0 z-50 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-[#0A0C10] dark:to-slate-900 border-b border-slate-200 dark:border-slate-700 transition-all duration-300" role="navigation" aria-label="Main navigation">
        <div className="max-w-7xl mx-auto section-padding">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 transition-transform hover:scale-105 duration-500" aria-label="DriveX Motors Home">
              <img src="/logo.png" alt="SSX MOTORS Logo" className="h-12 w-auto object-contain dark:invert" />
              <span className="text-2xl font-display font-black text-slate-900 dark:text-white tracking-tighter">
                SSX<span className="text-accent underline decoration-accent/30 underline-offset-4">MOTORS</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <ul className="hidden lg:flex items-center justify-center flex-1 gap-8" role="menubar">
              {navLinks.map((link) => (
                <li key={link.name} role="none">
                  <Link
                    to={link.path}
                    className="text-slate-600 dark:text-slate-300 hover:text-accent dark:hover:text-accent transition-all font-semibold text-sm tracking-tight relative group whitespace-nowrap"
                    role="menuitem"
                  >
                    {link.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-300" />
                  </Link>
                </li>
              ))}
            </ul>

            {/* Search & Actions */}
            <div className="flex items-center gap-3">
            <div className="hidden xl:block">
              <form onSubmit={handleSearch}>
                <div className="relative group">
                  <input
                    type="text"
                    placeholder="Search cars..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-56 pl-10 pr-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all duration-300 text-sm group-hover:border-accent/30"
                  />
                  <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2">
                    <Search className="h-4 w-4 text-slate-400 group-hover:text-accent transition-colors cursor-pointer" />
                  </button>
                </div>
              </form>
            </div>

            <div className="flex items-center gap-1 border-l border-slate-200 dark:border-slate-800 pl-3 ml-2">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500 dark:text-slate-400 active:scale-90"
                aria-label="Toggle theme"
              >
                {isDarkMode ? (
                  <Sun className="h-4 w-4 text-yellow-500" />
                ) : (
                  <Moon className="h-4 w-4 text-slate-600" />
                )}
              </button>

              <Link
                to="/wishlist"
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500 dark:text-slate-400 relative active:scale-90"
                aria-label="Wishlist"
              >
                <Heart className="h-4 w-4" />
              </Link>

              {isAuthenticated ? (
                <div className="flex items-center gap-4 ml-2">
                  <Link
                    to="/my-bookings"
                    className="hidden sm:flex text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-accent dark:hover:text-accent transition-colors"
                  >
                    My Bookings
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="hidden sm:flex px-5 py-2.5 text-sm font-bold text-white bg-slate-900 dark:bg-white dark:text-slate-900 rounded-xl hover:bg-accent dark:hover:bg-accent hover:text-white dark:hover:text-white transition-all shadow-premium"
                    >
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={() => logout()}
                    className="hidden lg:block text-slate-500 dark:text-slate-400 hover:text-red-500 font-bold text-xs uppercase tracking-widest transition-colors"
                  >
                    Exit
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="hidden sm:flex px-6 py-2.5 text-sm font-bold text-white bg-accent rounded-xl hover:bg-accent-hover transition-all shadow-premium hover:shadow-glow active:scale-95"
                >
                  Join Us
                </Link>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:hidden py-8 border-t border-slate-100 dark:border-slate-800 animate-slide-up"
          >
            <div className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-lg font-display font-bold text-slate-900 dark:text-white hover:text-accent transition-colors px-4"
                >
                  {link.name}
                </Link>
              ))}
              <form onSubmit={handleSearch} className="mt-4 px-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search collection..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                  />
                  <button type="submit" className="absolute left-4 top-1/2 -translate-y-1/2">
                    <Search className="h-5 w-5 text-slate-400 cursor-pointer" />
                  </button>
                </div>
              </form>
              
              <div className="flex flex-col gap-3 px-4 pt-6 mt-4 border-t border-slate-100 dark:border-slate-800">
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/my-bookings"
                      onClick={() => setIsMenuOpen(false)}
                      className="w-full py-4 text-center font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-2xl"
                    >
                      My Bookings
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setIsMenuOpen(false)}
                        className="w-full py-4 text-center font-bold text-white bg-slate-900 dark:bg-white dark:text-slate-900 rounded-2xl"
                      >
                        Control Center
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }}
                      className="w-full py-4 text-center font-bold text-red-500 border border-red-100 dark:border-red-900/30 rounded-2xl"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full py-4 text-center font-bold text-white bg-accent rounded-2xl shadow-glow"
                  >
                    Get Started
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
      </nav>
    </header>
  );
};

export default Navbar;
