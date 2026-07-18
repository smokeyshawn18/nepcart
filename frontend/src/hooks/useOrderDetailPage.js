import { useParams } from "react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/react";
import { apiFetch } from "../lib/api.js";

export function useOrderDetailPage() {
  const { id } = useParams();
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["order", id],
    queryFn: () => apiFetch(`/api/orders/${id}`, { getToken }),
    enabled: Boolean(id),
  });

  const { data: meData } = useQuery({
    queryKey: ["me"],
    queryFn: () => apiFetch("/api/me", { getToken }),
    enabled: Boolean(id),
  });

  const order = data?.order ?? null;
  const items = data?.items ?? [];
  const paid = order?.status === "paid";

  const canOpenSupport = paid || order?.paymentMethod === "cod";

  const canCancel =
    order?.paymentMethod === "cod" && order?.status === "pending";
  const isAdmin =
    meData?.user?.role === "admin" || meData?.user?.role === "support";

  async function cancelOrder() {
    if (!id) return;
    await apiFetch(`/api/orders/${id}/cancel`, { getToken, method: "PATCH" });
    await queryClient.invalidateQueries({ queryKey: ["order", id] });
    await queryClient.invalidateQueries({ queryKey: ["orders"] });
  }

  async function updateStatus(status) {
    if (!id) return;
    await apiFetch(`/api/admin/orders/${id}`, {
      getToken,
      method: "PATCH",
      body: { status },
    });
    await queryClient.invalidateQueries({ queryKey: ["order", id] });
    await queryClient.invalidateQueries({ queryKey: ["orders"] });
  }

  return {
    id,
    order,
    items,
    paid,
    canCancel,
    isAdmin,
    cancelOrder,
    canOpenSupport,
    updateStatus,
    isLoading,
    error,
  };
}
