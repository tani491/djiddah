"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Trash2, MessageCircle, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/contexts/cart-context";

function formatPrice(price: number) {
  return new Intl.NumberFormat("fr-FR").format(price) + " FCFA";
}

export default function CartPanel() {
  const { cart, cartOpen, setCartOpen, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount } = useCart();

  const getWhatsAppLink = () => {
    const items = cart
      .map((item) => `- ${item.title} (x${item.quantity}) : ${formatPrice(item.price * item.quantity)}`)
      .join("\n");
    const msg = `Bonjour Djidah Electrique, je souhaite commander :\n\n${items}\n\nTotal : ${formatPrice(cartTotal)}\n\nMerci !`;
    return `https://wa.me/221781131340?text=${encodeURIComponent(msg)}`;
  };

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
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
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-neutral-900" />
                <h2 className="text-lg font-semibold text-neutral-900">
                  Panier ({cartCount})
                </h2>
              </div>
              <button
                onClick={() => setCartOpen(false)}
                className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-neutral-500" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {cart.length === 0 ? (
                <div className="text-center py-16">
                  <ShoppingBag className="w-12 h-12 text-neutral-200 mx-auto mb-4" />
                  <p className="text-neutral-400 mb-1 font-medium">
                    Votre panier est vide
                  </p>
                  <p className="text-neutral-300 text-sm mb-6">
                    Ajoutez des articles pour commencer
                  </p>
                  <Link
                    href="/shop"
                    onClick={() => setCartOpen(false)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white text-sm font-semibold rounded-full hover:bg-neutral-800 transition-colors"
                  >
                    Parcourir la boutique
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {cart.map((item) => (
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
                          onClick={() => setCartOpen(false)}
                          className="text-sm font-medium text-neutral-900 hover:text-neutral-600 transition-colors truncate block"
                        >
                          {item.title}
                        </Link>
                        <p className="text-sm font-semibold text-neutral-900 mt-0.5">
                          {formatPrice(item.price * item.quantity)}
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex items-center bg-white rounded-lg border border-neutral-200">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1.5 hover:bg-neutral-50 transition-colors rounded-l-lg"
                            >
                              <Minus className="w-3 h-3 text-neutral-500" />
                            </button>
                            <span className="px-2.5 text-xs font-semibold text-neutral-900 min-w-[24px] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1.5 hover:bg-neutral-50 transition-colors rounded-r-lg"
                            >
                              <Plus className="w-3 h-3 text-neutral-500" />
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="p-1.5 hover:bg-red-50 rounded-lg transition-colors group"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-neutral-300 group-hover:text-red-500 transition-colors" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-neutral-100 space-y-4">
                {/* Total */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-500">Sous-total</span>
                  <span className="text-lg font-bold text-neutral-900">
                    {formatPrice(cartTotal)}
                  </span>
                </div>

                {/* WhatsApp Order */}
                <a
                  href={getWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-[#25D366] text-white text-sm font-semibold rounded-full hover:bg-[#20bd5a] transition-colors shadow-lg shadow-green-600/20"
                >
                  <MessageCircle className="w-5 h-5" />
                  Commander via WhatsApp
                </a>

                {/* Clear Cart */}
                <button
                  onClick={clearCart}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium text-neutral-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Vider le panier
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
