import { CatalogProductCard } from "../components/CatalogProductCard";
import FeaturedProducts from "../components/FeaturedProduct";
import { HomeHero } from "../components/HomeHero";
import { PageError } from "../components/PageError";
import { TrustStrip } from "../components/TrustStrip";
import { useHomeCatalog } from "../hooks/useHomeCatalog";

function HomePage() {
  const {
    products,
    categories,
    categoryChipsLoading,
    categoryFilter,
    error,
    loadingCategories,
    loadingList,
    isPlaceholderData,
    page,
    setPage,
    setCategory,
    hasMore,
  } = useHomeCatalog();

  return (
    <div className="space-y-12">
      <HomeHero categories={categories} loadingCategories={loadingCategories} />
      <TrustStrip />

      <FeaturedProducts />
    </div>
  );
}

export default HomePage;
