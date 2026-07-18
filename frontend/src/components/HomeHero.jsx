import { Link } from "react-router";
import {
  ArrowRightIcon,
  BadgeCheckIcon,
  TrophyIcon,
  FlameIcon,
  SparklesIcon,
} from "lucide-react";

export function HomeHero({ categories, loadingCategories }) {
  return (
    <section className="relative overflow-hidden rounded-box border border-base-300 bg-gradient-to-br from-base-100 via-base-100 to-primary/10 shadow-xl">
      <div
        className="absolute -left-10 top-10 h-40 w-40 rounded-full bg-secondary/20 blur-3xl"
        aria-hidden
      />
      <div
        className="absolute right-0 top-0 h-72 w-72 translate-x-1/4 -translate-y-1/4 rounded-full bg-primary/15 blur-3xl"
        aria-hidden
      />

      <div className="relative grid gap-10 p-6 md:grid-cols-2 md:items-center md:p-10 lg:p-14">
        <div className="text-left">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <FlameIcon className="size-3.5" aria-hidden />
            Trending jerseys, retro kits, football gear, cricket essentials
          </div>

          <h1 className="max-w-xl text-4xl font-black tracking-tight text-base-content md:text-5xl lg:text-6xl">
            Gear up for the{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              game
            </span>
            .
          </h1>

          <p className="mt-4 max-w-lg text-base leading-relaxed text-base-content/70 md:text-lg">
            Shop Nepal-ready sportswear, football jerseys, retro kits, cricket
            gear, and match-day accessories built for fans, players, and
            everyday training.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#catalog" className="btn btn-primary gap-2 shadow-md">
              Shop catalog
              <ArrowRightIcon className="size-4" aria-hidden />
            </a>

            <Link to="/cart" className="btn btn-outline btn-primary">
              View cart
            </Link>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {["Jerseys", "Retro Kits", "Football", "Cricket", "Sportswear"].map(
              (item) => (
                <span
                  key={item}
                  className="rounded-full border border-base-300 bg-base-100 px-3 py-1 text-xs font-medium text-base-content/70"
                >
                  {item}
                </span>
              ),
            )}
          </div>
        </div>

        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-box border border-base-300 bg-base-100/90 p-4 shadow-sm">
              <div className="flex items-center gap-2 text-sm font-medium text-base-content/70">
                <TrophyIcon className="size-4 text-primary" aria-hidden />
                Categories
              </div>
              <div className="mt-2 text-3xl font-bold text-base-content">
                {loadingCategories ? (
                  <span
                    className="skeleton inline-block h-8 w-10 rounded"
                    aria-hidden
                  />
                ) : (
                  categories.length
                )}
              </div>
              <div className="mt-1 text-xs text-base-content/50">
                Curated sports collections
              </div>
            </div>

            <div className="rounded-box border border-base-300 bg-base-100/90 p-4 shadow-sm">
              <div className="flex items-center gap-2 text-sm font-medium text-base-content/70">
                <BadgeCheckIcon className="size-4 text-secondary" aria-hidden />
                Nepal-ready
              </div>
              <div className="mt-2 text-3xl font-bold text-base-content">
                NPR
              </div>
              <div className="mt-1 text-xs text-base-content/50">
                Local catalog pricing
              </div>
            </div>
          </div>

          <div className="rounded-box border border-dashed border-primary/30 bg-primary/5 p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-base-content">
              <SparklesIcon className="size-4 text-primary" aria-hidden />
              Jerseys, retro kits, accessories, and training essentials in one
              place
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
