import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowRight, Trash2 } from 'lucide-react';
import { useWishlist } from '../hooks/useWishlist';
import CarCard from '../components/cars/CarCard';

const Wishlist: React.FC = () => {
  const { wishlist, clearWishlist } = useWishlist();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto section-padding py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <Heart className="h-8 w-8 text-red-500" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Wishlist</h1>
          </div>
          {wishlist.length > 0 && (
            <button
              onClick={clearWishlist}
              className="flex items-center space-x-2 text-red-500 hover:text-red-600 transition-colors"
            >
              <Trash2 className="h-5 w-5" />
              <span>Clear All</span>
            </button>
          )}
        </div>

        {wishlist.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Browse our cars and add your favorites to the wishlist
            </p>
            <Link
              to="/cars"
              className="btn-primary inline-flex items-center space-x-2"
            >
              <span>Browse Cars</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {wishlist.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
