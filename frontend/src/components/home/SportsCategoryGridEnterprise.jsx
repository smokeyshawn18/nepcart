import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Grid, ChevronRight, Zap, Trophy } from "lucide-react";

export function SportsCategoryGridEnterprise({
  categories,
  loadingCategories,
  FeaturedProductsComponent,
}) {
  const [selectedSport, setSelectedSport] = useState("All");

  return (
    <div className="space-y-8">
      {/* Main Layout: Dynamic Category Sidebar + Real Featured Products */}
      <div className="flex gap-8">
        {/* Categories Sidebar */}
        <aside className="hidden lg:block w-72 shrink-0">
          <div className="sticky top-24 rounded-2xl border border-base-content/10 bg-base-100 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-base-200 pb-3">
              <div className="flex items-center gap-2">
                <Grid className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-black uppercase tracking-wider text-base-content">
                  Categories
                </h3>
              </div>
              <span className="badge badge-primary badge-sm font-mono text-[10px]">
                Gear
              </span>
            </div>

            {loadingCategories ? (
              <div className="space-y-2">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="skeleton h-9 w-full rounded-xl"
                    aria-hidden
                  />
                ))}
              </div>
            ) : (
              <ul className="space-y-1">
                <li>
                  <Link
                    to="/catalog"
                    className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-bold text-primary hover:bg-primary/10 transition-colors"
                  >
                    <span>All Accessories</span>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </li>
                {categories.map((c) => (
                  <li key={c}>
                    <Link
                      to={`/catalog?category=${encodeURIComponent(c)}`}
                      className="group flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-semibold text-base-content/80 hover:bg-base-200 hover:text-base-content transition-all"
                    >
                      <span className="truncate">{c}</span>
                      <ChevronRight className="h-4 w-4 text-base-content/30 group-hover:translate-x-0.5 group-hover:text-base-content transition-all" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            {/* Custom Team Orders Callout */}
            <div className="rounded-xl bg-gradient-to-br from-primary/15 via-secondary/10 to-transparent p-4 border border-primary/20 space-y-2">
              <div className="flex items-center gap-1.5 text-primary font-bold text-xs uppercase tracking-wider">
                <Zap className="h-4 w-4" />
                <span>Bulk & Team Orders</span>
              </div>
              <p className="text-xs text-base-content/70 leading-relaxed">
                Outfitting a club or school team? Contact our team sales
                department for wholesale discounts.
              </p>
            </div>
          </div>
        </aside>

        {/* Real Featured Products Section */}
        <div className="flex-1 space-y-4">
          {/* Render passed component or fallback directly */}
          {FeaturedProductsComponent ? (
            <FeaturedProductsComponent selectedSport={selectedSport} />
          ) : null}
        </div>
      </div>
    </div>
  );
}
