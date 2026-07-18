import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useFeaturedProducts } from "../hooks/useFeaturedProduct";
import { FeaturedCoverflow } from "./FeaturedCoverOverflow";

export default function FeaturedProducts() {
  const [page, setPage] = useState(1);
  const { products = [], hasMore, isLoading } = useFeaturedProducts(page, 5);

  // Take up to 5 products as slides
  const featuredSlides = useMemo(
    () =>
      products.slice(0, 5).map((p) => ({
        id: p.id,
        imageUrl: p.imageUrl,
        name: p.name,
        description: p.description,
        priceCents: p.priceCents,
        slug: p.slug,
      })),
    [products],
  );

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
        {/* Header + pagination */}
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
              Hand-picked items with smooth 3D coverflow interaction.
            </p>
            <span className="mt-3 max-w-xl text-sm leading-6 text-base-content/65 md:text-base">
              Click on a product to view details and click on other products to
              navigate.
            </span>
          </div>
          {/* 
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
          </div> */}
        </div>

        {/* Single coverflow section */}
        <div className="rounded-3xl bg-base-200 shadow-lg px-4 py-8 flex justify-center">
          <FeaturedCoverflow
            slides={featuredSlides}
            cardWidth={400}
            cardHeight={400}
            radius={3}
            tilt={12}
            sideTilt={8}
            gap={8}
            opacity={60}
            autoplay={false}
            autoplayDirection="rightToLeft"
            showTitle={true}
            titleFont={{
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: "22px",
              letterSpacing: "-0.02em",
              lineHeight: "1.1em",
            }}
            titleColor="#ffffff"
            titlePosition={{
              position: "bottomLeft",
              paddingLeft: 22,
              paddingRight: 22,
              paddingTop: 24,
              paddingBottom: 24,
            }}
          />
        </div>
      </div>
    </section>
  );
}
