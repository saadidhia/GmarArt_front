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

  const isInCart = (paintingId) => items.some((item) => item.paintingId === paintingId);

  const addItem = (painting, imageUrl) => {
    if (isInCart(painting.id)) return;
    setItems((prev) => [
      ...prev,
      {
        paintingId: painting.id,
        paintingName: painting.name,
        price: painting.price,
        imageUrl: imageUrl || null,
      },
    ]);
  };

  const removeItem = (paintingId) => {
    setItems((prev) => prev.filter((item) => item.paintingId !== paintingId));
  };

  const clearCart = () => setItems([]);

  const total = items.reduce((sum, item) => sum + (Number(item.price) || 0), 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart, isInCart, total }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
