"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Store } from "lucide-react";

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

const DISPLAY_DURATION = 3000;
const TRANSITION_DURATION = 0.6;

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
  const [direction, setDirection] = useState(1);
  const [loading, setLoading] = useState(true);

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
        // Keep fallback slides.
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

  if (loading || !currentProduct) {
    return (
      <section className="relative flex min-h-[calc(100svh-4rem)] items-center overflow-hidden bg-white lg:min-h-[92vh]">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 px-4 py-16 pt-24 sm:px-6 sm:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(320px,480px)] lg:gap-12 lg:px-8 lg:py-24 lg:pt-28">
          <div>
            <p className="mb-6 text-xs font-semibold uppercase tracking-[0.3em] text-[#E30613]">
              Premium Tech Store
            </p>
            <h1 className="text-4xl font-black leading-[1.05] tracking-tight text-black sm:text-5xl md:text-6xl lg:text-7xl">
              Djiddah
              <br />
              <span className="text-neutral-300">&Eacute;lectronique</span>
            </h1>
          </div>
          <div className="flex w-full items-center justify-center">
            <div className="h-[min(58vh,440px)] w-full max-w-xs animate-pulse rounded-2xl bg-neutral-50 sm:h-[min(62vh,560px)] sm:max-w-sm lg:h-[620px] lg:max-w-96" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative flex min-h-[calc(100svh-4rem)] items-center overflow-hidden bg-white lg:min-h-[92vh]">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 px-4 py-16 pt-24 sm:px-6 sm:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(320px,480px)] lg:gap-12 lg:px-8 lg:py-24 lg:pt-28">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <p className="mb-6 text-xs font-semibold uppercase tracking-[0.3em] text-[#E30613]">
            Premium Tech Store
          </p>
          <h1 className="text-4xl font-black leading-[1.05] tracking-tight text-black sm:text-5xl md:text-6xl lg:text-7xl">
            Djiddah
            <br />
            <span className="text-neutral-300">&Eacute;lectronique</span>
          </h1>
          <p className="mt-6 max-w-xl text-base font-semibold leading-relaxed text-neutral-500 md:text-lg lg:max-w-md">
            Vente, accessoires et r&eacute;paration de t&eacute;l&eacute;phone.
            D&eacute;couvrez notre collection exclusive d&apos;iPhones et gadgets high-tech.
            Qualit&eacute; premium, prix comp&eacute;titifs, livraison &agrave; Dakar.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
            <Link
              href="/shop#filters"
              aria-label="Categorie"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#E30613] px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-[#E30613]/25 transition-all duration-300 hover:scale-[1.02] hover:bg-[#C00510] hover:shadow-xl hover:shadow-[#E30613]/35 sm:w-auto"
            >
              <span className="text-sm">Cat&eacute;gorie</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/shop"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-black px-8 py-4 text-sm font-semibold text-black transition-all duration-300 hover:bg-black hover:text-white sm:w-auto"
            >
              <Store className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
              Visiter la boutique
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative mx-auto flex w-full max-w-sm items-center justify-center sm:max-w-md lg:max-w-[28rem]"
        >
          <div className="relative mx-auto h-[min(58vh,440px)] w-full max-w-xs sm:h-[min(62vh,560px)] sm:max-w-sm lg:h-[620px] lg:max-w-96">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentProduct.id + "-halo"}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: TRANSITION_DURATION + 0.2, ease: "easeInOut" }}
                className="pointer-events-none absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full sm:h-72 sm:w-72 lg:h-80 lg:w-80"
                style={{
                  background:
                    "radial-gradient(circle, rgba(227,6,19,0.30) 0%, rgba(227,6,19,0.15) 40%, rgba(227,6,19,0) 70%)",
                  filter: "blur(50px)",
                }}
              />
            </AnimatePresence>

            <div
              className="relative flex h-full w-full items-center justify-center"
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
                    ease: [0.42, 0, 0.58, 1],
                  }}
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <div className="relative h-full w-full">
                    <Image
                      src={currentProduct.image}
                      alt={currentProduct.alt}
                      fill
                      className="rounded-2xl object-contain"
                      style={{
                        filter:
                          "drop-shadow(0 25px 50px rgba(227,6,19,0.25)) drop-shadow(0 10px 24px rgba(227,6,19,0.18)) drop-shadow(0 4px 8px rgba(227,6,19,0.12))",
                      }}
                      priority
                      sizes="(max-width: 640px) 80vw, (max-width: 1024px) 384px, 448px"
                    />
                  </div>
                </motion.div>
              </AnimatePresence>

              <div
                className="pointer-events-none absolute bottom-8 left-1/2 h-5 w-44 -translate-x-1/2 rounded-full sm:bottom-12 sm:w-56"
                style={{
                  background:
                    "radial-gradient(ellipse at center, rgba(227,6,19,0.25) 0%, rgba(227,6,19,0.10) 40%, rgba(0,0,0,0) 70%)",
                  filter: "blur(8px)",
                }}
              />
            </div>

            <AnimatePresence mode="wait">
              <motion.p
                key={currentProduct.id + "-label"}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="absolute -bottom-4 left-1/2 max-w-[90vw] -translate-x-1/2 truncate whitespace-nowrap text-xs font-semibold uppercase tracking-widest text-neutral-400 sm:-bottom-2"
              >
                {currentProduct.title}
              </motion.p>
            </AnimatePresence>

            {slides.length > 1 && (
              <div className="absolute bottom-[-52px] left-1/2 flex max-w-[90vw] -translate-x-1/2 items-center justify-center gap-2.5 overflow-hidden px-2">
                {slides.map((slide, i) => (
                  <button
                    key={slide.id}
                    onClick={() => {
                      setDirection(i > currentIndex ? 1 : -1);
                      setCurrentIndex(i);
                    }}
                    className="rounded-full transition-all duration-500"
                    aria-label={`Voir ${slide.title}`}
                  >
                    <span
                      className={`block rounded-full transition-all duration-500 ${
                        i === currentIndex
                          ? "h-2.5 w-8 bg-[#E30613] shadow-sm shadow-[#E30613]/40"
                          : "h-2.5 w-2.5 bg-neutral-300 hover:bg-neutral-400"
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
