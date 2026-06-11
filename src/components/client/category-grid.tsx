import Link from "next/link";
import { Smartphone, Watch, Headphones } from "lucide-react";

const categories = [
  {
    title: "iPhones",
    description: "Les derniers modèles Apple, neufs et reconditionnés",
    href: "/shop?category=iphone",
    icon: Smartphone,
  },
  {
    title: "Gadgets",
    description: "AirPods, Apple Watch, casques audio et plus",
    href: "/shop?category=gadget",
    icon: Watch,
  },
  {
    title: "Accessoires",
    description: "Coques, protège-écrans, chargeurs, câbles et bracelets",
    href: "/shop?category=accessoire",
    icon: Headphones,
  },
];

export default function CategoryGrid() {
  return (
    <section className="py-20 bg-[#F9F9F9]">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-2xl font-black tracking-tight text-black mb-2">
          Nos Catégories
        </h2>
        <p className="text-neutral-500 mb-10 font-light">
          Explorez notre sélection par catégorie
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.title}
              href={cat.href}
              className="group bg-white border border-neutral-100 rounded-2xl p-8 hover:border-[#E30613]/30 hover:shadow-lg hover:shadow-red-600/5 transition-all duration-300"
            >
              <cat.icon className="w-6 h-6 text-[#E30613] mb-4" />
              <h3 className="text-lg font-semibold text-black mb-1">
                {cat.title}
              </h3>
              <p className="text-sm text-neutral-500 font-light">{cat.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
