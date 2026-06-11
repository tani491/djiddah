"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, ArrowLeft, Battery, HardDrive, Palette, Shield, ShoppingBag } from "lucide-react";
import { useFavorites } from "@/contexts/favorites-context";
import { useCart } from "@/contexts/cart-context";
import { trackProductView } from "@/lib/analytics";

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
  batteryHealth?: string | null;
  condition?: string | null;
  color?: string | null;
  inStock: boolean;
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("fr-FR").format(price) + " FCFA";
}

function getDiscountedPrice(price: number, discountPercentage?: number | null) {
  if (!discountPercentage) return price;
  return Math.round(price * (1 - discountPercentage / 100));
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const { isFavorite, addFavorite, removeFavorite, mounted: favMounted } = useFavorites();
  const { addToCart, setCartOpen, mounted: cartMounted } = useCart();

  useEffect(() => {
    if (params.id) {
      fetch(`/api/products/${params.id}`)
        .then((res) => res.json())
        .then((data) => {
          setProduct(data);
          setLoading(false);
          // Track product view
          if (data?.id && data?.title) {
            trackProductView(data.id, data.title);
          }
        })
        .catch(() => setLoading(false));
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="pt-16 min-h-screen">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-neutral-50 rounded-2xl aspect-square animate-pulse" />
            <div className="space-y-4">
              <div className="bg-neutral-50 h-8 w-3/4 rounded animate-pulse" />
              <div className="bg-neutral-50 h-6 w-1/2 rounded animate-pulse" />
              <div className="bg-neutral-50 h-20 w-full rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-neutral-400 mb-4">Produit non trouvé</p>
          <Link
            href="/shop"
            className="text-sm text-neutral-900 underline underline-offset-4"
          >
            Retour à la boutique
          </Link>
        </div>
      </div>
    );
  }

  const images = JSON.parse(product.images || "[]") as string[];
  const fav = favMounted ? isFavorite(product.id) : false;
  const hasDiscount = !!product.discountPercentage;
  const discountedPrice = getDiscountedPrice(product.price, product.discountPercentage);

  const handleFavorite = () => {
    if (fav) {
      removeFavorite(product.id);
    } else {
      addFavorite({
        id: product.id,
        title: product.title,
        price: discountedPrice,
        image: images[0] || "/images/placeholder.png",
        category: product.category,
      });
    }
  };

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      title: product.title,
      price: discountedPrice,
      image: images[0] || "/images/placeholder.png",
      category: product.category,
    });
    setCartOpen(true);
  };

  const priceForWhatsapp = hasDiscount ? discountedPrice : product.price;
  const whatsappMsg = `Bonjour Djidah Electrique, je suis intéressé par l'article ${product.title} au prix de ${formatPrice(priceForWhatsapp)}.`;
  const whatsappLink = `https://wa.me/221781131340?text=${encodeURIComponent(whatsappMsg)}`;

  const specs = [
    { icon: HardDrive, label: "Stockage", value: product.storage },
    { icon: Battery, label: "Batterie", value: product.batteryHealth },
    { icon: Palette, label: "Couleur", value: product.color },
    { icon: Shield, label: "État", value: product.condition },
  ].filter((s) => s.value);

  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Back */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900 transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-200" />
          Retour
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative aspect-square bg-neutral-50 rounded-2xl overflow-hidden mb-4">
              <Image
                src={images[selectedImage] || "/images/placeholder.png"}
                alt={product.title}
                fill
                className="object-contain p-8"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              {/* Promo Badge */}
              {hasDiscount && (
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.promoLabel && (
                    <span className="px-3 py-1.5 bg-[#E30613] text-white text-xs font-bold rounded-full uppercase tracking-wide">
                      {product.promoLabel}
                    </span>
                  )}
                  <span className="px-3 py-1.5 bg-black text-white text-xs font-bold rounded-full">
                    -{product.discountPercentage}%
                  </span>
                </div>
              )}
              {/* Condition Badge — only if no discount */}
              {product.condition && !hasDiscount && (
                <span className="absolute top-4 left-4 px-3 py-1.5 bg-[#E30613] text-white text-xs font-semibold rounded-full">
                  {product.condition}
                </span>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-3">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`relative w-20 h-20 bg-neutral-50 rounded-xl overflow-hidden border-2 transition-colors ${
                      selectedImage === i
                        ? "border-neutral-900"
                        : "border-transparent hover:border-neutral-300"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.title} ${i + 1}`}
                      fill
                      className="object-contain p-2"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col"
          >
            <p className="text-xs font-medium tracking-widest text-neutral-400 uppercase mb-2">
              {product.category === "iphone" ? "iPhone" : "Gadget & Accessoire"}
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 mb-3">
              {product.title}
            </h1>
            <div className="mb-6">
              {hasDiscount ? (
                <div className="flex items-center gap-4">
                  <span className="text-lg text-neutral-400 line-through">
                    {formatPrice(product.price)}
                  </span>
                  <span className="text-2xl font-semibold text-[#E30613]">
                    {formatPrice(discountedPrice)}
                  </span>
                  <span className="px-2.5 py-1 bg-[#E30613] text-white text-xs font-bold rounded-full">
                    -{product.discountPercentage}%
                  </span>
                </div>
              ) : (
                <p className="text-2xl font-semibold text-neutral-900">
                  {formatPrice(product.price)}
                </p>
              )}
            </div>

            {/* Description */}
            <p className="text-neutral-500 leading-relaxed mb-8">
              {product.description}
            </p>

            {/* Specs Grid */}
            {specs.length > 0 && (
              <div className="grid grid-cols-2 gap-4 mb-8">
                {specs.map((spec) => (
                  <div
                    key={spec.label}
                    className="bg-neutral-50 rounded-xl p-4"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <spec.icon className="w-4 h-4 text-neutral-400" />
                      <span className="text-xs text-neutral-400">
                        {spec.label}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-neutral-900">
                      {spec.value}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="mt-auto flex flex-col gap-3">
              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 bg-black text-white text-sm font-semibold rounded-full hover:bg-neutral-800 transition-colors duration-200"
              >
                <ShoppingBag className="w-5 h-5" />
                Ajouter au panier
              </button>

              {/* WhatsApp */}
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#E30613] text-white text-sm font-semibold rounded-full hover:bg-[#C00510] transition-colors duration-200 shadow-lg shadow-red-600/20"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Acheter via WhatsApp
              </a>
              <button
                onClick={handleFavorite}
                className={`w-full inline-flex items-center justify-center gap-2 px-8 py-4 border-2 text-sm font-semibold rounded-full transition-all duration-200 ${
                  fav
                    ? "border-[#E30613] text-[#E30613] bg-red-50"
                    : "border-black text-black hover:bg-black hover:text-white"
                }`}
              >
                <Heart
                  className={`w-4 h-4 ${
                    fav ? "fill-[#E30613] text-[#E30613]" : ""
                  }`}
                />
                {fav ? "Dans vos favoris" : "Ajouter aux favoris"}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
