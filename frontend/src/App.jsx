import {
  Show,
  SignInButton,
  SignUpButton,
  useAuth,
  UserButton,
} from "@clerk/react";
import PageLoader from "./components/PageLoader";
import Layout from "./components/Layout";
import { Routes, Route, Navigate } from "react-router";
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

import { Toaster } from "react-hot-toast";
import ShippingPolicy from "./components/ShippingPolicy";
import PrivacyPolicy from "./components/PrivacyPolicy";
import { GlobalLoader } from "./utils/globalLoader";

function App() {
  const { isSignedIn } = useAuth();

  return (
    <>
      <GlobalLoader />
      <Layout>
        <Toaster />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/shipping-policy" element={<ShippingPolicy />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/product/:slug" element={<ProductDetailPage />} />
          <Route
            path="/orders"
            element={
              isSignedIn ? <OrdersPage /> : <Navigate to={"/"} replace />
            }
          />
          <Route path="/checkout/return" element={<CheckoutReturnPage />} />

          <Route path="/demo-sentry" element={<SentryDemoPage />} />

          <Route
            path="/orders/:id/call"
            element={
              isSignedIn ? <OrderVideoPage /> : <Navigate to={"/"} replace />
            }
          />

          <Route
            path="/admin"
            element={
              isSignedIn ? <AdminProductsPage /> : <Navigate to="/" replace />
            }
          />
          <Route
            path="/admin/orders"
            element={
              isSignedIn ? <AdminOrdersPage /> : <Navigate to="/" replace />
            }
          />

          {/* NESTED ROUTES */}
          <Route path="/orders/:id" element={<OrderDetailPage />}>
            <Route index element={<OrderSummaryPage />} />
            <Route path="chat" element={<OrderChatPage />} />
          </Route>
        </Routes>
      </Layout>
    </>
  );
}

export default App;
