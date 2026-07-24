import { CatalogProductCard } from "../components/CatalogProductCard";
import FeaturedProducts from "../components/FeaturedProduct";
import { HomeHero } from "../components/HomeHero";
import { PageError } from "../components/PageError";
import { TrustStrip } from "../components/TrustStrip";
import { useHomeCategory } from "../hooks/useHomeCategories";

function HomePage() {
  const { categories, loadingCategories } = useHomeCategory();

  return (
    <div className="space-y-12">
      <HomeHero categories={categories} loadingCategories={loadingCategories} />
      <TrustStrip />

      <FeaturedProducts />
    </div>
  );
}

export default HomePage;
