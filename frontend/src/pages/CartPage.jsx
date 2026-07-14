import {
  HeadphonesIcon,
  LogInIcon,
  MinusIcon,
  PlusIcon,
  ShoppingCartIcon,
  Trash2Icon,
} from "lucide-react";
import useCartPage from "../hooks/useCartPage";
import EmptyCart from "../components/EmptyCart";
import { CartSkeleton } from "../components/LoadingSkeletons";
import { PageError } from "../components/PageError";
import { IK_PRESETS, imageKitOptimizedUrl } from "../lib/imagekitUrl";
import { Link } from "react-router";
import { formatPrice } from "../utils/format";
import { Show, SignInButton } from "@clerk/react";

function CartPage() {
  const {
    checkout,
    checkoutLoading,
    items,
    lines,
    productsError,
    productsLoading,
    removeItem,
    setQty,
    subtotal,
  } = useCartPage();

  return (
    <div className="text-left">
      <h1 className="mb-8 flex items-center gap-2 text-3xl font-bold text-base-content">
        <ShoppingCartIcon className="size-8 text-primary" aria-hidden />
        Cart
      </h1>

      {items.length === 0 ? (
        <EmptyCart />
      ) : productsLoading ? (
        <CartSkeleton lines={items.length} />
      ) : productsError ? (
        <PageError message="Could not load product details. Refresh the page or try again shortly." />
      ) : (
        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <ul className="space-y-4">
            {lines.map(({ line, product: p }) => (
              <li
                key={line.productId}
                className="card card-side border border-base-300 bg-base-100 shadow-sm"
              >
                <figure className="p-4">
                  {p?.imageUrl ? (
                    <img
                      src={imageKitOptimizedUrl(p.imageUrl, IK_PRESETS.cartThumb)}
                      alt=""
                      className="h-24 w-24 rounded-box object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <div className="h-24 w-24 rounded-box bg-base-300" />
                  )}
                </figure>
                <div className="card-body min-w-0 flex-row flex-wrap items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="card-title text-base">
                      {p ? (
                        <Link to={`/product/${p.slug}`} className="link-hover link-primary">
                          {p.name}
                        </Link>
                      ) : (
                        "Unknown product"
                      )}
                    </div>
                    {p ? (
                      <p className="text-sm text-base-content/60">
                        {formatPrice(p.priceCents, p.currency)} each
                      </p>
                    ) : null}
                    <div className="mt-2 flex flex-wrap items-center gap-3">
                      <span className="text-sm text-base-content/70">Qty</span>
                      <div className="join border border-base-300">
                        <button
                          type="button"
                          className="btn btn-sm join-item gap-0 px-2.5"
                          onClick={() => setQty(line.productId, line.quantity - 1)}
                          aria-label={line.quantity <= 1 ? "Remove from cart" : "Decrease quantity"}
                        >
                          <MinusIcon className="size-4" aria-hidden />
                        </button>
                        <span
                          className="join-item flex min-w-10 items-center justify-center bg-base-200 px-3 text-sm font-medium tabular-nums text-base-content"
                          aria-live="polite"
                        >
                          {line.quantity}
                        </span>
                        <button
                          type="button"
                          className="btn btn-sm join-item gap-0 px-2.5"
                          onClick={() => setQty(line.productId, Math.min(99, line.quantity + 1))}
                          disabled={line.quantity >= 99}
                          aria-label="Increase quantity"
                        >
                          <PlusIcon className="size-4" aria-hidden />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(line.productId)}
                        className="btn btn-ghost btn-square btn-sm text-error hover:bg-error/10"
                        aria-label="Remove from cart"
                        title="Remove from cart"
                      >
                        <Trash2Icon className="size-4" aria-hidden />
                      </button>
                    </div>
                  </div>
                  <div className="text-right font-semibold text-base-content">
                    {p ? formatPrice(p.priceCents * line.quantity, p.currency) : "-"}
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <aside className="card border border-base-300 bg-base-100 p-6 shadow-md">
            <div className="flex justify-between text-sm">
              <span className="text-base-content/70">Subtotal</span>
              <span className="font-semibold text-base-content">
                {formatPrice(subtotal, lines[0]?.product?.currency ?? "usd")}
              </span>
            </div>

            <Show when="signed-in">
              <button
                type="button"
                onClick={checkout}
                disabled={checkoutLoading}
                aria-busy={checkoutLoading}
                className="btn btn-primary mt-6 w-full gap-2"
              >
                {checkoutLoading ? (
                  <span className="loading loading-spinner loading-sm" aria-hidden />
                ) : (
                  <ShoppingCartIcon className="size-4" aria-hidden />
                )}
                {checkoutLoading ? "Opening checkout…" : "Checkout securely"}
              </button>
            </Show>

            <Show when="signed-out">
              <SignInButton mode="modal">
                <button type="button" className="btn btn-outline btn-primary mt-6 w-full gap-2">
                  <LogInIcon className="size-4" aria-hidden />
                  Sign in to checkout
                </button>
              </SignInButton>
            </Show>

            <p className="mt-4 flex items-start gap-2 text-xs text-base-content/60">
              <HeadphonesIcon className="mt-0.5 size-3.5 shrink-0 text-primary" aria-hidden />
              <span>
                After payment, open your order for{" "}
                <strong className="text-base-content">support chat</strong>. Video invites appear in
                that thread.
              </span>
            </p>
          </aside>
        </div>
      )}
    </div>
  );
}
export default CartPage;
