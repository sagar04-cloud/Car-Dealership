import React, { createContext, useContext, useState, useEffect } from 'react';
import { Car } from '../types';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';

interface WishlistContextType {
  wishlist: Car[];
  isInWishlist: (carId: string) => boolean;
  addToWishlist: (car: Car) => void;
  removeFromWishlist: (carId: string) => void;
  toggleWishlist: (car: Car) => void;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const storageKey = user ? `wishlist_${user.id}` : 'wishlist_guest';

  const [wishlist, setWishlist] = useState<Car[]>(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse wishlist', e);
        return [];
      }
    }
    return [];
  });

  // Reload wishlist when user changes
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        setWishlist(JSON.parse(saved));
      } catch (e) {
        setWishlist([]);
      }
    } else {
      setWishlist([]);
    }
  }, [storageKey]);

  useEffect(() => {
    if (wishlist.length > 0 || localStorage.getItem(storageKey)) {
      localStorage.setItem(storageKey, JSON.stringify(wishlist));
    }
  }, [wishlist, storageKey]);

  const isInWishlist = (carId: string) => {
    if (!carId) return false;
    return wishlist.some((car) => car.id === carId);
  };

  const addToWishlist = (car: Car) => {
    if (car.id && !isInWishlist(car.id)) {
      setWishlist([...wishlist, car]);
      toast.success('Added to wishlist');
    }
  };

  const removeFromWishlist = (carId: string) => {
    if (!carId) return;
    setWishlist(wishlist.filter((car) => car.id !== carId));
    toast.success('Removed from wishlist');
  };

  const toggleWishlist = (car: Car) => {
    if (!car.id) return;
    if (isInWishlist(car.id)) {
      removeFromWishlist(car.id);
    } else {
      addToWishlist(car);
    }
  };

  const clearWishlist = () => {
    setWishlist([]);
    toast.success('Wishlist cleared');
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        isInWishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
