import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft, Trash2, Check, X } from 'lucide-react';
import { useWishlist } from '../hooks/useWishlist';

const Compare: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { wishlist, removeFromWishlist } = useWishlist();
  
  // Get car IDs from URL or use wishlist
  const compareIds = searchParams.get('cars')?.split(',') || [];
  const carsToCompare = compareIds.length > 0 
    ? wishlist.filter(car => compareIds.includes(car.id!))
    : wishlist.slice(0, 3);

  const specs = [
    { label: 'Brand', key: 'brand' },
    { label: 'Model', key: 'model' },
    { label: 'Year', key: 'year' },
    { label: 'Price', key: 'price', format: (v: number) => `$${v.toLocaleString()}` },
    { label: 'Fuel Type', key: 'fuelType' },
    { label: 'Transmission', key: 'transmission' },
    { label: 'Mileage', key: 'mileage', format: (v: number) => `${v.toLocaleString()} miles` },
    { label: 'Seating', key: 'seatingCapacity', format: (v: number) => `${v} seats` },
    { label: 'Color', key: 'color' },
    { label: 'Engine', key: 'engineCapacity' },
    { label: 'Status', key: 'status' },
  ];

  if (carsToCompare.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">No cars to compare</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Add cars to your wishlist to compare them</p>
          <Link to="/cars" className="btn-primary">Browse Cars</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto section-padding py-8">
        <div className="flex items-center space-x-4 mb-8">
          <Link 
            to="/wishlist" 
            className="flex items-center space-x-2 text-slate-500 dark:text-slate-400 hover:text-accent transition-all group"
          >
            <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-semibold text-sm">Return to Wishlist</span>
          </Link>
        </div>

        <h1 className="text-4xl font-display font-bold text-slate-900 dark:text-white mb-8 tracking-tight">
          Compare <span className="italic font-light">Models</span>
        </h1>

        <div className="overflow-x-auto no-scrollbar rounded-3xl shadow-premium border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800">
                <th className="p-8 text-xs font-bold uppercase tracking-widest text-slate-400 border-r border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">Specifications</th>
                {carsToCompare.map((car) => (
                  <th key={car.id} className="p-8 text-center min-w-[280px]">
                    <div className="relative group mb-6 overflow-hidden rounded-2xl aspect-video">
                      <img
                        src={car.images && car.images.length > 0 ? car.images[0] : 'https://placehold.co/400x300?text=No+Image'}
                        alt={`${car.brand} ${car.model}`}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>
                    <div className="mb-4">
                      <p className="text-[10px] font-bold text-accent uppercase tracking-[0.2em] mb-1">{car.brand}</p>
                      <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white">{car.model}</h3>
                    </div>
                    <button
                      onClick={() => removeFromWishlist(car.id!)}
                      className="text-slate-400 hover:text-red-500 text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 mx-auto"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Remove</span>
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {specs.map((spec) => (
                <tr key={spec.key} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="p-6 pl-8 font-bold text-xs uppercase tracking-widest text-slate-500 border-r border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/30">
                    {spec.label}
                  </td>
                  {carsToCompare.map((car: any) => (
                    <td key={car.id} className="p-6 text-center font-display font-bold text-slate-900 dark:text-white text-lg">
                      {spec.format && car[spec.key] !== undefined 
                        ? spec.format(car[spec.key]) 
                        : (car[spec.key] || 'N/A')}
                    </td>
                  ))}
                </tr>
              ))}
              <tr>
                <td className="p-6 pl-8 font-bold text-xs uppercase tracking-widest text-slate-500 border-r border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/30">
                  Key Features
                </td>
                {carsToCompare.map((car) => (
                  <td key={car.id} className="p-6">
                    <div className="flex flex-wrap gap-2 justify-center">
                      {(car.features || []).slice(0, 4).map((feature: string, idx: number) => (
                        <span key={idx} className="text-[10px] font-bold px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full border border-slate-200 dark:border-slate-700">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>
              <tr className="bg-slate-50/50 dark:bg-slate-800/50">
                <td className="p-6 border-r border-slate-100 dark:border-slate-800"></td>
                {carsToCompare.map((car) => (
                  <td key={car.id} className="p-8">
                    <Link
                      to={`/cars/${car.id}`}
                      className="btn-primary w-full text-sm font-bold uppercase tracking-widest"
                    >
                      View Showroom
                    </Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Compare;
