import { useAuth } from "@clerk/react";
import { Routes, Route, Navigate } from "react-router";
import { useQuery } from "@tanstack/react-query";

import Layout from "./components/Layout";
import AdminLayout from "./components/admin/AdminLayout";

import { apiFetch } from "./lib/api";

import HomePage from "./pages/HomePage";
import CartPage from "./pages/CartPage";
import OrdersPage from "./pages/OrdersPage";
import CheckoutReturnPage from "./pages/CheckoutReturnPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import { SentryDemoPage } from "./pages/SentryDemoPage";
import OrderDetailPage from "./pages/OrderDetailPage";
import OrderSummaryPage from "./pages/OrderSummaryPage";
import OrderChatPage from "./pages/OrderChatPage";
import OrderVideoPage from "./pages/OrderVideoPage";
import AdminProductsPage from "./pages/Admin/AdminProductsPage";
import AdminOrdersPage from "./pages/Admin/AdminOrdersPage";
import CatalogPage from "./pages/CatalogPage";

import ShippingPolicy from "./components/ShippingPolicy";
import EsewaReturnPage from "./pages/EsewaReturnPage";
import { isStaffRole } from "./utils/roles";
import PrivacyPolicy from "./components/PrivacyPolicy";

import { ShoppingBag } from "lucide-react";

function FullScreenLoader({
  message = "Loading NepCart...",
  subtext = "Preparing your shopping experience",
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-base-300/60 backdrop-blur-md transition-all duration-300">
      {/* Ambient background glow */}
      <div className="absolute h-72 w-72 rounded-full bg-primary/15 blur-3xl animate-pulse" />
      <div className="absolute h-48 w-48 rounded-full bg-secondary/10 blur-2xl animate-pulse delay-500" />

      {/* Main card */}
      <div className="relative z-10 flex flex-col items-center gap-5 rounded-3xl border border-base-content/10 bg-base-100/85 px-10 py-8 shadow-2xl backdrop-blur-xl">
        {/* Animated Brand Icon Ring */}
        <div className="relative flex items-center justify-center">
          {/* Outer rotating accent ring */}
          <div className="h-16 w-16 rounded-full border-2 border-transparent border-t-primary border-r-primary/40 animate-spin" />

          {/* Inner pulse ring */}
          <div className="absolute h-12 w-12 rounded-full bg-primary/10 animate-ping" />

          {/* Centered Lucide Icon */}
          <div className="absolute flex items-center justify-center text-primary">
            <ShoppingBag className="h-7 w-7 animate-bounce" />
          </div>
        </div>

        {/* Brand Name & Loading Message */}
        <div className="flex flex-col items-center text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-primary/80">
            NepCart
          </span>
          <p className="mt-1 text-base font-semibold text-base-content">
            {message}
          </p>
          <p className="text-xs font-medium text-base-content/60">{subtext}</p>
        </div>

        {/* Animated Progress Bar */}
        <div className="relative h-1.5 w-44 overflow-hidden rounded-full bg-base-200">
          <div
            className="absolute inset-y-0 left-0 w-1/2 rounded-full bg-gradient-to-r from-primary to-secondary animate-[shimmer_1.5s_infinite_linear]"
            style={{
              animation: "indeterminate 1.5s infinite ease-in-out",
            }}
          />
        </div>
      </div>

      {/* Custom Keyframe inline style for the indeterminate progress bar */}
      <style>{`
        @keyframes indeterminate {
          0% { left: -50%; width: 50%; }
          50% { left: 25%; width: 75%; }
          100% { left: 100%; width: 50%; }
        }
      `}</style>
    </div>
  );
}

function App() {
  const { getToken, isSignedIn, isLoaded } = useAuth();

  const { data: meData, isLoading: meLoading } = useQuery({
    queryKey: ["me"],
    queryFn: () => apiFetch("/api/me", { getToken }),
    enabled: !!isSignedIn,
  });

  const isStaff = isStaffRole(meData?.user?.role);

  // Wait for Clerk to resolve before making any auth decision - isSignedIn
  // is undefined (falsy) until isLoaded is true, which causes a false
  // redirect on cold loads / hard refreshes of any guarded route below.
  if (!isLoaded) {
    return <FullScreenLoader />;
  }

  // Wait for the role lookup before deciding staff-only access - meData
  // isn't populated yet on first render, so isStaff would read false even
  // for a legitimate admin/support user while this request is in flight.
  if (isSignedIn && meLoading) {
    return <FullScreenLoader />;
  }

  return (
    <Routes>
      {/* ==================== */}
      {/* GENERAL USER ROUTES */}
      {/* ==================== */}

      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/shipping-policy" element={<ShippingPolicy />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/product/:slug" element={<ProductDetailPage />} />

        <Route
          path="/orders"
          element={isSignedIn ? <OrdersPage /> : <Navigate to="/" replace />}
        />

        <Route path="/checkout/return" element={<CheckoutReturnPage />} />
        <Route path="/checkout/esewa/return" element={<EsewaReturnPage />} />

        <Route path="/demo-sentry" element={<SentryDemoPage />} />
        <Route
          path="/orders/:id/call"
          element={
            isSignedIn ? <OrderVideoPage /> : <Navigate to="/" replace />
          }
        />

        <Route path="/orders/:id" element={<OrderDetailPage />}>
          <Route index element={<OrderSummaryPage />} />
          <Route path="chat" element={<OrderChatPage />} />
        </Route>
      </Route>

      {/* ==================== */}
      {/* ADMIN / STAFF ROUTES */}
      {/* ==================== */}

      <Route
        path="/admin"
        element={
          isSignedIn && isStaff ? <AdminLayout /> : <Navigate to="/" replace />
        }
      >
        <Route index element={<AdminProductsPage />} />
        <Route path="orders" element={<AdminOrdersPage />} />
      </Route>
    </Routes>
  );
}

export default App;
