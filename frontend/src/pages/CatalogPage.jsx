import { CatalogProductCard } from "../components/CatalogProductCard";
import { PageError } from "../components/PageError";
import { useHomeCatalog } from "../hooks/useHomeCatalog";
import ScrollToTop from "../lib/scroll";

export default function CatalogPage() {
  const {
    products,
    categories,
    categoryChipsLoading,
    categoryFilter,
    error,
    loadingList,
    isPlaceholderData,
    page,
    setPage,
    setCategory,
    hasMore,
  } = useHomeCatalog();

  return (
    <section className="container mx-auto px-4 py-12">
      <ScrollToTop />
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-base-content uppercase font-mono">
            Catalog
          </h2>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className={`btn btn-[20px] ${!categoryFilter ? "btn-primary" : "btn-ghost border border-base-300"}`}
            onClick={() => setCategory("")}
          >
            All
          </button>

          {categoryChipsLoading
            ? [1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="skeleton h-8 w-20 rounded-lg"
                  aria-hidden
                />
              ))
            : categories.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`btn btn-[40px] ${categoryFilter === c ? "btn-primary" : "btn-ghost border border-base-300"}`}
                  onClick={() => setCategory(c)}
                >
                  {c}
                </button>
              ))}
        </div>
      </div>

      {loadingList && !isPlaceholderData ? (
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
        <>
          <ul className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {products.map((p) => (
              <li key={p.id}>
                <CatalogProductCard product={p} />
              </li>
            ))}
          </ul>

          <div className="mt-8 flex items-center justify-center gap-3">
            <button
              type="button"
              className="btn btn-sm btn-ghost border border-base-300"
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </button>

            <span className="text-sm text-base-content/70">Page {page}</span>

            <button
              type="button"
              className="btn btn-sm btn-ghost border border-base-300"
              disabled={!hasMore}
              onClick={() => setPage(page + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}
    </section>
  );
}
