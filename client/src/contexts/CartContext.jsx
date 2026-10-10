import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { useNotification } from './NotificationContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState({
    items: [],
    subtotalINR: 0,
    shippingINR: 0,
    totalINR: 0,
    itemCount: 0,
  });
  const [loading, setLoading] = useState(false);
  const { success, error } = useNotification();

  const refreshCart = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.getCart();
      if (res.success && res.cart) {
        setCart(res.cart);
      }
    } catch (err) {
      console.warn('Failed to fetch cart:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addToCart = async (productId, size = 'Standard', color = '', quantity = 1) => {
    try {
      const res = await api.addToCart({ productId, size, color, quantity });
      if (res.success && res.cart) {
        setCart(res.cart);
        success(res.message || 'Added to cart!');
        return true;
      }
    } catch (err) {
      error(err.message || 'Could not add to cart.');
      return false;
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      const res = await api.updateCartItem(itemId, quantity);
      if (res.success && res.cart) {
        setCart(res.cart);
      }
    } catch (err) {
      error(err.message || 'Could not update quantity.');
    }
  };

  const removeItem = async (itemId) => {
    try {
      const res = await api.removeCartItem(itemId);
      if (res.success && res.cart) {
        setCart(res.cart);
        success('Item removed from cart.');
      }
    } catch (err) {
      error(err.message || 'Could not remove item.');
    }
  };

  const value = {
    cart,
    items: cart.items,
    itemCount: cart.itemCount,
    subtotalINR: cart.subtotalINR,
    shippingINR: cart.shippingINR,
    totalINR: cart.totalINR,
    loading,
    refreshCart,
    addToCart,
    updateQuantity,
    removeItem,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
