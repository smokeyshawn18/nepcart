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

function FullScreenLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <span className="loading loading-spinner loading-lg" />
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
