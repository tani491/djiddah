"use client";

import React, { createContext, useContext, useCallback, useSyncExternalStore } from "react";
import { trackCartAdd } from "@/lib/analytics";

export interface CartItem {
  id: string;
  title: string;
  price: number;
  image: string;
  category: string;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  mounted: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = "djidah-cart";
const EMPTY_ARRAY: CartItem[] = [];

function readCartFromStorage(): CartItem[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveCartToStorage(cart: CartItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
}

// External store for useSyncExternalStore
let cartSnapshot: CartItem[] | null = null;
let listeners: Array<() => void> = [];

function subscribe(callback: () => void) {
  listeners.push(callback);
  return () => {
    listeners = listeners.filter((l) => l !== callback);
  };
}

function getServerSnapshot(): CartItem[] {
  return EMPTY_ARRAY;
}

function getClientSnapshot(): CartItem[] {
  if (cartSnapshot === null) {
    cartSnapshot = readCartFromStorage();
  }
  return cartSnapshot;
}

function updateSnapshot(next: CartItem[]) {
  cartSnapshot = next;
  saveCartToStorage(next);
  listeners.forEach((l) => l());
}

// Mounted tracker (shared with favorites pattern)
let cartMountedValue = false;
let cartMountedListeners: Array<() => void> = [];

function cartMountedSubscribe(callback: () => void) {
  cartMountedListeners.push(callback);
  if (!cartMountedValue) {
    cartMountedValue = true;
    cartMountedListeners.forEach((l) => l());
  }
  return () => {
    cartMountedListeners = cartMountedListeners.filter((l) => l !== callback);
  };
}

function cartMountedGetSnapshot(): boolean {
  return cartMountedValue;
}

function cartMountedGetServerSnapshot(): boolean {
  return false;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const cart = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
  const [cartOpen, setCartOpen] = React.useState(false);

  const mounted = useSyncExternalStore(
    cartMountedSubscribe,
    cartMountedGetSnapshot,
    cartMountedGetServerSnapshot
  );

  const addToCart = useCallback((item: Omit<CartItem, "quantity">) => {
    const current = cartSnapshot ?? [];
    const existing = current.find((c) => c.id === item.id);
    if (existing) {
      updateSnapshot(
        current.map((c) =>
          c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c
        )
      );
    } else {
      updateSnapshot([...current, { ...item, quantity: 1 }]);
    }
    // Track cart add event
    trackCartAdd(item.id, item.title);
  }, []);

  const removeFromCart = useCallback((id: string) => {
    const current = cartSnapshot ?? [];
    updateSnapshot(current.filter((c) => c.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    const current = cartSnapshot ?? [];
    if (quantity <= 0) {
      updateSnapshot(current.filter((c) => c.id !== id));
    } else {
      updateSnapshot(
        current.map((c) => (c.id === id ? { ...c, quantity } : c))
      );
    }
  }, []);

  const clearCart = useCallback(() => {
    updateSnapshot([]);
  }, []);

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
        cartOpen,
        setCartOpen,
        mounted,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
