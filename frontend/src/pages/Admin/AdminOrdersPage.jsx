import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@clerk/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ClipboardListIcon } from "lucide-react";
import { toast } from "react-hot-toast";

import { OrdersListSkeleton } from "../../components/LoadingSkeletons.jsx";
import { PageError } from "../../components/PageError";
import { apiFetch } from "../../lib/api.js";
import { STATUS_OPTIONS } from "../../utils/admin-order-utils.js";

import { OrderStatusFilter } from "../../components/admin/OrderStatusFilter.jsx";
import { OrderCard } from "../../components/admin/OrderCard.jsx";

function FullScreenLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <span className="loading loading-spinner loading-lg" />
    </div>
  );
}

export default function AdminOrdersPage() {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const queryClient = useQueryClient();
  const [statusDrafts, setStatusDrafts] = useState({});
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: meData, isLoading: meLoading } = useQuery({
    queryKey: ["me"],
    queryFn: () => apiFetch("/api/me", { getToken }),
    enabled: isSignedIn,
  });

  const isStaff = ["admin", "support"].includes(meData?.user?.role);

  const { data, isLoading, error } = useQuery({
    queryKey: ["orders"],
    queryFn: () => apiFetch("/api/orders", { getToken }),
    enabled: isSignedIn && isStaff,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) =>
      apiFetch(`/api/admin/orders/${id}`, {
        getToken,
        method: "PATCH",
        body: { status },
      }),
    onSuccess: async (_result, variables) => {
      setStatusDrafts((prev) => ({
        ...prev,
        [variables.id]: variables.status,
      }));
      await queryClient.invalidateQueries({ queryKey: ["orders"] });
      await queryClient.invalidateQueries({
        queryKey: ["order", variables.id],
      });
      toast.success(`Order ${variables.id.slice(0, 8)} updated`);
    },
    onError: (err) => {
      toast.error(err?.message || "Could not update order");
    },
  });

  // Auth / Role Guards
  if (!isLoaded) return <FullScreenLoader />;
  if (!isSignedIn) return <Navigate to="/" replace />;
  if (meLoading) return <FullScreenLoader />;
  if (!isStaff) return <Navigate to="/" replace />;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <ClipboardListIcon className="size-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-base-content">Orders</h1>
              <p className="text-base-content/60">
                Manage and fulfill customer orders
              </p>
            </div>
          </div>
        </div>
        <OrdersListSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <PageError
        message="Could not load orders."
        action={{ to: "/admin", label: "Back to admin" }}
      />
    );
  }

  const orders = data?.orders ?? [];

  const filteredOrders =
    statusFilter === "all"
      ? orders
      : orders.filter((order) => order.status === statusFilter);

  const statusCounts = {
    all: orders.length,
    ...STATUS_OPTIONS.reduce(
      (acc, option) => ({
        ...acc,
        [option.value]: orders.filter((o) => o.status === option.value).length,
      }),
      {},
    ),
  };

  return (
    <div className="space-y-6">
      {/* Header & Filters */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <ClipboardListIcon className="size-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-base-content">Orders</h1>
            <p className="text-base-content/60">
              Manage and fulfill customer orders
            </p>
          </div>
        </div>

        <OrderStatusFilter
          statusFilter={statusFilter}
          onSelectFilter={setStatusFilter}
          statusCounts={statusCounts}
        />
      </div>

      {/* Orders List / Empty State */}
      {filteredOrders.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-base-300 bg-base-100/50 py-12 text-center">
          <ClipboardListIcon className="mx-auto mb-3 size-12 opacity-30" />
          <p className="text-base font-medium text-base-content">
            No {statusFilter !== "all" ? statusFilter : ""} orders
          </p>
          <p className="text-sm text-base-content/60">
            {statusFilter !== "all"
              ? "Try selecting a different status"
              : "Orders will appear here once customers place them"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((order) => {
            const currentStatus = statusDrafts[order.id] ?? order.status;
            return (
              <OrderCard
                key={order.id}
                order={order}
                currentStatus={currentStatus}
                onStatusChange={(orderId, newStatus, shouldUpdate = false) => {
                  setStatusDrafts((prev) => ({
                    ...prev,
                    [orderId]: newStatus,
                  }));
                  if (shouldUpdate || currentStatus !== newStatus) {
                    updateStatusMutation.mutate({
                      id: orderId,
                      status: newStatus,
                    });
                  }
                }}
                isPending={
                  updateStatusMutation.isPending &&
                  updateStatusMutation.variables?.id === order.id
                }
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
