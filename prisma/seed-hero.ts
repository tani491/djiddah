import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const hashedPassword = await hash("admin123", 12);
  await prisma.adminUser.upsert({
    where: { email: "admin@djidahelectrique.com" },
    update: {},
    create: {
      email: "admin@djidahelectrique.com",
      password: hashedPassword,
      name: "Admin Djidah",
    },
  });

  // Create products
  const products = [
    {
      title: "iPhone 15 Pro Max",
      description: "Le dernier flagship d'Apple avec puce A17 Pro, design en titane et système de caméra avancé. Expérience smartphone ultime avec écran Super Retina XDR de 6,7 pouces.",
      category: "iphone",
      price: 1850000,
      images: JSON.stringify(["/images/products/iphone15pro.png"]),
      storage: "256GB",
      batteryHealth: "100%",
      condition: "Neuf",
      color: "Noir Titane",
      inStock: true,
      featured: true,
    },
    {
      title: "iPhone 15 Pro",
      description: "Puce A17 Pro, design en titane et caméra pro de 48MP. L'iPhone le plus puissant dans un format compact avec écran de 6,1 pouces.",
      category: "iphone",
      price: 1550000,
      images: JSON.stringify(["/images/products/iphone15pro.png"]),
      storage: "128GB",
      batteryHealth: "100%",
      condition: "Neuf",
      color: "Noir Titane",
      inStock: true,
      featured: true,
    },
    {
      title: "iPhone 15",
      description: "Design en verre et aluminium, puce A16 Bionic, caméra 48MP et USB-C. Le meilleur rapport qualité-prix de la gamme iPhone 15.",
      category: "iphone",
      price: 1150000,
      images: JSON.stringify(["/images/products/iphone15.png"]),
      storage: "128GB",
      batteryHealth: "100%",
      condition: "Neuf",
      color: "Noir",
      inStock: true,
      featured: true,
    },
    {
      title: "iPhone 14 Pro Max",
      description: "Écran Always-On, Dynamic Island, caméra 48MP et puce A16 Bionic. Performance et autonomie exceptionnelles au quotidien.",
      category: "iphone",
      price: 1350000,
      images: JSON.stringify(["/images/products/iphone14pro.png"]),
      storage: "256GB",
      batteryHealth: "96%",
      condition: "Reconditionné",
      color: "Blanc Argent",
      inStock: true,
      featured: false,
    },
    {
      title: "iPhone 14",
      description: "Puce A15 Bionic, caméra double 12MP, design plat et couleur vive. Un smartphone fiable et performant pour tous les usages.",
      category: "iphone",
      price: 850000,
      images: JSON.stringify(["/images/products/iphone14.png"]),
      storage: "128GB",
      batteryHealth: "94%",
      condition: "Reconditionné",
      color: "Bleu Nuit",
      inStock: true,
      featured: false,
    },
    {
      title: "iPhone 13 Pro",
      description: "Caméra pro avec mode macro, écran ProMotion 120Hz et puce A15 Bionic. Le choix des professionnels exigeants.",
      category: "iphone",
      price: 780000,
      images: JSON.stringify(["/images/products/iphone13pro.png"]),
      storage: "256GB",
      batteryHealth: "91%",
      condition: "Reconditionné",
      color: "Noir Sidéral",
      inStock: true,
      featured: false,
    },
    {
      title: "iPhone 13",
      description: "Puce A15 Bionic, double caméra diagonale et autonomie améliorée. Performance et fiabilité à un prix accessible.",
      category: "iphone",
      price: 580000,
      images: JSON.stringify(["/images/products/iphone13.png"]),
      storage: "128GB",
      batteryHealth: "89%",
      condition: "Reconditionné",
      color: "Rouge",
      inStock: true,
      featured: false,
    },
    {
      title: "AirPods Pro 2ème génération",
      description: "Réduction de bruit active adaptative, audio spatial personnalisé et boîtier de charge USB-C avec haut-parleur intégré.",
      category: "gadget",
      price: 285000,
      images: JSON.stringify(["/images/products/airpods.png"]),
      storage: null,
      batteryHealth: null,
      condition: "Neuf",
      color: "Blanc",
      inStock: true,
      featured: true,
    },
    {
      title: "Apple Watch Series 9",
      description: "Puce S9, écran Retina plus lumineux, gestuelle Double Tap et suivi de santé avancé. Votre santé au poignet.",
      category: "gadget",
      price: 395000,
      images: JSON.stringify(["/images/products/applewatch.png"]),
      storage: null,
      batteryHealth: null,
      condition: "Neuf",
      color: "Noir",
      inStock: true,
      featured: true,
    },
    {
      title: "Chargeur MagSafe",
      description: "Charge sans fil rapide et magnétique pour iPhone 12 et ultérieurs. Alignement parfait garanti à chaque utilisation.",
      category: "gadget",
      price: 45000,
      images: JSON.stringify(["/images/products/magsafe.png"]),
      storage: null,
      batteryHealth: null,
      condition: "Neuf",
      color: "Blanc",
      inStock: true,
      featured: false,
    },
    {
      title: "Coque Cuir Premium iPhone 15 Pro",
      description: "Cuir européen authentique avec finition douce au toucher, protection magnétique et boutons en métal. Élégance et protection.",
      category: "gadget",
      price: 35000,
      images: JSON.stringify(["/images/products/coque.png"]),
      storage: null,
      batteryHealth: null,
      condition: "Neuf",
      color: "Noir",
      inStock: true,
      featured: false,
    },
  ];

  for (const product of products) {
    await prisma.product.create({ data: product });
  }

  // Create hero slides
  const heroSlides = [
    {
      title: "iPhone 15 Pro Max",
      image: "/images/products/iphone15pro.png",
      alt: "iPhone 15 Pro Max",
      order: 0,
      active: true,
    },
    {
      title: "AirPods Pro 2",
      image: "/images/products/airpods.png",
      alt: "AirPods Pro 2",
      order: 1,
      active: true,
    },
    {
      title: "Casque Audio",
      image: "/images/products/headphones.png",
      alt: "Casque Premium",
      order: 2,
      active: true,
    },
    {
      title: "Apple Watch",
      image: "/images/products/applewatch.png",
      alt: "Apple Watch Series 9",
      order: 3,
      active: true,
    },
  ];

  for (const slide of heroSlides) {
    await prisma.heroSlide.create({ data: slide });
  }

  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
