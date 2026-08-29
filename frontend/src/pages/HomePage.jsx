import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, TrendingUp } from "lucide-react";

import { useHomeCategory } from "../hooks/useHomeCategories";
import FeaturedProducts from "../components/FeaturedProduct";
import { TrustStrip } from "../components/TrustStrip";

import { SportsHeroEnterprise } from "../components/home/SportsHeroEnterprise";
import { SportsCategoryGridEnterprise } from "../components/home/SportsCategoryGridEnterprise";
import { SportsPerksAndNewsletterEnterprise } from "../components/home/SportsPerksAndNewsletterEnterprise";

export default function HomePage() {
  const { categories, loadingCategories } = useHomeCategory();

  return (
    <div className="container mx-auto px-4 py-8 space-y-14">
      {/* 1. Hero, Social Proof, and Flash Sales */}
      <SportsHeroEnterprise />

      {/* 2. Athletic Discipline Tabs & Product Flash Deals */}
      <SportsCategoryGridEnterprise
        categories={categories}
        loadingCategories={loadingCategories}
        FeaturedProductsComponent={FeaturedProducts}
      />

      {/* Merchant Verification & Partner Brands */}
      <TrustStrip />

      {/* Main Catalog Featured Products Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-base-200 pb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h2 className="text-xl sm:text-2xl font-black uppercase text-base-content tracking-tight">
              Trending Accessories & Gear
            </h2>
          </div>

          <Link
            to="/catalog"
            className="group inline-flex items-center gap-1 text-sm font-bold text-primary hover:underline"
          >
            <span>View All Catalog</span>
            <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* 3. Buying Guide, Value Perks, and VIP Newsletter */}
      <SportsPerksAndNewsletterEnterprise />
    </div>
  );
}
