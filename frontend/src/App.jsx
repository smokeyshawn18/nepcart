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
// import PrivacyPolicy from "./components/PrivacyPolicy";

function App() {
  const { getToken, isSignedIn } = useAuth();

  const { data: meData, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: () => apiFetch("/api/me", { getToken }),
    enabled: !!isSignedIn,
  });

  const isAdmin = meData?.user?.role === "admin";

  // Wait until we know the user's role
  if (isSignedIn && isLoading) {
    return <div>Loading...</div>;
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
        {/* <Route path="/privacy" element={<PrivacyPolicy />} /> */}
        <Route path="/cart" element={<CartPage />} />
        <Route path="/product/:slug" element={<ProductDetailPage />} />

        <Route
          path="/orders"
          element={isSignedIn ? <OrdersPage /> : <Navigate to="/" replace />}
        />

        <Route path="/checkout/return" element={<CheckoutReturnPage />} />

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
      {/* ADMIN ROUTES */}
      {/* ==================== */}

      <Route
        path="/admin"
        element={
          isSignedIn && isAdmin ? <AdminLayout /> : <Navigate to="/" replace />
        }
      >
        <Route index element={<AdminProductsPage />} />
        <Route path="orders" element={<AdminOrdersPage />} />
      </Route>
    </Routes>
  );
}

export default App;
