import { CatalogProductCard } from "../components/CatalogProductCard";
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
    setCategory,
  } = useHomeCatalog();

  return (
    <div className="space-y-12">
      <HomeHero categories={categories} loadingCategories={loadingCategories} />

      <TrustStrip />

      {/* CATELOG */}
      <section id="catolag" className="scroll-mt-24">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-base-content md:text-2xl uppercase font-mono">
              Catalog
            </h2>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className={`btn btn-sm ${!categoryFilter ? "btn-primary" : "btn-ghost border border-base-300"}`}
              onClick={() => setCategory("")}
            >
              All
            </button>

            {categoryChipsLoading
              ? [1, 2, 3, 4].map((i) => (
                  <div key={i} className="skeleton h-8 w-20 rounded-lg" aria-hidden />
                ))
              : categories.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={`btn btn-sm ${categoryFilter === c ? "btn-primary" : "btn-ghost border border-base-300"}`}
                    onClick={() => setCategory(c)}
                  >
                    {c}
                  </button>
                ))}
          </div>
        </div>

        {loadingList ? (
          <ul className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <li key={i}>
                <div className="skeleton h-96 w-full rounded-box" />
              </li>
            ))}
          </ul>
        ) : error ? (
          <PageError message="We couldn't load products. Please try again in a moment." />
        ) : products.length === 0 ? (
          <div className="rounded-box border border-base-300 bg-base-100 py-16 text-center text-base-content/60">
            No products in this category yet.
          </div>
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {products.map((p) => (
              <li key={p.id}>
                <CatalogProductCard product={p} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
export default HomePage;
