"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, SlidersHorizontal, X, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "@/components/client/product-card";
import { trackPageView } from "@/lib/analytics";

interface Product {
  id: string;
  title: string;
  description: string;
  category: string;
  subCategory?: string | null;
  price: number;
  discountPercentage?: number | null;
  promoLabel?: string | null;
  images: string;
  storage?: string | null;
  condition?: string | null;
  batteryHealth?: string | null;
  color?: string | null;
  inStock: boolean;
  featured: boolean;
}

const STORAGE_OPTIONS = ["64GB", "128GB", "256GB", "512GB", "1TB"];
const CONDITION_OPTIONS = ["Neuf", "Reconditionné"];
const COLOR_OPTIONS = [
  { value: "Noir", label: "Noir", swatch: "bg-black" },
  { value: "Blanc", label: "Blanc", swatch: "bg-white border border-neutral-300" },
  { value: "Bleu", label: "Bleu", swatch: "bg-blue-500" },
  { value: "Vert", label: "Vert", swatch: "bg-green-500" },
  { value: "Rouge", label: "Rouge", swatch: "bg-red-500" },
  { value: "Rose", label: "Rose", swatch: "bg-pink-400" },
  { value: "Violet", label: "Violet", swatch: "bg-purple-500" },
  { value: "Or", label: "Or", swatch: "bg-yellow-500" },
  { value: "Argent", label: "Argent", swatch: "bg-neutral-400" },
  { value: "Titane", label: "Titane", swatch: "bg-neutral-500" },
];

const CATEGORY_OPTIONS = [
  { value: "all", label: "Tous les produits" },
  { value: "iphone", label: "iPhones" },
  { value: "autre-marque-telephone", label: "Autre marque de téléphone" },
  { value: "gadget", label: "Gadgets" },
  { value: "accessoire", label: "Accessoires" },
];

const SUBCATEGORY_OPTIONS = [
  { value: "coque", label: "Coques" },
  { value: "protecteur", label: "Protège-écrans" },
  { value: "chargeur", label: "Chargeurs" },
  { value: "cable", label: "Câbles" },
  { value: "ecouteur", label: "Écouteurs" },
  { value: "bracelet", label: "Bracelets" },
  { value: "support", label: "Supports" },
  { value: "batterie", label: "Batteries externes" },
];

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Track page view once
  useEffect(() => {
    trackPageView("/shop");
  }, []);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(searchParams.get("category") || "all");
  const [subCategory, setSubCategory] = useState("");
  const [storage, setStorage] = useState("");
  const [condition, setCondition] = useState("");
  const [color, setColor] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (category && category !== "all") params.set("category", category);
    if (subCategory) params.set("subCategory", subCategory);
    if (storage) params.set("storage", storage);
    if (condition) params.set("condition", condition);
    if (color) params.set("color", color);
    if (search) params.set("search", search);

    try {
      const res = await fetch(`/api/products?${params.toString()}`);
      const data: unknown = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [category, subCategory, storage, condition, color, search]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const clearFilters = () => {
    setCategory("all");
    setSubCategory("");
    setStorage("");
    setCondition("");
    setColor("");
    setSearch("");
  };

  const hasActiveFilters = !!(category !== "all" || subCategory || storage || condition || color || search);

  return (
    <div className="pt-16">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="flex items-center justify-center w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 hover:text-neutral-900 transition-all duration-200 group"
              aria-label="Retour"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-200" />
            </button>
            <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">
              Boutique
            </h1>
          </div>
          <p className="text-neutral-500 mt-2">
            Explorez notre collection complète
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div id="filters" className="flex items-center gap-4 mb-8 scroll-mt-24">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-neutral-50 border border-neutral-100 rounded-xl text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-300 transition-colors"
            />
          </div>

          {/* Filter Toggle (mobile) */}
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="lg:hidden flex items-center gap-2 px-4 py-3 bg-neutral-50 border border-neutral-100 rounded-xl text-sm text-neutral-600 hover:border-neutral-300 transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filtres
          </button>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <FilterPanel
              category={category}
              setCategory={setCategory}
              subCategory={subCategory}
              setSubCategory={setSubCategory}
              storage={storage}
              setStorage={setStorage}
              condition={condition}
              setCondition={setCondition}
              color={color}
              setColor={setColor}
              clearFilters={clearFilters}
              hasActiveFilters={hasActiveFilters}
            />
          </aside>

          {/* Mobile Filters */}
          <AnimatePresence>
            {filtersOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="lg:hidden w-full mb-6 overflow-hidden"
              >
                <FilterPanel
                  category={category}
                  setCategory={setCategory}
                  subCategory={subCategory}
                  setSubCategory={setSubCategory}
                  storage={storage}
                  setStorage={setStorage}
                  condition={condition}
                  setCondition={setCondition}
                  color={color}
                  setColor={setColor}
                  clearFilters={clearFilters}
                  hasActiveFilters={hasActiveFilters}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Product Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-neutral-50 rounded-2xl aspect-square animate-pulse"
                  />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-neutral-400 mb-4">
                  Aucun produit trouvé
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-neutral-900 underline underline-offset-4 hover:text-neutral-600"
                  >
                    Réinitialiser les filtres
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterPanel({
  category,
  setCategory,
  subCategory,
  setSubCategory,
  storage,
  setStorage,
  condition,
  setCondition,
  color,
  setColor,
  clearFilters,
  hasActiveFilters,
}: {
  category: string;
  setCategory: (v: string) => void;
  subCategory: string;
  setSubCategory: (v: string) => void;
  storage: string;
  setStorage: (v: string) => void;
  condition: string;
  setCondition: (v: string) => void;
  color: string;
  setColor: (v: string) => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
}) {
  return (
    <div className="bg-neutral-50 rounded-2xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-neutral-900">Filtres</h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-xs text-neutral-500 hover:text-neutral-900 transition-colors flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            Effacer
          </button>
        )}
      </div>

      {/* Category */}
      <div>
        <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
          Catégorie
        </label>
        <div className="mt-2 flex flex-col gap-1.5">
          {CATEGORY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                setCategory(opt.value);
                setSubCategory("");
              }}
              className={`text-sm text-left px-3 py-2 rounded-lg transition-colors ${
                category === opt.value
                  ? "bg-neutral-900 text-white"
                  : "text-neutral-600 hover:bg-neutral-100"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sub-Category — only when "accessoire" is selected */}
      {category === "accessoire" && (
        <div>
          <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
            Type d&apos;accessoire
          </label>
          <div className="mt-2 flex flex-wrap gap-2">
            {SUBCATEGORY_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSubCategory(subCategory === opt.value ? "" : opt.value)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                  subCategory === opt.value
                    ? "bg-neutral-900 text-white border-neutral-900"
                    : "border-neutral-200 text-neutral-600 hover:border-neutral-400"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Color — only for iphones or accessories */}
      {(category === "iphone" || category === "autre-marque-telephone" || category === "all") && (
        <div>
          <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
            Couleur
          </label>
          <div className="mt-2 flex flex-wrap gap-2">
            {COLOR_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setColor(color === opt.value ? "" : opt.value)}
                title={opt.label}
                className={`relative w-7 h-7 rounded-full transition-all duration-200 flex items-center justify-center ${
                  color === opt.value
                    ? "ring-2 ring-offset-2 ring-[#E30613] scale-110"
                    : "hover:scale-110"
                }`}
              >
                <span className={`block w-5 h-5 rounded-full ${opt.swatch}`} />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Storage — only for iphones */}
      {(category === "iphone" || category === "autre-marque-telephone" || category === "all") && (
        <div>
          <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
            Stockage
          </label>
          <div className="mt-2 flex flex-wrap gap-2">
            {STORAGE_OPTIONS.map((opt) => (
              <button
                key={opt}
                onClick={() => setStorage(storage === opt ? "" : opt)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                  storage === opt
                    ? "bg-neutral-900 text-white border-neutral-900"
                    : "border-neutral-200 text-neutral-600 hover:border-neutral-400"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Condition */}
      <div>
        <label className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
          État
        </label>
        <div className="mt-2 flex flex-col gap-1.5">
          {CONDITION_OPTIONS.map((opt) => (
            <button
              key={opt}
              onClick={() => setCondition(condition === opt ? "" : opt)}
              className={`text-sm text-left px-3 py-2 rounded-lg transition-colors ${
                condition === opt
                  ? "bg-neutral-900 text-white"
                  : "text-neutral-600 hover:bg-neutral-100"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="pt-16 min-h-screen">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-neutral-50 rounded-2xl aspect-square animate-pulse"
                />
              ))}
            </div>
          </div>
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
