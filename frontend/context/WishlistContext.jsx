import React, { createContext, useContext, useState, useEffect } from 'react';
import * as api from '../services/api';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Fetch wishlist from backend when user logs in
  useEffect(() => {
    if (user) {
      fetchWishlist();
    } else {
      // Use localStorage for anonymous users
      const storedWishlist = localStorage.getItem('wishlist');
      if (storedWishlist) {
        setWishlist(JSON.parse(storedWishlist));
      }
    }
  }, [user]);

  // Sync to localStorage for anonymous users
  useEffect(() => {
    if (!user) {
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }
  }, [wishlist, user]);

  const resolveId = (p) => p.id || p._id || (p.product && (p.product.id || p.product._id));

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const response = await api.getWishlist();
      setWishlist(response.wishlist.products || []);
    } catch (error) {
      console.error('Failed to fetch wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (product) => {
    const prodId = resolveId(product);
    if (user) {
      try {
        const response = await api.addToWishlist(prodId);
        setWishlist(response.wishlist.products || []);
        return { success: true };
      } catch (error) {
        return {
          success: false,
          error: error.response?.data?.message || 'Failed to add to wishlist',
        };
      }
    } else {
      // For anonymous users, use localStorage
      setWishlist((prevWishlist) => {
        if (!prevWishlist.find((item) => resolveId(item) === prodId)) {
          return [...prevWishlist, product];
        }
        return prevWishlist;
      });
      return { success: true };
    }
  };

  const removeFromWishlist = async (productId) => {
    const id = productId;
    if (user) {
      try {
        const response = await api.removeFromWishlist(id);
        setWishlist(response.wishlist.products || []);
        return { success: true };
      } catch (error) {
        return {
          success: false,
          error: error.response?.data?.message || 'Failed to remove from wishlist',
        };
      }
    } else {
      setWishlist((prevWishlist) =>
        prevWishlist.filter((item) => resolveId(item) !== id)
      );
      return { success: true };
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some(
      (item) => item.id === productId || item._id === productId
    );
  };

  const value = {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    loading,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};