import React, { createContext, useContext, useState, useCallback, ReactNode, useMemo } from 'react';

interface CartContextValue {
  cartCount: number;
  items: Record<string, number>;
  addToCart: (productId: string) => void;
  removeFromCart: (productId: string) => void;
  decrementFromCart: (productId: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue>({
  cartCount: 0,
  items: {},
  addToCart: () => {},
  removeFromCart: () => {},
  decrementFromCart: () => {},
  clearCart: () => {},
});

export const useCart = () => useContext(CartContext);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartState, setCartState] = useState<Record<string, number>>({});

  const cartCount = useMemo(() => {
    return Object.values(cartState).reduce((sum, qty) => sum + qty, 0);
  }, [cartState]);

  const addToCart = useCallback((productId: string) => {
    setCartState((prev) => ({
      ...prev,
      [productId]: (prev[productId] ?? 0) + 1,
    }));
  }, []);

  const decrementFromCart = useCallback((productId: string) => {
    setCartState((prev) => {
      const current = prev[productId] ?? 0;
      if (current <= 1) {
        const next = { ...prev };
        delete next[productId];
        return next;
      }
      return { ...prev, [productId]: current - 1 };
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCartState((prev) => {
      const next = { ...prev };
      delete next[productId];
      return next;
    });
  }, []);

  const clearCart = useCallback(() => {
    setCartState({});
  }, []);

  const value = useMemo(() => ({
    cartCount,
    items: cartState,
    addToCart,
    removeFromCart,
    decrementFromCart,
    clearCart,
  }), [cartCount, cartState, addToCart, removeFromCart, decrementFromCart, clearCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
