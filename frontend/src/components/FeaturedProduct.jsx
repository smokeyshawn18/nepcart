import { useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  ArrowRight,
  Heart,
  ShoppingCart,
} from "lucide-react";
import { Link } from "react-router";
import { useFeaturedProducts } from "../hooks/useFeaturedProduct";

export default function FeaturedProducts() {
  const [page, setPage] = useState(1);
  const { products = [], hasMore, isLoading } = useFeaturedProducts(page, 5);

  const featured = products[0];
  const others = useMemo(() => products.slice(1), [products]);

  if (isLoading) {
    return (
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex justify-center py-20">
            <span className="loading loading-spinner loading-lg text-primary" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden bg-base-100 py-20">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />

      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-4 py-2 text-sm font-medium text-primary">
              <Star size={16} fill="currentColor" />
              Featured Collection
            </div>

            <h2 className="mt-4 text-3xl font-black tracking-tight md:text-5xl">
              Curated products with a
              <span className="block text-primary">premium feel</span>
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-base-content/65 md:text-base">
              Hand-picked items, cleaner layout, better balance, and smooth
              hover motion.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="btn btn-circle btn-ghost border border-base-300 transition hover:-translate-y-0.5 hover:bg-base-200"
            >
              <ChevronLeft size={18} />
            </button>

            <span className="flex h-10 min-w-10 items-center justify-center rounded-full border border-base-300 px-3 text-sm font-medium text-base-content/70">
              {page}
            </span>

            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={!hasMore}
              className="btn btn-circle btn-primary transition hover:-translate-y-0.5"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          {featured && (
            <Link
              to={`/product/${featured.slug}`}
              className="group overflow-hidden rounded-3xl bg-base-200 shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-2xl lg:col-span-6"
            >
              <div className="relative aspect-[10/12] overflow-hidden">
                <img
                  src={featured.imageUrl}
                  alt={featured.name}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                <div className="absolute left-5 top-5 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-base-content backdrop-blur">
                  Editor&apos;s choice
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 text-white md:p-8">
                  <h3 className="text-2xl font-bold md:text-4xl">
                    {featured.name}
                  </h3>
                  <p className="mt-3 max-w-lg text-sm leading-6 text-white/80 line-clamp-2 md:text-base">
                    {featured.description}
                  </p>

                  <div className="mt-6 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs text-white/60">Starting from</p>
                      <p className="text-2xl font-bold md:text-4xl">
                        NPR {(featured.priceCents / 100).toLocaleString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => e.preventDefault()}
                        className="btn btn-circle bg-white/90 text-base-content hover:bg-white"
                      >
                        <Heart size={18} />
                      </button>
                      <div className="btn btn-primary gap-2 rounded-2xl px-5">
                        Explore
                        <ArrowRight size={16} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          )}

          <div className="grid gap-6 sm:grid-cols-2 auto-rows-fr lg:col-span-6">
            {others.map((product) => (
              <Link
                to={`/product/${product.slug}`}
                key={product.id}
                className="group flex h-full flex-col overflow-hidden rounded-3xl border border-base-300 bg-base-100 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
                  <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-base-content backdrop-blur">
                    Curated
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center justify-between gap-3">
                    <span className="badge badge-success">Recommended</span>
                    <span className="text-sm font-bold text-primary">
                      NPR {(product.priceCents / 100).toLocaleString()}
                    </span>
                  </div>

                  <h4 className="mt-3 line-clamp-1 text-xl font-semibold text-base-content group-hover:text-primary">
                    {product.name}
                  </h4>

                  <p className="mt-2 line-clamp-2 flex-1 text-sm leading-6 text-base-content/65">
                    {product.description}
                  </p>

                  <div className="mt-5 flex items-center justify-between text-sm">
                    <span className="text-base-content/50">View details</span>
                    <ArrowRight
                      size={18}
                      className="text-primary transition group-hover:translate-x-1"
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
