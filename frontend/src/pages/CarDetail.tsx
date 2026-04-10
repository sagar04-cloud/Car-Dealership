import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ChevronLeft, ChevronRight, Fuel, Settings, Calendar, Users, Heart, Share2, Check } from 'lucide-react';
import { Car as CarType } from '../types';
import { useWishlist } from '../hooks/useWishlist';
import EMICalculator from '../components/cars/EMICalculator';
import CarService from '../services/carService';
import SEO from '../components/seo/SEO';

const CarDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [car, setCar] = useState<CarType | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);
  const { isInWishlist, toggleWishlist } = useWishlist();

  const fetchCar = React.useCallback(async () => {
    try {
      const carData = await CarService.getCar(id!);
      setCar(carData);
    } catch (error) {
      toast.error('Failed to load car details');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchCar();
    }
  }, [id, fetchCar]);

  const nextImage = () => {
    if (car && car.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % car.images.length);
    }
  };

  const prevImage = () => {
    if (car && car.images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + car.images.length) % car.images.length);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
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

  // Generate structured data for the car
  const carStructuredData = car ? [{
    "@context": "https://schema.org",
    "@type": "Vehicle",
    "name": `${car.year} ${car.brand} ${car.model}`,
    "description": car.description,
    "brand": {
      "@type": "Brand",
      "name": car.brand
    },
    "model": car.model,
    "year": car.year,
    "vehicleConfiguration": car.transmission,
    "fuelType": car.fuelType,
    "numberOfSeats": car.seatingCapacity,
    "mileageFromOdometer": {
      "@type": "QuantitativeValue",
      "value": car.mileage,
      "unitCode": "KMT"
    },
    "offers": {
      "@type": "Offer",
      "price": car.price,
      "priceCurrency": "USD",
      "availability": car.status === 'available' ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "AutomotiveBusiness",
        "name": "SSXMOTORS",
        "url": "https://ssxmotors.com"
      }
    },
    "image": car.images?.[0] || '/default-car.jpg',
    "url": `https://ssxmotors.com/cars/${car.id}`
  }] : [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800">
      <SEO 
        title={`${car.year} ${car.brand} ${car.model} - ${formatPrice(car.price)} | SSXMOTORS`}
        description={`Explore this ${car.year} ${car.brand} ${car.model} with ${car.fuelType} engine, ${car.transmission} transmission. Features include ${car.features.slice(0, 3).join(', ')}. ${car.description.substring(0, 150)}`}
        keywords={`${car.brand} ${car.model}, ${car.year}, buy ${car.brand}, ${car.fuelType} car, ${car.transmission}, luxury cars, certified pre-owned`}
        image={car.images?.[0]}
        structuredData={carStructuredData}
      />
      <div className="max-w-7xl mx-auto section-padding py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-slate-500 dark:text-slate-400 hover:text-accent transition-all mb-8 group"
        >
          <ChevronLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-semibold text-sm">Return to Collection</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden bg-slate-100 dark:bg-slate-800 shadow-premium group">
              <img
                src={imageError || !car.images?.length ? 'https://placehold.co/800x600?text=No+Image' : car.images[currentImageIndex]}
                alt={`${car.brand} ${car.model}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                onError={() => setImageError(true)}
              />
              
              {car.images?.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white hover:text-slate-900 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white hover:text-slate-900 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}

              {car.status === 'sold' && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <span className="text-white text-4xl font-bold">SOLD</span>
                </div>
              )}
            </div>

            {/* Thumbnail Strip */}
            {car.images && car.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto no-scrollbar pb-2">
                {car.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden transition-all duration-300 ${
                      index === currentImageIndex 
                        ? 'ring-2 ring-accent ring-offset-2 dark:ring-offset-slate-900 scale-95 opacity-100' 
                        : 'opacity-50 hover:opacity-80'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${car.brand} ${car.model} - ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Car Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {car.brand} {car.model}
              </h1>
              <p className="text-2xl text-accent font-semibold">{formatPrice(car.price)}</p>
            </div>

            <p className="text-gray-600 dark:text-gray-400">{car.description}</p>

            {/* Key Specs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-gray-700 p-4 rounded-lg">
                <Calendar className="h-5 w-5 text-accent mb-2" />
                <p className="text-sm text-gray-500 dark:text-gray-400">Year</p>
                <p className="font-semibold text-gray-900 dark:text-white">{car.year}</p>
              </div>
              <div className="bg-white dark:bg-gray-700 p-4 rounded-lg">
                <Fuel className="h-5 w-5 text-accent mb-2" />
                <p className="text-sm text-gray-500 dark:text-gray-400">Fuel</p>
                <p className="font-semibold text-gray-900 dark:text-white">{car.fuelType}</p>
              </div>
              <div className="bg-white dark:bg-gray-700 p-4 rounded-lg">
                <Settings className="h-5 w-5 text-accent mb-2" />
                <p className="text-sm text-gray-500 dark:text-gray-400">Transmission</p>
                <p className="font-semibold text-gray-900 dark:text-white">{car.transmission}</p>
              </div>
              <div className="bg-white dark:bg-gray-700 p-4 rounded-lg">
                <Users className="h-5 w-5 text-accent mb-2" />
                <p className="text-sm text-gray-500 dark:text-gray-400">Seats</p>
                <p className="font-semibold text-gray-900 dark:text-white">{car.seatingCapacity}</p>
              </div>
            </div>

            {/* Features */}
            {car.features.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Features</h3>
                <div className="flex flex-wrap gap-2">
                  {car.features.map((feature, index) => (
                    <span
                      key={index}
                      className="flex items-center space-x-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-sm"
                    >
                      <Check className="h-4 w-4" />
                      <span>{feature}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => toggleWishlist(car)}
                className={`flex-1 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 ${
                  isInWishlist(car.id!)
                    ? 'bg-red-500 text-white'
                    : 'border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-accent hover:text-accent'
                }`}
              >
                <Heart className={`h-5 w-5 ${isInWishlist(car.id!) ? 'fill-current' : ''}`} />
                <span>{isInWishlist(car.id!) ? 'In Wishlist' : 'Add to Wishlist'}</span>
              </button>
              
              <button className="flex-1 py-3 rounded-lg font-medium border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-accent hover:text-accent transition-colors flex items-center justify-center space-x-2">
                <Share2 className="h-5 w-5" />
                <span>Share</span>
              </button>
            </div>

            {car.status === 'available' ? (
              <Link
                to={`/test-drive/${car.id}`}
                className="block w-full py-4 bg-accent text-white text-center rounded-lg font-semibold hover:bg-accent-hover transition-colors"
              >
                Book Test Drive
              </Link>
            ) : (
              <button
                disabled
                className="block w-full py-4 bg-gray-400 text-white text-center rounded-lg font-semibold cursor-not-allowed"
              >
                Car Sold
              </button>
            )}
          </div>
        </div>

        {/* EMI Calculator */}
        <div className="mt-12">
          <EMICalculator carPrice={car.price} />
        </div>
      </div>
    </div>
  );
};

export default CarDetail;
