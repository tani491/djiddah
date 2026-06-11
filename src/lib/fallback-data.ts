type ProductFilters = {
  category?: string | null;
  subCategory?: string | null;
  storage?: string | null;
  condition?: string | null;
  color?: string | null;
  minPrice?: string | null;
  maxPrice?: string | null;
  search?: string | null;
  featured?: string | null;
};

type HeroSlideFilters = {
  activeOnly?: boolean;
};

export const fallbackProducts = [
  {
    id: "iphone-15-pro-max",
    title: "iPhone 15 Pro Max",
    description:
      "Le dernier flagship Apple avec puce A17 Pro, design en titane et systeme photo avance.",
    category: "iphone",
    subCategory: null,
    price: 1850000,
    discountPercentage: null,
    promoLabel: null,
    images: JSON.stringify(["/images/products/iphone15pro.png"]),
    storage: "256GB",
    batteryHealth: "100%",
    condition: "Neuf",
    color: "Noir Titane",
    inStock: true,
    featured: true,
    createdAt: new Date("2026-01-05T00:00:00.000Z"),
    updatedAt: new Date("2026-01-05T00:00:00.000Z"),
  },
  {
    id: "iphone-15",
    title: "iPhone 15",
    description:
      "Design en verre et aluminium, puce A16 Bionic, camera 48MP et USB-C.",
    category: "iphone",
    subCategory: null,
    price: 1150000,
    discountPercentage: null,
    promoLabel: null,
    images: JSON.stringify(["/images/products/iphone15.png"]),
    storage: "128GB",
    batteryHealth: "100%",
    condition: "Neuf",
    color: "Noir",
    inStock: true,
    featured: true,
    createdAt: new Date("2026-01-04T00:00:00.000Z"),
    updatedAt: new Date("2026-01-04T00:00:00.000Z"),
  },
  {
    id: "airpods-pro-2",
    title: "AirPods Pro 2",
    description:
      "Reduction de bruit active, audio spatial personnalise et boitier de charge USB-C.",
    category: "gadget",
    subCategory: null,
    price: 285000,
    discountPercentage: null,
    promoLabel: null,
    images: JSON.stringify(["/images/products/airpods.png"]),
    storage: null,
    batteryHealth: null,
    condition: "Neuf",
    color: "Blanc",
    inStock: true,
    featured: true,
    createdAt: new Date("2026-01-03T00:00:00.000Z"),
    updatedAt: new Date("2026-01-03T00:00:00.000Z"),
  },
  {
    id: "apple-watch-series-9",
    title: "Apple Watch Series 9",
    description:
      "Puce S9, ecran Retina lumineux, gestuelle Double Tap et suivi de sante avance.",
    category: "gadget",
    subCategory: null,
    price: 395000,
    discountPercentage: null,
    promoLabel: null,
    images: JSON.stringify(["/images/products/applewatch.png"]),
    storage: null,
    batteryHealth: null,
    condition: "Neuf",
    color: "Noir",
    inStock: true,
    featured: true,
    createdAt: new Date("2026-01-02T00:00:00.000Z"),
    updatedAt: new Date("2026-01-02T00:00:00.000Z"),
  },
  {
    id: "chargeur-magsafe",
    title: "Chargeur MagSafe",
    description:
      "Charge sans fil rapide et magnetique pour iPhone 12 et modeles ulterieurs.",
    category: "gadget",
    subCategory: null,
    price: 45000,
    discountPercentage: null,
    promoLabel: null,
    images: JSON.stringify(["/images/products/magsafe.png"]),
    storage: null,
    batteryHealth: null,
    condition: "Neuf",
    color: "Blanc",
    inStock: true,
    featured: false,
    createdAt: new Date("2026-01-01T00:00:00.000Z"),
    updatedAt: new Date("2026-01-01T00:00:00.000Z"),
  },
];

export const fallbackHeroSlides = [
  {
    id: "hero-iphone-15-pro-max",
    title: "iPhone 15 Pro Max",
    image: "/images/products/iphone15pro.png",
    alt: "iPhone 15 Pro Max",
    order: 0,
    active: true,
    createdAt: new Date("2026-01-01T00:00:00.000Z"),
    updatedAt: new Date("2026-01-01T00:00:00.000Z"),
  },
  {
    id: "hero-airpods-pro-2",
    title: "AirPods Pro 2",
    image: "/images/products/airpods.png",
    alt: "AirPods Pro 2",
    order: 1,
    active: true,
    createdAt: new Date("2026-01-01T00:00:00.000Z"),
    updatedAt: new Date("2026-01-01T00:00:00.000Z"),
  },
  {
    id: "hero-headphones",
    title: "Casque Audio",
    image: "/images/products/headphones.png",
    alt: "Casque Premium",
    order: 2,
    active: true,
    createdAt: new Date("2026-01-01T00:00:00.000Z"),
    updatedAt: new Date("2026-01-01T00:00:00.000Z"),
  },
  {
    id: "hero-apple-watch",
    title: "Apple Watch",
    image: "/images/products/applewatch.png",
    alt: "Apple Watch Series 9",
    order: 3,
    active: true,
    createdAt: new Date("2026-01-01T00:00:00.000Z"),
    updatedAt: new Date("2026-01-01T00:00:00.000Z"),
  },
];

export function getFallbackProducts(filters: ProductFilters = {}) {
  const minPrice = filters.minPrice ? Number.parseInt(filters.minPrice, 10) : null;
  const maxPrice = filters.maxPrice ? Number.parseInt(filters.maxPrice, 10) : null;
  const search = filters.search?.trim().toLowerCase();

  return fallbackProducts
    .filter((product) => {
      if (filters.category && filters.category !== "all" && product.category !== filters.category) {
        return false;
      }
      if (filters.subCategory && product.subCategory !== filters.subCategory) return false;
      if (filters.storage && product.storage !== filters.storage) return false;
      if (filters.condition && product.condition !== filters.condition) return false;
      if (filters.color && product.color !== filters.color) return false;
      if (filters.featured === "true" && !product.featured) return false;
      if (minPrice !== null && !Number.isNaN(minPrice) && product.price < minPrice) return false;
      if (maxPrice !== null && !Number.isNaN(maxPrice) && product.price > maxPrice) return false;
      if (search && !product.title.toLowerCase().includes(search)) return false;

      return true;
    })
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export function getFallbackProductById(id: string) {
  return fallbackProducts.find((product) => product.id === id) ?? null;
}

export function getFallbackHeroSlides(filters: HeroSlideFilters = {}) {
  return fallbackHeroSlides
    .filter((slide) => (filters.activeOnly ? slide.active : true))
    .sort((a, b) => a.order - b.order);
}

export function getFallbackHeroSlideById(id: string) {
  return fallbackHeroSlides.find((slide) => slide.id === id) ?? null;
}
