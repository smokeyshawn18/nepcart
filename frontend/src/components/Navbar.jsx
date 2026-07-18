import { useState, useMemo } from "react";
import { Show, SignInButton, useAuth, UserButton } from "@clerk/react";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../lib/api";
import { Link, useLocation } from "react-router";

import {
  LogInIcon,
  MenuIcon,
  XIcon,
  PackageIcon,
  SettingsIcon,
  ShoppingCartIcon,
  ShirtIcon,
  ClipboardListIcon,
} from "lucide-react";
import { useCart } from "../store/cart";

const navLinks = [
  { to: "/catalog", label: "Browse Shop", icon: ShirtIcon },
  { to: "/shipping-policy", label: "Shipping Policy" },
  { to: "/privacy", label: "Privacy" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { getToken, isSignedIn, isLoaded } = useAuth();
  const location = useLocation();

  const { data: meData } = useQuery({
    queryKey: ["me"],
    queryFn: () => apiFetch("/api/me", { getToken }),
    enabled: !!isSignedIn,
  });

  const role = meData?.user?.role;

  const cartCount = useCart((s) =>
    s.items.reduce((n, line) => n + line.quantity, 0),
  );

  const closeMobile = () => setMobileOpen(false);
  const toggleMobile = () => setMobileOpen((v) => !v);

  const cartBadge = cartCount > 99 ? "99+" : cartCount;

  const isActive = useMemo(
    () => (to) => location.pathname.startsWith(to),
    [location.pathname],
  );

  return (
    <header className="sticky top-0 z-50 border-b border-base-300 bg-base-100/95 shadow-sm backdrop-blur-md">
      <div className="navbar mx-auto h-20 max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="navbar-start">
          <Link
            to="/"
            onClick={closeMobile}
            className="btn btn-ghost px-1 hover:bg-transparent"
          >
            <img
              src="/large.png"
              alt="NEPCART Logo"
              className="h-12 w-auto object-contain sm:h-14 md:h-16 lg:h-14 xl:h-16"
            />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="navbar-center hidden lg:flex">
          <div className="flex items-center gap-1.5">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={[
                  "btn btn-ghost gap-2 font-medium",
                  isActive(to)
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-primary/10",
                ].join(" ")}
              >
                {Icon && <Icon className="size-6 opacity-90" aria-hidden />}
                <span>{label}</span>
              </Link>
            ))}

            <Show when="signed-in">
              <Link
                to="/orders"
                className={[
                  "btn btn-ghost gap-2 font-medium",
                  isActive("/orders") ? "bg-primary/10 text-primary" : "",
                ].join(" ")}
              >
                <PackageIcon className="size-6 opacity-90" aria-hidden />
                <span>Orders</span>
              </Link>

              {role === "admin" && (
                <>
                  <Link
                    to="/admin"
                    className={[
                      "btn btn-ghost gap-2 font-medium text-secondary",
                      isActive("/admin") ? "bg-secondary/10" : "",
                    ].join(" ")}
                  >
                    <SettingsIcon className="size-6" aria-hidden />
                    <span>Products</span>
                  </Link>
                  <Link
                    to="/admin/orders"
                    className={[
                      "btn btn-ghost gap-2 font-medium text-secondary",
                      isActive("/admin/orders") ? "bg-secondary/10" : "",
                    ].join(" ")}
                  >
                    <ClipboardListIcon className="size-6" aria-hidden />
                    <span>Orders</span>
                  </Link>
                </>
              )}
            </Show>
          </div>
        </nav>

        {/* Right Side */}
        <div className="navbar-end gap-2">
          {/* Mobile Menu Toggle */}
          <button
            type="button"
            className="btn btn-ghost btn-sm md:hidden"
            onClick={toggleMobile}
            aria-expanded={mobileOpen}
            aria-label={
              mobileOpen ? "Close navigation menu" : "Open navigation menu"
            }
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
            onClick={closeMobile}
            className="btn btn-ghost gap-2 font-medium indicator"
            aria-label={`Cart with ${cartCount} items`}
          >
            {cartCount > 0 && (
              <span className="indicator-item badge badge-sm badge-primary min-w-5 px-1.5 text-xs">
                {cartBadge}
              </span>
            )}
            <ShoppingCartIcon className="size-6 opacity-90" aria-hidden />
            <span className="hidden sm:inline">Cart</span>
          </Link>

          {/* Auth Buttons */}
          {isLoaded && (
            <>
              <Show when="signed-out">
                <SignInButton mode="modal">
                  <button className="btn btn-primary btn-sm gap-1.5 px-4 shadow-md md:btn-md">
                    <LogInIcon className="size-4" aria-hidden />
                    <span className="hidden sm:inline">Sign in</span>
                  </button>
                </SignInButton>
              </Show>

              <Show when="signed-in">
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
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden border-t border-base-300 overflow-hidden transition-all duration-300 ${
          mobileOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 py-5 space-y-2">
          {navLinks.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              onClick={closeMobile}
              className={[
                "btn btn-ghost w-full justify-start gap-3 text-lg",
                isActive(to) ? "bg-primary/10 text-primary" : "",
              ].join(" ")}
            >
              {Icon && <Icon className="size-5" />}
              {label}
            </Link>
          ))}

          <Show when="signed-in">
            <Link
              to="/orders"
              onClick={closeMobile}
              className={[
                "btn btn-ghost w-full justify-start gap-3 text-lg",
                isActive("/orders") ? "bg-primary/10 text-primary" : "",
              ].join(" ")}
            >
              <PackageIcon className="size-5" />
              My Orders
            </Link>

            {role === "admin" && (
              <>
                <Link
                  to="/admin"
                  onClick={closeMobile}
                  className={[
                    "btn btn-ghost w-full justify-start gap-3 text-lg text-secondary",
                    isActive("/admin") ? "bg-secondary/10" : "",
                  ].join(" ")}
                >
                  <SettingsIcon className="size-5" />
                  Products
                </Link>
                <Link
                  to="/admin/orders"
                  onClick={closeMobile}
                  className={[
                    "btn btn-ghost w-full justify-start gap-3 text-lg text-secondary",
                    isActive("/admin/orders") ? "bg-secondary/10" : "",
                  ].join(" ")}
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
              <span className="ml-auto badge badge-primary">{cartBadge}</span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
