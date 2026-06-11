"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, MessageCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useFavorites } from "@/contexts/favorites-context";
import { formatPrice } from "./product-card";

export default function FavoritesPanel() {
  const { favorites, favoritesOpen, setFavoritesOpen, removeFavorite } = useFavorites();

  const getWhatsAppLink = (title: string, price: number) => {
    const msg = `Bonjour Djidah Electrique, je suis intéressé par l'article ${title} au prix de ${formatPrice(price)}.`;
    return `https://wa.me/221781131340?text=${encodeURIComponent(msg)}`;
  };

  return (
    <AnimatePresence>
      {favoritesOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setFavoritesOpen(false)}
            className="fixed inset-0 bg-black/20 z-50"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white z-50 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-neutral-100">
              <h2 className="text-lg font-semibold text-neutral-900">
                Favoris ({favorites.length})
              </h2>
              <button
                onClick={() => setFavoritesOpen(false)}
                className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-neutral-500" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {favorites.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-neutral-400 mb-4">
                    Aucun favori pour le moment
                  </p>
                  <Link
                    href="/shop"
                    onClick={() => setFavoritesOpen(false)}
                    className="text-sm text-neutral-900 underline underline-offset-4 hover:text-neutral-600"
                  >
                    Parcourir la boutique
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {favorites.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 p-3 bg-neutral-50 rounded-xl"
                    >
                      <div className="relative w-20 h-20 bg-white rounded-lg flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-contain p-2"
                          sizes="80px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/product/${item.id}`}
                          onClick={() => setFavoritesOpen(false)}
                          className="text-sm font-medium text-neutral-900 hover:text-neutral-600 transition-colors truncate block"
                        >
                          {item.title}
                        </Link>
                        <p className="text-sm text-neutral-500 mt-0.5">
                          {formatPrice(item.price)}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <a
                            href={getWhatsAppLink(item.title, item.price)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-neutral-600 hover:text-neutral-900 transition-colors"
                          >
                            <MessageCircle className="w-3 h-3" />
                            Acheter
                          </a>
                          <button
                            onClick={() => removeFavorite(item.id)}
                            className="inline-flex items-center gap-1 text-xs text-neutral-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                            Retirer
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {favorites.length > 0 && (
              <div className="p-6 border-t border-neutral-100">
                <a
                  href="https://wa.me/221781131340?text=Bonjour%20Djidah%20Electrique%2C%20je%20suis%20int%C3%A9ress%C3%A9%20par%20plusieurs%20articles%20de%20vos%20favoris."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#E30613] text-white text-sm font-semibold rounded-full hover:bg-[#C00510] transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  Commander via WhatsApp
                </a>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
