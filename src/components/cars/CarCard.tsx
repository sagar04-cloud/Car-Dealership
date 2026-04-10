import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Fuel, Settings, Calendar, ChevronRight } from 'lucide-react';
import { Car } from '../../types';
import { useWishlist } from '../../hooks/useWishlist';

interface CarCardProps {
  car: Car;
}

const CarCard: React.FC<CarCardProps> = ({ car }) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [imageError, setImageError] = useState(false);
  
  const inWishlist = isInWishlist(car.id!);
  
  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(car);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="card group overflow-hidden animate-fade-in h-full flex flex-col">
      {/* Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={imageError ? 'https://placehold.co/640x400?text=No+Image' : car.images[0]}
          alt={`${car.brand} ${car.model}`}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={() => setImageError(true)}
        />
        
        {/* Status Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {car.status === 'sold' ? (
            <div className="bg-red-500/90 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-lg">
              Sold Out
            </div>
          ) : car.featured ? (
            <div className="bg-accent/90 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-lg">
              Featured
            </div>
          ) : null}
        </div>
        
        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          className={`absolute top-4 right-4 p-2.5 rounded-full transition-all duration-500 backdrop-blur-md shadow-lg z-10 ${
            inWishlist 
              ? 'bg-red-500 text-white hover:scale-110' 
              : 'bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-300 hover:text-accent hover:bg-white'
          }`}
        >
          <Heart className={`h-4 w-4 ${inWishlist ? 'fill-current' : ''}`} />
        </button>
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end p-4">
           <Link
             to={`/cars/${car.id}`}
             className="w-full bg-white text-slate-900 py-3 rounded-xl font-bold text-sm text-center transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 hover:bg-accent hover:text-white flex items-center justify-center gap-2"
           >
             Explore Details
             <ChevronRight className="h-4 w-4" />
           </Link>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="mb-4">
          <p className="text-[10px] font-bold text-accent uppercase tracking-[0.2em] mb-1">{car.brand}</p>
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white group-hover:text-accent transition-colors">
              {car.model}
            </h3>
            <span className="text-lg font-display font-extrabold text-accent">
              {formatPrice(car.price)}
            </span>
          </div>
        </div>
        
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 line-clamp-2 leading-relaxed flex-grow">
          {car.description}
        </p>

        {/* Specs Grid */}
        <div className="grid grid-cols-3 gap-2 py-4 border-y border-slate-100 dark:border-slate-700/50 mb-6">
          <div className="flex flex-col items-center gap-1">
            <Calendar className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tighter">{car.year}</span>
          </div>
          <div className="flex flex-col items-center gap-1 border-x border-slate-100 dark:border-slate-700/50">
            <Fuel className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tighter">{car.fuelType}</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Settings className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tighter shrink-0 truncate max-w-full">{car.transmission}</span>
          </div>
        </div>

        {/* Full CTA */}
        <Link
          to={`/cars/${car.id}`}
          className={`w-full py-3.5 rounded-xl font-bold text-sm text-center transition-all duration-500 flex items-center justify-center gap-2 shadow-sm ${
            car.status === 'sold'
              ? 'bg-slate-100 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
              : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-accent dark:hover:bg-accent hover:text-white dark:hover:text-white'
          }`}
          onClick={(e) => car.status === 'sold' && e.preventDefault()}
        >
          {car.status === 'sold' ? 'Sold Out' : (
            <>
              View Collection
              <ChevronRight className="h-4 w-4" />
            </>
          )}
        </Link>
      </div>
    </div>
  );
};

export default CarCard;
