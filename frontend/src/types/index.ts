export interface Car {
  id?: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  images: string[];
  fuelType: 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid' | 'CNG';
  transmission: 'Manual' | 'Automatic';
  mileage: number;
  description: string;
  features: string[];
  status: 'available' | 'sold';
  featured: boolean;
  color: string;
  engineCapacity: string;
  seatingCapacity: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Booking {
  id?: string;
  carId: string;
  name: string;
  email: string;
  phone: string;
  date: Date | string;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface User {
  id?: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
}

export interface FilterOptions {
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  fuelType?: string;
  transmission?: string;
  year?: number;
  search?: string;
  sortBy?: string;
}

export interface SearchFilters {
  brands: string[];
  fuelTypes: string[];
  transmissions: string[];
  years: number[];
  priceRanges: { min: number; max: number; label: string }[];
}

export interface ComparisonItem {
  car: Car;
  specs: {
    label: string;
    value: string;
  }[];
}
