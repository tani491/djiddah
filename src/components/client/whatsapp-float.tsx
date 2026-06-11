"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";

export default function WhatsAppFloat() {
  const [showTooltip, setShowTooltip] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const whatsappLink =
    "https://wa.me/221781131340?text=Bonjour%20Djidah%20Electrique%2C%20j%27aimerais%20avoir%20des%20informations%20sur%20vos%20produits.";

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && !dismissed && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="bg-white rounded-2xl shadow-xl border border-neutral-100 p-4 max-w-[260px] relative"
          >
            <button
              onClick={() => setDismissed(true)}
              className="absolute top-2 right-2 p-1 hover:bg-neutral-100 rounded-full transition-colors"
            >
              <X className="w-3 h-3 text-neutral-400" />
            </button>
            <p className="text-sm font-semibold text-neutral-900 mb-1">
              Besoin d&apos;aide ?
            </p>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Discutez avec nous sur WhatsApp pour toute question sur nos produits et commandes.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating WhatsApp Button */}
      <motion.a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.2, type: "spring", stiffness: 180, damping: 14 }}
        className="relative flex items-center justify-center w-[60px] h-[60px] bg-[#25D366] rounded-full shadow-lg shadow-[#25D366]/35 hover:shadow-xl hover:shadow-[#25D366]/45 hover:scale-105 transition-all duration-200 group"
        aria-label="Contacter via WhatsApp"
      >
        {/* Official WhatsApp SVG icon */}
        <svg
          viewBox="0 0 24 24"
          className="w-8 h-8 fill-white"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>

        {/* Pulsation ring effect */}
        <span className="absolute inset-0 rounded-full animate-[whatsapp-ping_2s_ease-in-out_infinite] border-2 border-[#25D366]/40" />
        <span className="absolute inset-0 rounded-full animate-[whatsapp-ping_2s_ease-in-out_infinite_0.5s] border-2 border-[#25D366]/20" />
      </motion.a>
    </div>
  );
}
