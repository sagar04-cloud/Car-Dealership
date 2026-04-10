import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';

const SearchFilter: React.FC = () => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    brand: '',
    minPrice: '',
    maxPrice: '',
    fuelType: '',
    transmission: '',
    year: '',
  });

  const brands = ['Toyota', 'Honda', 'BMW', 'Mercedes', 'Audi', 'Tesla', 'Ford', 'Hyundai', 'Kia', 'Nissan'];
  const fuelTypes = ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG'];
  const transmissions = ['Manual', 'Automatic'];
  const years = Array.from({ length: 15 }, (_, i) => (new Date().getFullYear() - i).toString());

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    navigate(`/cars?${params.toString()}`);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      brand: '',
      minPrice: '',
      maxPrice: '',
      fuelType: '',
      transmission: '',
      year: '',
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <form onSubmit={handleSubmit}>
        {/* Main Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              name="search"
              placeholder="Search by brand, model, or keyword..."
              value={filters.search}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center justify-center space-x-2 px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <SlidersHorizontal className="h-5 w-5" />
            <span>Filters</span>
          </button>
          <button
            type="submit"
            className="btn-primary flex items-center justify-center space-x-2"
          >
            <Search className="h-5 w-5" />
            <span>Search</span>
          </button>
        </div>

        {/* Expanded Filters */}
        {isExpanded && (
          <div className="border-t border-slate-100 dark:border-slate-800 pt-6 mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Brand
                </label>
                <select
                  name="brand"
                  value={filters.brand}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="">All Brands</option>
                  {brands.map((brand) => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Fuel Type
                </label>
                <select
                  name="fuelType"
                  value={filters.fuelType}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="">All Types</option>
                  {fuelTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Transmission
                </label>
                <select
                  name="transmission"
                  value={filters.transmission}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="">All Transmissions</option>
                  {transmissions.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Year
                </label>
                <select
                  name="year"
                  value={filters.year}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="">All Years</option>
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Min Price
                </label>
                <input
                  type="number"
                  name="minPrice"
                  placeholder="e.g. 10000"
                  value={filters.minPrice}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Max Price
                </label>
                <input
                  type="number"
                  name="maxPrice"
                  placeholder="e.g. 50000"
                  value={filters.maxPrice}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={clearFilters}
                className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                <X className="h-4 w-4" />
                <span>Clear all filters</span>
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default SearchFilter;
