import HeroSection from "@/components/client/hero-section";
import RepairSection from "@/components/client/repair-section";
import CategoryGrid from "@/components/client/category-grid";
import FeaturedProducts from "@/components/client/featured-products";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <RepairSection />
      <CategoryGrid />
      <FeaturedProducts />
    </>
  );
}
