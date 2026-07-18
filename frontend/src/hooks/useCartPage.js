import { useAuth } from "@clerk/react";

import { useCart } from "../store/cart";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../lib/api";
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
    country: "",
    notes: "",
  });

  const items = useCart((s) => s.items);
  const setQty = useCart((s) => s.setQty);
  const removeItem = useCart((s) => s.removeItem);

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
        ...(paymentMethod === "cod" ||
        Object.keys(normalizedShippingAddress).length > 0
          ? {
              shippingAddress: normalizedShippingAddress,
            }
          : {}),
      };

      const res = await apiFetch("/api/checkout", {
        getToken,
        method: "POST",
        body,
      });

      if (res?.checkoutUrl) {
        window.location.href = res.checkoutUrl;
        return;
      }

      if (res?.orderId) {
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
