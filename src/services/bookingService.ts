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

import { Booking } from '../types';

const BOOKINGS_COLLECTION = 'bookings';

export const BookingService = {
  async createBooking(data: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>): Promise<Booking> {
    const now = new Date();
    const bookingsRef = ref(realtimeDb, BOOKINGS_COLLECTION);
    const newBookingRef = push(bookingsRef);
    const newBooking = {
      ...data,
      date: data.date instanceof Date ? data.date.toISOString() : data.date,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString()
    };
    await set(newBookingRef, newBooking);
    return { id: newBookingRef.key as string, ...data, createdAt: now, updatedAt: now };
  },

  async getBooking(id: string): Promise<Booking | null> {
    const docRef = ref(realtimeDb, `${BOOKINGS_COLLECTION}/${id}`);
    const snapshot = await get(docRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
      return { 
        id: snapshot.key, 
        ...data,
        date: data.date,
        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.updatedAt)
      } as Booking;
    }
    return null;
  },

  async getBookings(filters?: { status?: string }, page: number = 1, pageSize: number = 20): Promise<{ bookings: Booking[]; total: number }> {
    const bookingsRef = ref(realtimeDb, BOOKINGS_COLLECTION);
    const snapshot = await get(bookingsRef);
    let bookings: Booking[] = [];
    
    if (snapshot.exists()) {
      snapshot.forEach(childSnapshot => {
        const data = childSnapshot.val();
        bookings.push({
          id: childSnapshot.key as string,
          ...data,
          createdAt: new Date(data.createdAt),
          updatedAt: new Date(data.updatedAt) // Fix sorting
        });
      });
    }

    if (filters?.status && filters.status !== 'all') {
      bookings = bookings.filter(b => b.status === filters.status);
    }
    
    // Sort desc
    bookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    const total = bookings.length;
    const startIndex = (page - 1) * pageSize;
    bookings = bookings.slice(startIndex, startIndex + pageSize);
    
    return { bookings, total };
  },

  // Real-time listener
  subscribeToBookings(
    filters: { status?: string, email?: string } | undefined,
    callback: (data: { bookings: Booking[]; total: number }) => void
  ): () => void {
    const bookingsRef = ref(realtimeDb, BOOKINGS_COLLECTION);
    
    const unsubscribe = onValue(bookingsRef, (snapshot) => {
      let bookings: Booking[] = [];
      if (snapshot.exists()) {
        snapshot.forEach(childSnapshot => {
          const data = childSnapshot.val();
          bookings.push({
            id: childSnapshot.key as string,
            ...data,
            createdAt: new Date(data.createdAt || Date.now()),
            updatedAt: new Date(data.updatedAt || Date.now())
          });
        });
      }

      if (filters?.status && filters.status !== 'all') {
        bookings = bookings.filter(b => b.status === filters.status);
      }
      if (filters?.email) {
        bookings = bookings.filter(b => b.email === filters.email);
      }
      
      bookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      callback({ bookings, total: bookings.length });
    });
    
    return () => unsubscribe();
  },

  async updateBookingStatus(id: string, status: Booking['status']): Promise<Booking | null> {
    const docRef = ref(realtimeDb, `${BOOKINGS_COLLECTION}/${id}`);
    const snapshot = await get(docRef);
    if (!snapshot.exists()) return null;
    
    const now = new Date();
    const updateData = { status, updatedAt: now.toISOString() };
    await update(docRef, updateData);
    
    return { id, ...snapshot.val(), ...updateData, updatedAt: now } as Booking;
  },

  async deleteBooking(id: string): Promise<boolean> {
    const docRef = ref(realtimeDb, `${BOOKINGS_COLLECTION}/${id}`);
    const snapshot = await get(docRef);
    if (!snapshot.exists()) return false;
    await remove(docRef);
    return true;
  }
};

export default BookingService;
