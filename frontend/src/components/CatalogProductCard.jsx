import { Link, useNavigate } from "react-router";
import {
  PlusIcon,
  ShoppingBag,
  ArrowUpRight,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { formatPrice } from "../utils/format";
import { IK_PRESETS, imageKitOptimizedUrl } from "../lib/imagekitUrl.js";
import { useCart } from "../store/cart.js";

export function CatalogProductCard({ product }) {
  const addItem = useCart((s) => s.addItem);
  const navigate = useNavigate();

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-base-content/10 bg-base-100 shadow-sm transition-all duration-500 hover:-translate-y-1.5 hover:border-primary/50 hover:shadow-2xl">
      {/* Visual Canvas Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-base-300">
        <Link
          to={`/product/${product.slug}`}
          tabIndex={-1}
          className="block h-full w-full"
        >
          {product.imageUrl ? (
            <img
              src={imageKitOptimizedUrl(
                product.imageUrl,
                IK_PRESETS.catalogCard,
              )}
              alt={product.name}
              className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110 group-hover:brightness-95"
              loading="lazy"
              decoding="async"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-base-200 text-base-content/30">
              <ShoppingBag className="h-10 w-10 stroke-[1.5]" />
            </div>
          )}
        </Link>

        {/* Dynamic Dark Gradient Backdrop Overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-80" />

        {/* Top Badges */}
        <div className="absolute left-3.5 right-3.5 top-3.5 flex items-center justify-between gap-2 pointer-events-none">
          <span className="rounded-full bg-black/60 backdrop-blur-md px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-white border border-white/15 shadow-sm">
            {product.category ?? "General"}
          </span>
        </div>

        {/* Quick View Floating Button on Hover */}
        <Link
          to={`/product/${product.slug}`}
          className="absolute bottom-3.5 right-3.5 inline-flex items-center gap-1.5 rounded-2xl bg-white/90 dark:bg-black/90 backdrop-blur-md px-3.5 py-2 text-xs font-black uppercase tracking-wider text-base-content shadow-lg opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:scale-105"
        >
          <span className="text-white">Details</span>
          <ArrowUpRight className="h-3.5 w-3.5" color="white" />
        </Link>
      </div>

      {/* Card Content & Action Bar */}
      <div className="flex flex-1 flex-col justify-between p-5 space-y-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Verified Authentic</span>
          </div>

          <Link
            to={`/product/${product.slug}`}
            className="block font-black text-base sm:text-lg tracking-tight text-base-content line-clamp-1 group-hover:text-primary transition-colors duration-200"
          >
            {product.name}
          </Link>

          {product.description && (
            <p className="line-clamp-2 text-xs leading-relaxed text-base-content/70 font-medium">
              {product.description}
            </p>
          )}
        </div>

        {/* Bottom Tier: Pricing & Instant Cart Action */}
        <div className="flex items-end justify-between border-t border-base-content/10 pt-4 mt-auto">
          <div className="flex flex-col">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-base-content/40">
              Price
            </span>
            <span className="text-xl sm:text-2xl font-black font-mono tracking-tight text-base-content tabular-nums">
              {formatPrice(product.priceCents, product.currency)}
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              addItem(product.id);
              navigate("/cart");
            }}
            className="btn btn-primary btn-md rounded-2xl font-black px-5 shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-2"
          >
            <PlusIcon className="h-4 w-4 stroke-[3]" aria-hidden />
            <span>Add</span>
          </button>
        </div>
      </div>
    </article>
  );
}
