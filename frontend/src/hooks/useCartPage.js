import { useAuth } from "@clerk/react";

import { useCart } from "../store/cart";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../lib/api";
import { submitEsewaForm } from "../utils/submitEsewa.js";
import { useState } from "react";
import toast from "react-hot-toast";

export default function useCartPage() {
  const { getToken } = useAuth();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    region: "",
    country: "Nepal",
    notes: "",
  });

  const items = useCart((s) => s.items);
  const setQty = useCart((s) => s.setQty);
  const removeItem = useCart((s) => s.removeItem);
  const clearCart = useCart((s) => s.clear);

  const {
    data,
    isLoading: productsLoading,
    isError: productsError,
  } = useQuery({
    queryKey: ["cart-products", items],
    enabled: items.length > 0,
    queryFn: () =>
      apiFetch("/api/products/by-ids", {
        method: "POST",
        body: {
          ids: items.map((item) => item.productId),
        },
      }),
  });

  const products = data?.products ?? [];
  const byId = new Map(products.map((p) => [p.id, p]));
  const lines = items.map((line) => ({
    line,
    product: byId.get(line.productId) ?? null,
  }));

  const subtotal = lines.reduce((sum, { line, product: p }) => {
    if (!p) return sum;
    return sum + p.priceCents * line.quantity;
  }, 0);

  async function checkout(paymentMethod = "polar") {
    setCheckoutLoading(true);

    try {
      const normalizedShippingAddress = Object.fromEntries(
        Object.entries(shippingAddress).filter(([, value]) => value !== ""),
      );

      const body = {
        items: items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
        })),
        paymentMethod,
        shippingAddress: normalizedShippingAddress,
      };

      const res = await apiFetch("/api/checkout", {
        getToken,
        method: "POST",
        body,
      });

      if (res?.checkoutUrl) {
        // polar - hosted checkout page
        window.location.href = res.checkoutUrl;
        return;
      }

      if (res?.paymentUrl && res?.paymentData) {
        // esewa - full-page redirect. eSewa's login page uses Google
        // reCAPTCHA, which broke when this ran inside a popup window
        // (grecaptcha failed to init, login requests came back 400/401).
        // Not worth fighting - navigate the whole tab away like Polar does.
        submitEsewaForm(res.paymentUrl, res.paymentData);
        return;
      }

      if (res?.orderId) {
        // clear cart locally for COD orders before redirecting to order page
        try {
          clearCart();
        } catch (err) {
          // ignore
        }

        window.location.href = `/orders/${res.orderId}`;
        return;
      }

      throw new Error("Unable to start checkout");
    } catch (error) {
      toast.error(error.message || "Could not start checkout");
    } finally {
      setCheckoutLoading(false);
    }
  }

  return {
    items,
    setQty,
    removeItem,
    productsLoading,
    productsError,
    lines,
    subtotal,
    checkout,
    checkoutLoading,
    shippingAddress,
    setShippingAddress,
  };
}
