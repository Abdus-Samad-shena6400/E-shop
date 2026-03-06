import React, { createContext, useContext, useState, useEffect } from 'react';
import * as api from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Fetch cart from backend when user logs in
  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      // Use localStorage for anonymous users
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      }
    }
  }, [user]);

  // Sync to localStorage for anonymous users
  useEffect(() => {
    if (!user) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart, user]);

  // Normalize cart items to flatten product data
  const normalizeCartItems = (items) => {
    return items.map(item => {
      if (item.product && typeof item.product === 'object') {
        // If product is populated (from API), flatten it
        return {
          ...item.product,
          quantity: item.quantity,
          price: item.price || item.product.price,
          _id: item.product._id || item.product.id,
        };
      }
      // Otherwise return as-is
      return item;
    });
  };

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await api.getCart();
      setCart(normalizeCartItems(response.cart.items || []));
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const resolveId = (p) => p.id || p._id || (p.product && (p.product.id || p.product._id));

  const addToCart = async (product, quantity = 1) => {
    const prodId = resolveId(product);

    if (user) {
      try {
        const response = await api.addToCart(prodId, quantity);
        setCart(normalizeCartItems(response.cart.items || []));
        return { success: true };
      } catch (error) {
        return {
          success: false,
          error: error.response?.data?.message || 'Failed to add to cart',
        };
      }
    } else {
      // For anonymous users, use localStorage
      setCart((prevCart) => {
        const existingItem = prevCart.find((item) => resolveId(item) === prodId);
        if (existingItem) {
          return prevCart.map((item) =>
            resolveId(item) === prodId
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        }
        return [...prevCart, { ...product, quantity }];
      });
      return { success: true };
    }
  };

  const removeFromCart = async (productId) => {
    const id = productId;
    if (user) {
      try {
        const response = await api.removeFromCart(id);
        setCart(normalizeCartItems(response.cart.items || []));
        return { success: true };
      } catch (error) {
        return {
          success: false,
          error: error.response?.data?.message || 'Failed to remove from cart',
        };
      }
    } else {
      setCart((prevCart) => prevCart.filter((item) => resolveId(item) !== id));
      return { success: true };
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }

    const id = productId;

    if (user) {
      try {
        const response = await api.updateCartItem(id, quantity);
        setCart(normalizeCartItems(response.cart.items || []));
      } catch (error) {
        console.error('Failed to update cart:', error);
      }
    } else {
      setCart((prevCart) =>
        prevCart.map((item) =>
          resolveId(item) === id ? { ...item, quantity } : item
        )
      );
    }
  };

  const clearCart = async () => {
    if (user) {
      try {
        await api.clearCart();
        setCart([]);
        return { success: true };
      } catch (error) {
        return {
          success: false,
          error: error.response?.data?.message || 'Failed to clear cart',
        };
      }
    } else {
      setCart([]);
      return { success: true };
    }
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price || 0) * item.quantity, 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
    loading,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};