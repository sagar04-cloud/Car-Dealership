import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center px-4">
        <h1 className="text-9xl font-bold text-accent mb-4">404</h1>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Page Not Found</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist. It might have been moved or deleted.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/" className="btn-primary inline-flex items-center justify-center space-x-2">
            <Home className="h-5 w-5" />
            <span>Go Home</span>
          </Link>
          <Link to="/cars" className="btn-secondary inline-flex items-center justify-center space-x-2">
            <Search className="h-5 w-5" />
            <span>Browse Cars</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
