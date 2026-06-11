"use client";

import { useEffect, useState } from "react";
import ProductCard from "./product-card";

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

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products?featured=true");
        const data: unknown = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 mb-2">
          Produits en Vedette
        </h2>
        <p className="text-neutral-500 mb-10">
          Notre sélection des meilleurs articles du moment
        </p>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-neutral-50 rounded-2xl aspect-square animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
