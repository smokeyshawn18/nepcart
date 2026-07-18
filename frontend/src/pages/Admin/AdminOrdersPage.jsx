import { useState } from "react";
import { Navigate, Link } from "react-router";
import { useAuth } from "@clerk/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ClipboardListIcon, TruckIcon } from "lucide-react";
import { toast } from "react-hot-toast";
import PageLoader from "../../components/PageLoader";
import { OrdersListSkeleton } from "../../components/LoadingSkeletons.jsx";
import { PageError } from "../../components/PageError";
import { apiFetch } from "../../lib/api.js";
import { formatOrderWhen, formatPrice } from "../../utils/format.js";

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "paid", label: "Paid" },
  { value: "failed", label: "Failed" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

function statusBadgeClass(status) {
  switch (status) {
    case "paid":
      return "badge-success";
    case "pending":
      return "badge-warning";
    case "delivered":
      return "badge-info";
    case "cancelled":
    case "failed":
      return "badge-error";
    default:
      return "badge-ghost";
  }
}

function formatShippingAddress(address) {
  if (!address || typeof address !== "object") return null;

  const parts = [
    address.fullName || address.name || "",
    address.phone || "",
    [address.line1, address.addressLine1, address.street]
      .filter(Boolean)
      .join(" "),
    [address.line2, address.addressLine2].filter(Boolean).join(" "),
    [address.city, address.state, address.postalCode, address.zip]
      .filter(Boolean)
      .join(" "),
    address.country || "",
  ].filter(Boolean);

  return parts.join(" • ");
}

function AdminOrdersPage() {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const queryClient = useQueryClient();
  const [statusDrafts, setStatusDrafts] = useState({});

  const { data: meData, isLoading: meLoading } = useQuery({
    queryKey: ["me"],
    queryFn: () => apiFetch("/api/me", { getToken }),
    enabled: isSignedIn,
  });

  const isAdmin = meData?.user?.role === "admin";

  const { data, isLoading, error } = useQuery({
    queryKey: ["orders"],
    queryFn: () => apiFetch("/api/orders", { getToken }),
    enabled: isSignedIn && isAdmin,
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

  if (!isLoaded) return <PageLoader />;
  if (!isSignedIn) return <Navigate to="/" replace />;
  if (meLoading) return <PageLoader />;
  if (!isAdmin) return <Navigate to="/" replace />;

  if (isLoading) {
    return (
      <div className="text-left">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-base-content">
              Admin orders
            </h1>
            <p className="text-sm text-base-content/60">
              Review order activity and update fulfillment status.
            </p>
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

  return (
    <div className="text-left">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <ClipboardListIcon className="size-8 text-secondary" aria-hidden />
          <div>
            <h1 className="text-2xl font-bold text-base-content">
              Admin orders
            </h1>
            <p className="text-sm text-base-content/60">
              Review orders and update their fulfillment state.
            </p>
          </div>
        </div>
        <div className="badge badge-primary badge-lg">
          {orders.length} orders
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-box border border-base-300 bg-base-100 p-8 text-center text-base-content/70">
          No orders yet.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-box border border-base-300 bg-base-100">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th>Order</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Shipping</th>
                <th>Placed</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const currentStatus = statusDrafts[order.id] ?? order.status;
                return (
                  <tr key={order.id}>
                    <td className="min-w-56">
                      <div className="space-y-1">
                        <Link
                          to={`/orders/${order.id}`}
                          className="font-mono text-sm font-semibold text-primary hover:underline"
                        >
                          #{order.id.slice(0, 8)}
                        </Link>
                        <div className="text-sm text-base-content/60">
                          {order.userId?.slice(0, 8) ?? "customer"}
                        </div>
                        <div className="text-xs text-base-content/45">
                          {order.id}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span
                        className={`badge capitalize ${statusBadgeClass(currentStatus)}`}
                      >
                        {currentStatus}
                      </span>
                    </td>
                    <td>
                      <span className="badge badge-ghost badge-sm uppercase">
                        {order.paymentMethod === "cod"
                          ? "COD"
                          : (order.paymentMethod ?? "polar")}
                      </span>
                    </td>
                    <td className="max-w-sm">
                      {formatShippingAddress(order.shippingAddress) ? (
                        <div className="text-sm text-base-content/70">
                          {formatShippingAddress(order.shippingAddress)}
                        </div>
                      ) : (
                        <span className="text-sm text-base-content/45">
                          No shipping details
                        </span>
                      )}
                    </td>
                    <td className="whitespace-nowrap text-sm text-base-content/70">
                      {formatOrderWhen(order.createdAt)}
                    </td>
                    <td>
                      <div className="flex flex-wrap items-center gap-2">
                        <select
                          className="select select-sm select-bordered"
                          value={currentStatus}
                          onChange={(event) =>
                            setStatusDrafts((prev) => ({
                              ...prev,
                              [order.id]: event.target.value,
                            }))
                          }
                        >
                          {STATUS_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline gap-2"
                          disabled={
                            updateStatusMutation.isPending &&
                            updateStatusMutation.variables?.id === order.id
                          }
                          onClick={() =>
                            updateStatusMutation.mutate({
                              id: order.id,
                              status: currentStatus,
                            })
                          }
                        >
                          {updateStatusMutation.isPending &&
                          updateStatusMutation.variables?.id === order.id ? (
                            <span className="loading loading-spinner loading-xs" />
                          ) : (
                            <TruckIcon className="size-4" aria-hidden />
                          )}
                          Update
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminOrdersPage;
