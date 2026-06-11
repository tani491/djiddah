"use client";

import { FavoritesProvider } from "@/contexts/favorites-context";
import { CartProvider } from "@/contexts/cart-context";
import Navbar from "@/components/client/navbar";
import Footer from "@/components/client/footer";
import FavoritesPanel from "@/components/client/favorites-panel";
import CartPanel from "@/components/client/cart-panel";
import WhatsAppFloat from "@/components/client/whatsapp-float";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FavoritesProvider>
      <CartProvider>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <FavoritesPanel />
        <CartPanel />
        <WhatsAppFloat />
      </CartProvider>
    </FavoritesProvider>
  );
}
