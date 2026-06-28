import React, { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext(null);
const STORAGE_KEY = 'feroukart_cart';

const loadCart = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(loadCart);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const isInCart = (id) => items.some((item) => item.id === id);

  const addItem = (type, entity, imageUrl, quantity = 1) => {
    if (isInCart(entity.id)) return;
    const isPrint = type === 'print';
    setItems((prev) => [
      ...prev,
      {
        id: entity.id,
        type,
        name: entity.name,
        price: entity.price,
        imageUrl: imageUrl || null,
        quantity: isPrint ? Math.max(1, Math.min(quantity, entity.stock ?? quantity)) : 1,
        maxStock: isPrint ? entity.stock : undefined,
      },
    ]);
  };

  const updateQuantity = (id, quantity) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const max = item.maxStock ?? Infinity;
        return { ...item, quantity: Math.max(1, Math.min(quantity, max)) };
      })
    );
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => setItems([]);

  const itemCount = items.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const total = items.reduce((sum, item) => sum + (Number(item.price) || 0) * (item.quantity || 1), 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, isInCart, total, itemCount }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
