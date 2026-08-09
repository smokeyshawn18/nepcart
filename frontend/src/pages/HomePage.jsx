import { Link } from "react-router-dom";
import FeaturedProducts from "../components/FeaturedProduct";
import { HomeHero } from "../components/HomeHero";
import { TrustStrip } from "../components/TrustStrip";
import { useHomeCategory } from "../hooks/useHomeCategories";

function CategorySidebar({ categories, loadingCategories }) {
  return (
    <aside className="hidden lg:block w-64 shrink-0">
      <div className="sticky top-24 rounded-box border border-base-300 bg-base-100 p-4">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-base-content/60 font-mono">
          Categories
        </h3>

        {loadingCategories ? (
          <div className="space-y-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="skeleton h-8 w-full rounded-lg"
                aria-hidden
              />
            ))}
          </div>
        ) : (
          <ul className="space-y-1">
            <li>
              <Link
                to="/catalog"
                className="flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-base-content hover:bg-base-200 transition-colors"
              >
                All Products
                <span className="text-base-content/40">→</span>
              </Link>
            </li>
            {categories.map((c) => (
              <li key={c}>
                <Link
                  to={`/catalog?category=${encodeURIComponent(c)}`}
                  className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-base-content/80 hover:bg-base-200 hover:text-base-content transition-colors"
                >
                  {c}
                </Link>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-6 rounded-box bg-primary/10 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary font-mono">
            Limited Time
          </p>
          <p className="mt-1 text-sm text-base-content/80">
            Free shipping on orders over $50
          </p>
        </div>
      </div>
    </aside>
  );
}

function MobileCategoryChips({ categories, loadingCategories }) {
  return (
    <div className="lg:hidden -mx-4 px-4 flex gap-2 overflow-x-auto pb-2">
      <Link
        to="/catalog"
        className="btn btn-sm btn-ghost border border-base-300 shrink-0"
      >
        All
      </Link>
      {loadingCategories
        ? [1, 2, 3].map((i) => (
            <div
              key={i}
              className="skeleton h-8 w-20 rounded-lg shrink-0"
              aria-hidden
            />
          ))
        : categories.map((c) => (
            <Link
              key={c}
              to={`/catalog?category=${encodeURIComponent(c)}`}
              className="btn btn-sm btn-ghost border border-base-300 shrink-0"
            >
              {c}
            </Link>
          ))}
    </div>
  );
}

function PromoBanner() {
  return (
    <div className="relative overflow-hidden rounded-box bg-gradient-to-br from-primary to-secondary p-8 text-primary-content">
      <div className="relative z-10 max-w-md">
        <p className="text-xs font-bold uppercase tracking-widest opacity-80 font-mono">
          New Arrivals
        </p>
        <h3 className="mt-2 text-2xl font-bold">
          Season's freshest picks, just landed
        </h3>
        <p className="mt-2 text-sm opacity-90">
          Hand-picked styles curated for you this week.
        </p>
        <Link
          to="/catalog"
          className="btn btn-sm bg-base-100 text-base-content border-none mt-4"
        >
          Shop Now
        </Link>
      </div>
      <div
        className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-base-100/10"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-16 right-16 h-40 w-40 rounded-full bg-base-100/10"
        aria-hidden
      />
    </div>
  );
}

function PerkStrip() {
  const perks = [
    { icon: "🚚", title: "Free Shipping", desc: "On orders over $50" },
    { icon: "↩️", title: "Easy Returns", desc: "30-day return window" },
    { icon: "🔒", title: "Secure Checkout", desc: "256-bit encryption" },
    { icon: "💬", title: "24/7 Support", desc: "We're here to help" },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {perks.map((p) => (
        <div
          key={p.title}
          className="flex flex-col items-center gap-1 rounded-box border border-base-300 bg-base-100 p-4 text-center"
        >
          <span className="text-2xl">{p.icon}</span>
          <span className="text-sm font-semibold text-base-content">
            {p.title}
          </span>
          <span className="text-xs text-base-content/60">{p.desc}</span>
        </div>
      ))}
    </div>
  );
}

function NewsletterSignup() {
  return (
    <div className="rounded-box border border-base-300 bg-base-200 p-8 text-center">
      <h3 className="text-xl font-bold text-base-content uppercase font-mono">
        Stay in the loop
      </h3>
      <p className="mt-2 text-sm text-base-content/70">
        Get new arrivals and exclusive deals straight to your inbox.
      </p>
      <form
        className="mt-4 mx-auto flex max-w-sm gap-2"
        onSubmit={(e) => e.preventDefault()}
      >
        <input
          type="email"
          required
          placeholder="you@example.com"
          className="input input-bordered w-full"
        />
        <button type="submit" className="btn btn-primary shrink-0">
          Subscribe
        </button>
      </form>
    </div>
  );
}

function HomePage() {
  const { categories, loadingCategories } = useHomeCategory();

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      <HomeHero categories={categories} loadingCategories={loadingCategories} />

      <div className="flex gap-8">
        <CategorySidebar
          categories={categories}
          loadingCategories={loadingCategories}
        />

        <div className="min-w-0 flex-1 space-y-12">
          <MobileCategoryChips
            categories={categories}
            loadingCategories={loadingCategories}
          />

          <PromoBanner />

          <TrustStrip />

          <section>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-base-content uppercase font-mono">
                Featured Products
              </h2>
              <Link to="/catalog" className="btn btn-sm btn-ghost">
                View all →
              </Link>
            </div>
            <FeaturedProducts />
          </section>

          <PerkStrip />

          <NewsletterSignup />
        </div>
      </div>
    </div>
  );
}

export default HomePage;
