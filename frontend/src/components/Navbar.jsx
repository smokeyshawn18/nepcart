import { useState } from "react";
import { Show, SignInButton, useAuth, UserButton } from "@clerk/react";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../lib/api";
import { Link } from "react-router";

import {
  LogInIcon,
  MenuIcon,
  XIcon,
  PackageIcon,
  SettingsIcon,
  ShoppingCartIcon,
  StoreIcon,
  ShirtIcon,
  ClipboardListIcon,
} from "lucide-react";
import { useCart } from "../store/cart";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { getToken, isSignedIn } = useAuth();

  const { data: meData } = useQuery({
    queryKey: ["me"],
    queryFn: () => apiFetch("/api/me", { getToken }),
    enabled: isSignedIn,
  });

  const role = meData?.user?.role;

  const cartCount = useCart((s) =>
    s.items.reduce((n, line) => n + line.quantity, 0),
  );

  const closeMobile = () => setMobileOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-base-300 bg-base-100/95 shadow-sm backdrop-blur-md">
      <div className="navbar mx-auto max-w-7xl px-4 py-2.5 md:px-6 md:py-3">
        {/* Logo */}
        <div className="navbar-start">
          <Link
            to="/"
            onClick={closeMobile}
            className="btn btn-ghost gap-2 px-2 font-mono text-lg font-semibold uppercase tracking-wide md:text-xl"
          >
            <span className="flex size-10 items-center justify-center rounded-lg bg-primary/15 p-1 text-primary">
              <StoreIcon className="size-8" aria-hidden />
            </span>
            <span className="leading-none">SPORTED</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="navbar-center hidden lg:flex">
          <div className="flex items-center gap-1.5">
            <Link
              to="/catalog"
              className="btn btn-ghost gap-2 font-medium hover:bg-primary/10"
            >
              <ShirtIcon className="size-6 opacity-90" aria-hidden />
              <span>Browse Shop</span>
            </Link>

            <Link
              to="/shipping-policy"
              className="btn btn-ghost gap-2 font-medium"
            >
              Shipping Poilicy
            </Link>

            <Link to="/privacy" className="btn btn-ghost gap-2 font-medium">
              Privacy
            </Link>

            <Show when={"signed-in"}>
              <Link to="/orders" className="btn btn-ghost gap-2 font-medium">
                <PackageIcon className="size-6 opacity-90" aria-hidden />
                <span>Orders</span>
              </Link>

              {role === "admin" && (
                <>
                  <>
                    <Link
                      to="/admin"
                      className="btn btn-ghost gap-2 font-medium text-secondary"
                    >
                      <SettingsIcon className="size-6" aria-hidden />
                      <span>Products</span>
                    </Link>
                    <Link
                      to="/admin/orders"
                      className="btn btn-ghost gap-2 font-medium text-secondary"
                    >
                      <ClipboardListIcon className="size-6" aria-hidden />
                      <span>Orders</span>
                    </Link>
                  </>
                </>
              )}
            </Show>
          </div>
        </div>

        {/* Right Side */}
        <div className="navbar-end gap-2">
          {/* Mobile Menu Toggle */}
          <button
            type="button"
            className="btn btn-ghost btn-sm md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <XIcon className="size-5" />
            ) : (
              <MenuIcon className="size-5" />
            )}
          </button>

          {/* Cart */}
          <Link
            to="/cart"
            className="btn btn-ghost gap-2 font-medium indicator"
            aria-label={`Cart with ${cartCount} items`}
          >
            {cartCount > 0 && (
              <span className="indicator-item badge badge-sm badge-primary min-w-5 px-1.5 text-xs">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
            <ShoppingCartIcon className="size-6 opacity-90" aria-hidden />
            <span className="hidden sm:inline">Cart</span>
          </Link>

          {/* Auth Buttons */}
          <Show when={"signed-out"}>
            <SignInButton mode="modal">
              <button className="btn btn-primary btn-sm gap-1.5 px-4 shadow-md md:btn-md">
                <LogInIcon className="size-4" aria-hidden />
                <span className="hidden sm:inline">Sign in</span>
              </button>
            </SignInButton>
          </Show>

          <Show when={"signed-in"}>
            <div className="hidden md:flex items-center gap-3 border-l border-base-300 pl-4">
              <UserButton
                appearance={{
                  elements: { avatarBox: "h-9 w-9 ring-2 ring-base-300" },
                }}
              />
              {(role === "admin" || role === "support") && (
                <span className="badge badge-primary badge-sm capitalize">
                  {role}
                </span>
              )}
            </div>
          </Show>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden border-t border-base-300 overflow-hidden transition-all duration-300 ${
          mobileOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 py-5 space-y-2">
          <Link
            to="/catalog"
            onClick={closeMobile}
            className="btn btn-ghost w-full justify-start gap-3 text-lg"
          >
            <ShirtIcon className="size-5" />
            Browse Shop
          </Link>

          <Link
            to="/shipping-policy"
            className="btn btn-ghost gap-2 font-medium"
          >
            Shipping Policy
          </Link>

          <Link to="/privacy" className="btn btn-ghost gap-2 font-medium">
            Privacy
          </Link>

          <Show when={"signed-in"}>
            <Link
              to="/orders"
              onClick={closeMobile}
              className="btn btn-ghost w-full justify-start gap-3 text-lg"
            >
              <PackageIcon className="size-5" />
              My Orders
            </Link>

            {role === "admin" && (
              <>
                <Link
                  to="/admin"
                  onClick={closeMobile}
                  className="btn btn-ghost w-full justify-start gap-3 text-lg text-secondary"
                >
                  <SettingsIcon className="size-5" />
                  Products
                </Link>
                <Link
                  to="/admin/orders"
                  onClick={closeMobile}
                  className="btn btn-ghost w-full justify-start gap-3 text-lg text-secondary"
                >
                  <ClipboardListIcon className="size-5" />
                  Orders
                </Link>
              </>
            )}
          </Show>

          <Link
            to="/cart"
            onClick={closeMobile}
            className="btn btn-ghost w-full justify-start gap-3 text-lg indicator"
          >
            <ShoppingCartIcon className="size-5" />
            Cart
            {cartCount > 0 && (
              <span className="ml-auto badge badge-primary">{cartCount}</span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
