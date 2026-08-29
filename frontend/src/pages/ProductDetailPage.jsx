import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { ProductPageSkeleton } from "../components/LoadingSkeletons";
import { PageError } from "../components/PageError";
import { useProductPage } from "../hooks/useProductPage";
import {
  IK_PRESETS,
  imageKitOptimizedUrl,
  imageKitWatermarkedUrl,
} from "../lib/imagekitUrl";
import { useCart } from "../store/cart";
import {
  ArrowLeftIcon,
  CheckCircle2,
  ExternalLinkIcon,
  ShoppingCartIcon,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Award,
  Minus,
  Plus,
  Star,
  ChevronRight,
} from "lucide-react";
import { formatPrice } from "../utils/format";
import ScrollToTop from "../lib/scroll";

const HIGHLIGHTS = [
  "Verified Pro-Grade Specifications",
  "Tour-Level Build Quality & Craftsmanship",
  "Dedicated Order Tracking & Express Support",
];

function ProductDetailPage() {
  const [quantity, setQuantity] = useState(1);
  const addItem = useCart((s) => s.addItem);
  const navigate = useNavigate();
  const { product, isLoading, error } = useProductPage();

  if (isLoading) return <ProductPageSkeleton />;

  if (error || !product) {
    return (
      <PageError
        message="Product not found."
        action={{ to: "/", label: "Back to shop" }}
      />
    );
  }

  const p = product;
  const category = p.category ?? "General";
  const watermarkedFullUrl = p.imageUrl
    ? imageKitWatermarkedUrl(p.imageUrl, IK_PRESETS.productHero)
    : null;

  const handleAddToCart = () => {
    // Add selected quantity to cart
    for (let i = 0; i < quantity; i++) {
      addItem(p.id);
    }
    navigate("/cart");
  };

  return (
    <div className="container mx-auto px-4 py-2 sm:py-6 max-w-7xl">
      <ScrollToTop />

      {/* Flush Breadcrumb Navigation */}
      <nav className="breadcrumbs text-xs font-semibold uppercase tracking-wider text-base-content/60 mb-6 bg-base-100/80 backdrop-blur-md p-3 px-5 rounded-2xl border border-base-content/10 shadow-sm sticky top-2 z-20">
        <ul className="flex items-center gap-1.5">
          <li>
            <Link to="/" className="hover:text-primary transition-colors">
              Shop
            </Link>
          </li>
          <ChevronRight className="h-3 w-3 opacity-40 shrink-0" />
          <li>
            <Link
              to={`/catalog?category=${encodeURIComponent(category)}`}
              className="hover:text-primary transition-colors"
            >
              {category}
            </Link>
          </li>
          <ChevronRight className="h-3 w-3 opacity-40 shrink-0" />
          <li className="text-base-content font-bold truncate max-w-[200px] sm:max-w-xs">
            {p.name}
          </li>
        </ul>
      </nav>

      <div className="grid gap-8 lg:grid-cols-12 lg:gap-12 items-start">
        {/* Left Column: Product Imagery Stage */}
        <div className="lg:col-span-7 space-y-4">
          <div className="group relative overflow-hidden rounded-3xl border border-base-content/10 bg-base-200/50 shadow-2xl">
            {/* Ambient Lighting Under Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

            <figure className="relative aspect-square w-full overflow-hidden bg-base-300">
              {p.imageUrl ? (
                <img
                  src={imageKitOptimizedUrl(p.imageUrl, IK_PRESETS.productHero)}
                  alt={p.name}
                  className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                  fetchPriority="high"
                  decoding="async"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-base-200 text-base-content/30">
                  <Award className="h-16 w-16 stroke-[1]" />
                </div>
              )}
            </figure>

            {/* Action Toolbar on Image */}
            {watermarkedFullUrl && (
              <div className="absolute bottom-4 right-4 z-10">
                <a
                  className="btn btn-sm rounded-xl bg-base-100/90 hover:bg-base-100 text-base-content backdrop-blur-md border border-base-content/10 font-bold shadow-md hover:scale-105 transition-all"
                  href={watermarkedFullUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLinkIcon className="h-4 w-4" aria-hidden />
                  Full Size Preview
                </a>
              </div>
            )}
          </div>

          {/* Guarantee Badges Grid */}
          <div className="grid grid-cols-3 gap-3 pt-1">
            <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-base-100 border border-base-content/10 text-center shadow-sm">
              <ShieldCheck className="h-5 w-5 text-primary mb-1" />
              <span className="text-[11px] font-bold text-base-content">
                100% Genuine
              </span>
            </div>
            <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-base-100 border border-base-content/10 text-center shadow-sm">
              <Truck className="h-5 w-5 text-primary mb-1" />
              <span className="text-[11px] font-bold text-base-content">
                Express Shipping
              </span>
            </div>
            <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-base-100 border border-base-content/10 text-center shadow-sm">
              <RotateCcw className="h-5 w-5 text-primary mb-1" />
              <span className="text-[11px] font-bold text-base-content">
                Hassle-Free Returns
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Specs & Conversion Column */}
        <div className="lg:col-span-5 flex flex-col text-left space-y-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="badge badge-primary font-extrabold uppercase tracking-wider text-[10px] px-3 py-2 rounded-lg">
                {category}
              </span>
            </div>

            <h1 className="text-3xl font-black tracking-tight text-base-content sm:text-4xl lg:text-5xl uppercase font-mono leading-none">
              {p.name}
            </h1>
          </div>

          {/* Pricing & Stock Card */}
          <div className="rounded-2xl bg-base-100 p-5 border border-base-content/10 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[10px] font-extrabold text-base-content/40 uppercase tracking-widest block mb-1">
                Unit Price
              </span>
              <p className="text-4xl font-black font-mono tracking-tight text-primary tabular-nums">
                {formatPrice(p.priceCents, p.currency)}
              </p>
            </div>
            <div className="flex items-center gap-2 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-bold text-emerald-500">
                In Stock & Ready
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-xs font-extrabold text-base-content/40 uppercase tracking-widest">
              Overview
            </h3>
            <p className="text-sm sm:text-base leading-relaxed text-base-content/80 font-medium">
              {p.description}
            </p>
          </div>

          {/* Key Features */}
          <div className="rounded-2xl border border-base-content/10 bg-base-100 p-5 space-y-3 shadow-sm">
            <h3 className="text-xs font-extrabold text-base-content/40 uppercase tracking-widest">
              Equipment Highlights
            </h3>
            <ul className="space-y-2.5">
              {HIGHLIGHTS.map((h) => (
                <li
                  key={h}
                  className="flex items-start gap-2.5 text-xs sm:text-sm font-semibold text-base-content/90"
                >
                  <CheckCircle2
                    className="h-4 w-4 shrink-0 text-primary mt-0.5"
                    aria-hidden
                  />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Quantity Counter & CTA Row */}
          <div className="pt-2 space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-xs font-extrabold uppercase tracking-widest text-base-content/40">
                Quantity:
              </span>
              <div className="flex items-center border border-base-content/15 rounded-xl bg-base-100 p-1">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="btn btn-xs btn-ghost rounded-lg"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-10 text-center font-mono font-bold text-sm">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="btn btn-xs btn-ghost rounded-lg"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleAddToCart}
                className="btn btn-primary btn-lg rounded-2xl flex-1 font-black shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all gap-2"
              >
                <ShoppingCartIcon className="h-5 w-5" aria-hidden />
                Add to Cart ({quantity})
              </button>

              <Link
                to="/"
                className="btn btn-ghost btn-lg rounded-2xl border border-base-content/15 hover:bg-base-200 font-bold gap-2"
              >
                <ArrowLeftIcon className="h-4 w-4" aria-hidden />
                Back to Shop
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;
