"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { useFavorites } from "@/contexts/favorites-context";
import { useCart } from "@/contexts/cart-context";

interface Product {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage?: number | null;
  promoLabel?: string | null;
  images: string;
  storage?: string | null;
  condition?: string | null;
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("fr-FR").format(price) + " FCFA";
}

function getDiscountedPrice(price: number, discountPercentage?: number | null) {
  if (!discountPercentage) return price;
  return Math.round(price * (1 - discountPercentage / 100));
}

export default function ProductCard({ product }: { product: Product }) {
  const { isFavorite, addFavorite, removeFavorite, mounted: favMounted } = useFavorites();
  const { addToCart, setCartOpen, mounted: cartMounted } = useCart();
  const images = JSON.parse(product.images || "[]") as string[];
  const image = images[0] || "/images/placeholder.png";
  const fav = favMounted ? isFavorite(product.id) : false;

  const hasDiscount = !!product.discountPercentage;
  const discountedPrice = getDiscountedPrice(product.price, product.discountPercentage);

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (fav) {
      removeFavorite(product.id);
    } else {
      addFavorite({
        id: product.id,
        title: product.title,
        price: discountedPrice,
        image,
        category: product.category,
      });
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: product.id,
      title: product.title,
      price: discountedPrice,
      image,
      category: product.category,
    });
    setCartOpen(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Link href={`/product/${product.id}`} className="group block">
        <div className="relative bg-white border border-[#E30613]/20 rounded-2xl overflow-hidden hover:border-[#E30613]/40 hover:shadow-md hover:shadow-[#E30613]/5 transition-all duration-300">
          {/* Image */}
          <div className="relative aspect-square bg-neutral-50 overflow-hidden">
            <Image
              src={image}
              alt={product.title}
              fill
              className="object-contain p-6 group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
            {/* Favorite Button */}
            <button
              onClick={handleFavorite}
              className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors duration-200 z-10"
            >
              <Heart
                className={`w-4 h-4 transition-colors duration-200 ${
                  fav ? "fill-[#E30613] text-[#E30613]" : "text-neutral-400"
                }`}
              />
            </button>

            {/* Condition Badge */}
            {product.condition && !hasDiscount && (
              <span className="absolute top-3 left-3 px-2.5 py-1 bg-emerald-600 text-white text-[11px] font-semibold rounded-full">
                {product.condition}
              </span>
            )}

            {/* Promo Badge */}
            {hasDiscount && (
              <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                {product.promoLabel && (
                  <span className="px-2.5 py-1 bg-emerald-600 text-white text-[11px] font-bold rounded-full uppercase tracking-wide">
                    {product.promoLabel}
                  </span>
                )}
                <span className="px-2.5 py-1 bg-black text-white text-[11px] font-bold rounded-full">
                  -{product.discountPercentage}%
                </span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="p-5">
            <h3 className="text-sm font-semibold text-black mb-1 group-hover:text-[#E30613] transition-colors">
              {product.title}
            </h3>
            {product.storage && (
              <p className="text-xs text-neutral-400 mb-2">{product.storage}</p>
            )}
            <div className="flex items-center justify-between">
              <div>
                {hasDiscount ? (
                  <div className="flex flex-col">
                    <span className="text-xs text-neutral-400 line-through">
                      {formatPrice(product.price)}
                    </span>
                    <span className="text-sm font-bold text-[#E30613]">
                      {formatPrice(discountedPrice)}
                    </span>
                  </div>
                ) : (
                  <p className="text-sm font-bold text-black">
                    {formatPrice(product.price)}
                  </p>
                )}
              </div>
              <button
                onClick={handleAddToCart}
                className="flex items-center justify-center w-10 h-10 bg-[#E30613] hover:bg-[#C00510] text-white rounded-xl transition-all duration-200 shadow-sm shadow-[#E30613]/20 hover:shadow-md hover:shadow-[#E30613]/30"
                title="Ajouter au panier"
              >
                <ShoppingBag className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export { formatPrice, getDiscountedPrice };
