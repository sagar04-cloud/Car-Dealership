import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Car as CarType } from '../types';
import CarCard from '../components/cars/CarCard';
import SearchFilter from '../components/search/SearchFilter';
import CarService from '../services/carService';
import SEO from '../components/seo/SEO';

const CarListings: React.FC = () => {
  const [cars, setCars] = useState<CarType[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0,
    limit: 12,
  });
  const location = useLocation();

  useEffect(() => {
    setLoading(true);
    const queryParams = new URLSearchParams(location.search);
    
    const filters: any = {};
    if (queryParams.get('brand')) filters.brand = queryParams.get('brand');
    if (queryParams.get('fuelType')) filters.fuelType = queryParams.get('fuelType');
    if (queryParams.get('transmission')) filters.transmission = queryParams.get('transmission');
    if (queryParams.get('year')) filters.year = queryParams.get('year');
    if (queryParams.get('minPrice')) filters.minPrice = queryParams.get('minPrice');
    if (queryParams.get('maxPrice')) filters.maxPrice = queryParams.get('maxPrice');
    if (queryParams.get('search')) filters.search = queryParams.get('search');
    if (queryParams.get('featured')) filters.featured = queryParams.get('featured') === 'true';
    
    const sortBy = queryParams.get('sortBy');
    let sort;
    if (sortBy) {
      switch (sortBy) {
        case 'price-asc': sort = { field: 'price', direction: 'asc' }; break;
        case 'price-desc': sort = { field: 'price', direction: 'desc' }; break;
        case 'year-desc': sort = { field: 'year', direction: 'desc' }; break;
        case 'year-asc': sort = { field: 'year', direction: 'asc' }; break;
      }
    }

    const unsubscribe = CarService.subscribeToCars(
      filters,
      sort,
      pagination.current,
      pagination.limit,
      ({ cars, total }) => {
        setCars(cars);
        setPagination(prev => ({
          ...prev,
          total,
          pages: Math.ceil(total / pagination.limit) || 1
        }));
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [location.search, pagination.current, pagination.limit]);

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, current: page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800">
      <SEO 
        title="Browse Cars - Complete Inventory | SSXMOTORS"
        description="Explore our complete inventory of new and used cars. Filter by brand, price, fuel type, and more. Find your perfect vehicle with detailed specs and photos."
        keywords="car inventory, buy cars online, car search, vehicle listings, auto dealership, used cars, new cars, car finder"
      />
      <div className="max-w-7xl mx-auto section-padding py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Browse All Cars
        </h1>

        <SearchFilter />

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
          </div>
        ) : (
          <>
            <div className="mt-8 flex justify-between items-center mb-4">
              <p className="text-gray-600 dark:text-gray-400">
                Showing {cars.length} of {pagination.total} cars
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {cars.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </motion.div>

            {pagination.pages > 1 && (
              <div className="mt-8 flex justify-center space-x-2">
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      page === pagination.current
                        ? 'bg-accent text-white'
                        : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CarListings;
