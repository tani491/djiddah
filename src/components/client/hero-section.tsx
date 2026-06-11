"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Store } from "lucide-react";

// Fallback slides if API fails
const FALLBACK_SLIDES = [
  {
    id: "fallback-iphone",
    title: "iPhone 15 Pro Max",
    image: "/images/products/iphone15pro.png",
    alt: "iPhone 15 Pro Max",
  },
  {
    id: "fallback-airpods",
    title: "AirPods Pro 2",
    image: "/images/products/airpods.png",
    alt: "AirPods Pro 2",
  },
  {
    id: "fallback-headphones",
    title: "Casque Audio",
    image: "/images/products/headphones.png",
    alt: "Casque Premium",
  },
  {
    id: "fallback-watch",
    title: "Apple Watch",
    image: "/images/products/applewatch.png",
    alt: "Apple Watch Series 9",
  },
];

interface HeroSlideData {
  id: string;
  title: string;
  image: string;
  alt: string;
}

const DISPLAY_DURATION = 3000; // 3 seconds per product
const TRANSITION_DURATION = 0.6; // 0.6 second transition

// Slide & Fade variants
const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 120 : -120,
    opacity: 0,
    scale: 0.95,
    rotateY: direction > 0 ? 6 : -6,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    rotateY: 0,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -80 : 80,
    opacity: 0,
    scale: 0.97,
    rotateY: direction > 0 ? -4 : 4,
  }),
};

export default function HeroSection() {
  const [slides, setSlides] = useState<HeroSlideData[]>(FALLBACK_SLIDES);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = forward
  const [loading, setLoading] = useState(true);

  // Fetch slides from API
  useEffect(() => {
    fetch("/api/hero-slides?active=true")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setSlides(
            data.map((s: { id: string; title: string; image: string; alt: string }) => ({
              id: s.id,
              title: s.title,
              image: s.image,
              alt: s.alt,
            }))
          );
        }
      })
      .catch(() => {
        // Keep fallback slides
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const goToNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(goToNext, DISPLAY_DURATION);
    return () => clearInterval(interval);
  }, [goToNext, slides.length]);

  const currentProduct = slides[currentIndex];

  // Don't render carousel until slides are loaded
  if (loading || !currentProduct) {
    return (
      <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-20 pt-28">
          <div>
            <p className="text-xs font-semibold tracking-[0.3em] text-[#E30613] uppercase mb-6">
              Premium Tech Store
            </p>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-black leading-[1.05]">
              Djiddah
              <br />
              <span className="text-neutral-300">&Eacute;lectronique</span>
            </h1>
          </div>
          <div className="flex items-center justify-center">
            <div className="w-80 h-[560px] md:w-96 md:h-[620px] animate-pulse bg-neutral-50 rounded-2xl" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-20 pt-28">
        {/* Left: Copy */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <p className="text-xs font-semibold tracking-[0.3em] text-[#E30613] uppercase mb-6">
            Premium Tech Store
          </p>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-black leading-[1.05]">
            Djiddah
            <br />
            <span className="text-neutral-300">&Eacute;lectronique</span>
          </h1>
          <p className="mt-6 text-base md:text-lg text-neutral-500 leading-relaxed max-w-md font-semibold">
            Vente, accessoires et r&eacute;paration de t&eacute;l&eacute;phone.
            D&eacute;couvrez notre collection exclusive d&apos;iPhones et gadgets high-tech.
            Qualit&eacute; premium, prix comp&eacute;titifs, livraison &agrave; Dakar.
          </p>
          <div className="mt-10 flex items-center gap-4 flex-wrap">
            {/* Primary CTA â€” Red accent */}
            <Link
              href="/shop#filters"
              aria-label="Categorie"
              className="group inline-flex items-center gap-2 px-8 py-4 bg-[#E30613] text-white text-sm font-semibold rounded-full hover:bg-[#C00510] transition-all duration-300 shadow-lg shadow-[#E30613]/25 hover:shadow-xl hover:shadow-[#E30613]/35 hover:scale-[1.02]"
            >
              <span className="text-sm">Cat&eacute;gorie</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
            </Link>
            <Link
              href="/shop"
              className="group inline-flex items-center gap-2 px-8 py-4 border-2 border-black text-black text-sm font-semibold rounded-full hover:bg-black hover:text-white transition-all duration-300"
            >
              <Store className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
              Visiter la boutique
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
            </Link>
          </div>
        </motion.div>

        {/* Right: Premium Product Carousel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative flex items-center justify-center"
        >
          <div className="relative w-80 h-[560px] md:w-96 md:h-[620px]">
            {/* Red Halo â€” soft, blurred circle behind the product */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentProduct.id + "-halo"}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: TRANSITION_DURATION + 0.2, ease: "easeInOut" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 md:w-80 md:h-80 rounded-full pointer-events-none"
                style={{
                  background: "radial-gradient(circle, rgba(227,6,19,0.30) 0%, rgba(227,6,19,0.15) 40%, rgba(227,6,19,0) 70%)",
                  filter: "blur(50px)",
                }}
              />
            </AnimatePresence>

            {/* Product display area â€” no background, transparent images */}
            <div
              className="relative w-full h-full flex items-center justify-center"
              style={{ perspective: 1200 }}
            >
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={currentProduct.id}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    duration: TRANSITION_DURATION,
                    ease: [0.42, 0, 0.58, 1], // smooth ease-in-out cubic-bezier
                  }}
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={currentProduct.image}
                      alt={currentProduct.alt}
                      fill
                      className="object-contain rounded-2xl"
                      style={{
                        filter: "drop-shadow(0 25px 50px rgba(227,6,19,0.25)) drop-shadow(0 10px 24px rgba(227,6,19,0.18)) drop-shadow(0 4px 8px rgba(227,6,19,0.12))",
                      }}
                      priority
                      sizes="(max-width: 768px) 320px, 384px"
                    />
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Soft diffuse shadow on the ground â€” reddish tint */}
              <div
                className="absolute bottom-12 left-1/2 -translate-x-1/2 w-56 h-5 rounded-full pointer-events-none"
                style={{
                  background: "radial-gradient(ellipse at center, rgba(227,6,19,0.25) 0%, rgba(227,6,19,0.10) 40%, rgba(0,0,0,0) 70%)",
                  filter: "blur(8px)",
                }}
              />
            </div>

            {/* Product label below */}
            <AnimatePresence mode="wait">
              <motion.p
                key={currentProduct.id + "-label"}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-xs font-semibold tracking-widest text-neutral-400 uppercase whitespace-nowrap"
              >
                {currentProduct.title}
              </motion.p>
            </AnimatePresence>

            {/* Carousel indicators â€” Red accent for active dot */}
            {slides.length > 1 && (
              <div className="absolute bottom-[-48px] left-1/2 -translate-x-1/2 flex items-center gap-2.5">
                {slides.map((slide, i) => (
                  <button
                    key={slide.id}
                    onClick={() => {
                      setDirection(i > currentIndex ? 1 : -1);
                      setCurrentIndex(i);
                    }}
                    className="transition-all duration-500 rounded-full"
                    aria-label={`Voir ${slide.title}`}
                  >
                    <span
                      className={`block rounded-full transition-all duration-500 ${
                        i === currentIndex
                          ? "w-8 h-2.5 bg-[#E30613] shadow-sm shadow-[#E30613]/40"
                          : "w-2.5 h-2.5 bg-neutral-300 hover:bg-neutral-400"
                      }`}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
