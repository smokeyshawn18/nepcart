import { create } from "zustand";
import { persist } from "zustand/middleware";
import toast from "react-hot-toast";

export const useCart = create(
  persist(
    (set, get) => ({
      items: [],

      addItem(productId, qty = 1) {
        const items = [...get().items];
        const i = items.findIndex((item) => item.productId === productId);

        if (i >= 0) {
          items[i] = {
            ...items[i],
            quantity: items[i].quantity + qty,
          };

          toast.success("Cart quantity updated");
        } else {
          items.push({
            productId,
            quantity: qty,
          });

          toast.success("Added to cart");
        }

        set({ items });
      },

      removeItem(productId) {
        set({
          items: get().items.filter((item) => item.productId !== productId),
        });

        toast.success("Removed from cart");
      },

      setQty(productId, quantity) {
        if (quantity <= 0) {
          set({
            items: get().items.filter((item) => item.productId !== productId),
          });

          toast.success("Removed from cart");
          return;
        }

        const items = get().items.map((item) =>
          item.productId === productId ? { ...item, quantity } : item,
        );

        set({ items });
      },

      clear() {
        set({ items: [] });

        toast.success("Cart cleared");
      },
    }),
    {
      name: "northwind-cart",
    },
  ),
);
