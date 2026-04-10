import { realtimeDb } from '../config/firebase';
import { 
  ref, 
  get, 
  push, 
  set, 
  update, 
  remove, 
  onValue,
  child
} from 'firebase/database';

import { Car } from '../types';

const CARS_COLLECTION = 'cars';

export const CarService = {
  async createCar(data: Omit<Car, 'id' | 'createdAt' | 'updatedAt'>): Promise<Car> {
    const now = new Date();
    const carsRef = ref(realtimeDb, CARS_COLLECTION);
    const newCarRef = push(carsRef);
    const newCar = {
      ...data,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString()
    };
    await set(newCarRef, newCar);
    return { id: newCarRef.key as string, ...data, createdAt: now, updatedAt: now };
  },

  async getCar(id: string): Promise<Car | null> {
    const docRef = ref(realtimeDb, `${CARS_COLLECTION}/${id}`);
    const snapshot = await get(docRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
      return { 
        id: snapshot.key, 
        ...data,
        images: data.images || [],
        features: data.features || [],
        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.updatedAt)
      } as Car;
    }
    return null;
  },

  async getCars(filters?: any, sort?: any, page: number = 1, pageSize: number = 12): Promise<{ cars: Car[]; total: number }> {
    const carsRef = ref(realtimeDb, CARS_COLLECTION);
    const snapshot = await get(carsRef);
    let cars: Car[] = [];
    
    if (snapshot.exists()) {
      snapshot.forEach(childSnapshot => {
        const data = childSnapshot.val();
        cars.push({
          id: childSnapshot.key as string,
          ...data,
          images: data.images || [],
          features: data.features || [],
          createdAt: new Date(data.createdAt),
          updatedAt: new Date(data.updatedAt)
        });
      });
    }

    // Apply filters in memory
    if (filters?.brand) cars = cars.filter(c => c.brand === filters.brand);
    if (filters?.fuelType) cars = cars.filter(c => c.fuelType === filters.fuelType);
    if (filters?.transmission) cars = cars.filter(c => c.transmission === filters.transmission);
    if (filters?.year) cars = cars.filter(c => c.year === parseInt(filters.year));
    if (filters?.status) cars = cars.filter(c => c.status === filters.status);
    // Explicit featured check, sometimes true vs 'true' string
    if (filters?.featured !== undefined) {
      const isFeatured = String(filters.featured) === 'true';
      cars = cars.filter(c => c.featured === isFeatured);
    }
    if (filters?.minPrice) cars = cars.filter(c => c.price >= parseInt(filters.minPrice));
    if (filters?.maxPrice) cars = cars.filter(c => c.price <= parseInt(filters.maxPrice));
    
    if (filters?.search) {
      const term = filters.search.toLowerCase();
      cars = cars.filter(car => 
        (car.brand || '').toLowerCase().includes(term) || 
        (car.model || '').toLowerCase().includes(term) ||
        (car.description || '').toLowerCase().includes(term)
      );
    }

    // Apply sorting
    if (sort) {
      cars.sort((a, b) => {
        const aVal = (a as any)[sort.field];
        const bVal = (b as any)[sort.field];
        if (sort.direction === 'asc') return aVal > bVal ? 1 : -1;
        return aVal < bVal ? 1 : -1;
      });
    } else {
      cars.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    
    const total = cars.length;
    const startIndex = (page - 1) * pageSize;
    cars = cars.slice(startIndex, startIndex + pageSize);
    
    return { cars, total };
  },

  // Real-time listener
  subscribeToCars(
    filters: any,
    sort: any,
    page: number = 1,
    pageSize: number = 12,
    callback: (data: { cars: Car[]; total: number }) => void
  ): () => void {
    const carsRef = ref(realtimeDb, CARS_COLLECTION);
    
    const unsubscribe = onValue(carsRef, (snapshot) => {
      let cars: Car[] = [];
      if (snapshot.exists()) {
        snapshot.forEach(childSnapshot => {
          const data = childSnapshot.val();
          cars.push({
            id: childSnapshot.key as string,
            ...data,
            images: data.images || [],
            features: data.features || [],
            createdAt: new Date(data.createdAt || Date.now()),
            updatedAt: new Date(data.updatedAt || Date.now())
          });
        });
      }

      // Memory filter
      if (filters?.brand) cars = cars.filter(c => c.brand === filters.brand);
      if (filters?.fuelType) cars = cars.filter(c => c.fuelType === filters.fuelType);
      if (filters?.transmission) cars = cars.filter(c => c.transmission === filters.transmission);
      if (filters?.year) cars = cars.filter(c => c.year === parseInt(filters.year));
      if (filters?.status) cars = cars.filter(c => c.status === filters.status);
      if (filters?.featured !== undefined) {
        const isFeatured = String(filters.featured) === 'true';
        cars = cars.filter(c => c.featured === isFeatured);
      }
      if (filters?.minPrice) cars = cars.filter(c => c.price >= parseInt(filters.minPrice));
      if (filters?.maxPrice) cars = cars.filter(c => c.price <= parseInt(filters.maxPrice));
      
      if (filters?.search) {
        const term = filters.search.toLowerCase();
        cars = cars.filter(car => 
          (car.brand || '').toLowerCase().includes(term) || 
          (car.model || '').toLowerCase().includes(term) ||
          (car.description || '').toLowerCase().includes(term)
        );
      }

      // Default sort desc by date
      if (sort) {
        cars.sort((a, b) => {
          const aVal = (a as any)[sort.field];
          const bVal = (b as any)[sort.field];
          if (sort.direction === 'asc') return aVal > bVal ? 1 : -1;
          return aVal < bVal ? 1 : -1;
        });
      } else {
        cars.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }
      
      const total = cars.length;
      const startIndex = (page - 1) * pageSize;
      const paginatedCars = cars.slice(startIndex, startIndex + pageSize);
      
      callback({ cars: paginatedCars, total });
    });

    return () => unsubscribe();
  },

  async updateCar(id: string, data: Partial<Car>): Promise<Car | null> {
    const docRef = ref(realtimeDb, `${CARS_COLLECTION}/${id}`);
    const snapshot = await get(docRef);
    if (!snapshot.exists()) return null;
    
    const now = new Date();
    const updateData = { ...data, updatedAt: now.toISOString() };
    await update(docRef, updateData);
    
    return { id, ...snapshot.val(), ...updateData, updatedAt: now } as Car;
  },

  async deleteCar(id: string): Promise<boolean> {
    const docRef = ref(realtimeDb, `${CARS_COLLECTION}/${id}`);
    const snapshot = await get(docRef);
    if (!snapshot.exists()) return false;
    await remove(docRef);
    return true;
  },

  async getBrands(): Promise<string[]> {
    const carsRef = ref(realtimeDb, CARS_COLLECTION);
    const snapshot = await get(carsRef);
    const brands = new Set<string>();
    if (snapshot.exists()) {
      snapshot.forEach(doc => {
        const data = doc.val();
        if (data.brand) brands.add(data.brand);
      });
    }
    return Array.from(brands);
  },

  async getYears(): Promise<number[]> {
    const carsRef = ref(realtimeDb, CARS_COLLECTION);
    const snapshot = await get(carsRef);
    const years = new Set<number>();
    if (snapshot.exists()) {
      snapshot.forEach(doc => {
        const data = doc.val();
        if (data.year) years.add(data.year);
      });
    }
    return Array.from(years).sort((a, b) => b - a);
  }
};

export default CarService;
