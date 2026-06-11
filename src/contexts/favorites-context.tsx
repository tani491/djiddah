"use client";

import React, { createContext, useContext, useCallback, useSyncExternalStore } from "react";

export interface FavoriteItem {
  id: string;
  title: string;
  price: number;
  image: string;
  category: string;
}

interface FavoritesContextType {
  favorites: FavoriteItem[];
  addFavorite: (item: FavoriteItem) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  clearFavorites: () => void;
  favoritesOpen: boolean;
  setFavoritesOpen: (open: boolean) => void;
  mounted: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

const STORAGE_KEY = "djidah-favorites";
const EMPTY_ARRAY: FavoriteItem[] = [];

function readFavoritesFromStorage(): FavoriteItem[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveFavoritesToStorage(favorites: FavoriteItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
}

// External store for useSyncExternalStore
// - Server always returns a stable empty array reference
// - Client reads from localStorage and caches the result
let favoritesSnapshot: FavoriteItem[] | null = null;
let listeners: Array<() => void> = [];

function subscribe(callback: () => void) {
  listeners.push(callback);
  return () => {
    listeners = listeners.filter((l) => l !== callback);
  };
}

// Stable reference for server — must return the same reference each call
function getServerSnapshot(): FavoriteItem[] {
  return EMPTY_ARRAY;
}

function getClientSnapshot(): FavoriteItem[] {
  if (favoritesSnapshot === null) {
    favoritesSnapshot = readFavoritesFromStorage();
  }
  return favoritesSnapshot;
}

function updateSnapshot(next: FavoriteItem[]) {
  favoritesSnapshot = next;
  saveFavoritesToStorage(next);
  listeners.forEach((l) => l());
}

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const favorites = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
  const [favoritesOpen, setFavoritesOpen] = React.useState(false);

  // useSyncExternalStore guarantees the server renders EMPTY_ARRAY and
  // the client first render also uses getServerSnapshot for hydration,
  // then switches to getClientSnapshot. So `mounted` = true once we have
  // a non-empty-snapshot or simply always on client after hydration.
  // Since favorites data may differ after hydration, we use a separate
  // mounted tracker via useSyncExternalStore on a simple boolean store.
  const mounted = useSyncExternalStore(
    mountedSubscribe,
    mountedGetSnapshot,
    mountedGetServerSnapshot
  );

  const addFavorite = useCallback((item: FavoriteItem) => {
    const current = favoritesSnapshot ?? [];
    if (current.find((f) => f.id === item.id)) return;
    updateSnapshot([...current, item]);
  }, []);

  const removeFavorite = useCallback((id: string) => {
    const current = favoritesSnapshot ?? [];
    updateSnapshot(current.filter((f) => f.id !== id));
  }, []);

  const isFavorite = useCallback(
    (id: string) => favorites.some((f) => f.id === id),
    [favorites]
  );

  const clearFavorites = useCallback(() => {
    updateSnapshot([]);
  }, []);

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addFavorite,
        removeFavorite,
        isFavorite,
        clearFavorites,
        favoritesOpen,
        setFavoritesOpen,
        mounted,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

// Simple mounted tracker using useSyncExternalStore
let mountedValue = false;
let mountedListeners: Array<() => void> = [];

function mountedSubscribe(callback: () => void) {
  mountedListeners.push(callback);
  // Set mounted to true immediately on client
  if (!mountedValue) {
    mountedValue = true;
    mountedListeners.forEach((l) => l());
  }
  return () => {
    mountedListeners = mountedListeners.filter((l) => l !== callback);
  };
}

function mountedGetSnapshot(): boolean {
  return mountedValue;
}

function mountedGetServerSnapshot(): boolean {
  return false;
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}
