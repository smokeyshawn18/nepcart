import { useState } from "react";
import { Navigate, Link } from "react-router";
import { useAuth } from "@clerk/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ClipboardListIcon,
  TruckIcon,
  MapPinIcon,
  CreditCardIcon,
  ChevronDownIcon,
  CheckCircle2Icon,
  ClockIcon,
  AlertCircleIcon,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { OrdersListSkeleton } from "../../components/LoadingSkeletons.jsx";
import { PageError } from "../../components/PageError";
import { apiFetch } from "../../lib/api.js";
import { formatOrderWhen, formatPrice } from "../../utils/format.js";
import {
  statusBadgeClass,
  formatShippingAddress,
  STATUS_OPTIONS,
} from "../../utils/admin-order-utils.js";

const statusConfig = {
  pending: { icon: ClockIcon, color: "bg-warning", accent: "border-l-warning" },
  processing: {
    icon: TruckIcon,
    color: "bg-info",
    accent: "border-l-info",
  },
  shipped: { icon: TruckIcon, color: "bg-primary", accent: "border-l-primary" },
  delivered: {
    icon: CheckCircle2Icon,
    color: "bg-success",
    accent: "border-l-success",
  },
  cancelled: {
    icon: AlertCircleIcon,
    color: "bg-error",
    accent: "border-l-error",
  },
};

const defaultStatusConfig = {
  icon: ClipboardListIcon,
  color: "bg-base-content/20",
  accent: "border-l-base-content/20",
};

function getStatusConfig(status) {
  return statusConfig[status] || defaultStatusConfig;
}

function StatusIcon({ status }) {
  const config = getStatusConfig(status);
  const Icon = config.icon;
  return <Icon className="size-5" />;
}

function OrderCard({ order, onStatusChange, isPending, currentStatus }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const config = getStatusConfig(currentStatus);

  return (
    <div
      className={`rounded-lg border border-base-300 bg-base-100 shadow-sm transition-all hover:shadow-md ${config.accent} border-l-4`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 p-4 md:flex-row md:items-center md:p-6">
        <div className="flex-1 space-y-1">
          <Link
            to={`/orders/${order.id}`}
            className="font-mono text-lg font-bold text-primary hover:underline"
          >
            #{order.id.slice(0, 8)}
          </Link>
          <div className="text-sm font-medium text-base-content">
            {order.user?.displayName ?? "Unknown customer"}
          </div>
          <div className="text-xs text-base-content/60">
            {order.user?.email ?? "No email"}
          </div>
        </div>

        <div className="flex flex-col items-end gap-3">
          <div className="text-right">
            <div className="text-sm text-base-content/60">Total</div>
            <div className="text-2xl font-bold text-base-content">
              {formatPrice(order.totalCents ?? 0)}
            </div>
          </div>
          <div className={`badge badge-lg gap-1 ${config.color}`}>
            <StatusIcon status={currentStatus} />
            <span className="capitalize">{currentStatus}</span>
          </div>
        </div>
      </div>

      {/* Quick Info Row */}
      <div className="border-t border-base-300 px-4 py-3 md:px-6">
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <div className="text-xs font-semibold uppercase text-base-content/50">
              Payment
            </div>
            <div className="mt-1 flex items-center gap-1 text-sm text-base-content">
              <CreditCardIcon className="size-4" />
              <span className="uppercase">
                {order.paymentMethod === "cod"
                  ? "COD"
                  : (order.paymentMethod ?? "Polar")}
              </span>
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold uppercase text-base-content/50">
              Ordered
            </div>
            <div className="mt-1 text-sm text-base-content">
              {formatOrderWhen(order.createdAt)}
            </div>
          </div>

          <div className="sm:col-span-2 md:col-span-2">
            <div className="text-xs font-semibold uppercase text-base-content/50">
              Shipping
            </div>
            <div className="mt-1 flex items-start gap-1">
              <MapPinIcon className="mt-0.5 size-4 flex-shrink-0" />
              <div className="text-sm text-base-content">
                {formatShippingAddress(order.shippingAddress) || "No address"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="border-t border-base-300 px-4 py-4 md:px-6">
        <div className="mb-3 text-xs font-semibold uppercase text-base-content/50">
          Products
        </div>

        {order.previewItems?.length > 0 ? (
          <div className="space-y-3">
            {order.previewItems.map((item, index) => (
              <div
                key={`${order.id}-${item.slug}-${index}`}
                className="flex items-center gap-3"
              >
                {/* Product Image */}
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="size-14 rounded-lg object-cover"
                  />
                ) : (
                  <div className="flex size-14 items-center justify-center rounded-lg bg-base-200 text-xs text-base-content/40">
                    No image
                  </div>
                )}

                {/* Product Info */}
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-base-content">
                    {item.name}
                  </div>

                  <div className="text-sm text-base-content/60">
                    Quantity: {item.quantity}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-base-content/50">No products found</p>
        )}
      </div>
      {/* Status Update & Details Toggle */}
      <div className="border-t border-base-300 bg-base-200/30 px-4 py-3 md:px-6">
        <div className="flex flex-col items-stretch gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-2 md:flex-row md:items-center">
            <select
              className="select select-sm select-bordered min-w-40"
              value={currentStatus}
              onChange={(e) => onStatusChange(order.id, e.target.value)}
              disabled={isPending}
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="btn btn-sm btn-primary gap-2"
              disabled={isPending}
              onClick={() => onStatusChange(order.id, currentStatus, true)}
            >
              {isPending ? (
                <span className="loading loading-spinner loading-xs" />
              ) : (
                <TruckIcon className="size-4" />
              )}
              Update Status
            </button>
          </div>

          <button
            type="button"
            className="btn btn-ghost btn-sm gap-1"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? "Less details" : "More details"}
            <ChevronDownIcon
              className={`size-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Expandable Details */}
      {isExpanded && (
        <div className="border-t border-base-300 px-4 py-4 md:px-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-3">
              <div>
                <div className="mb-2 text-xs font-semibold uppercase text-base-content/50">
                  Shipping Address
                </div>
                <div className="rounded bg-base-200/50 p-3 text-sm text-base-content">
                  {formatShippingAddress(order.shippingAddress) ||
                    "No address provided"}
                </div>
              </div>
              {formatShippingAddress(order.billingAddress) && (
                <div>
                  <div className="mb-2 text-xs font-semibold uppercase text-base-content/50">
                    Billing Address
                  </div>
                  <div className="rounded bg-base-200/50 p-3 text-sm text-base-content">
                    {formatShippingAddress(order.billingAddress)}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div>
                <div className="mb-2 text-xs font-semibold uppercase text-base-content/50">
                  Order Details
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-base-content/70">Order ID:</span>
                    <span className="font-mono font-semibold">{order.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-base-content/70">Customer ID:</span>
                    <span className="font-mono text-xs">{order.userId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-base-content/70">Created:</span>
                    <span>{new Date(order.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AdminOrdersPage() {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const queryClient = useQueryClient();
  const [statusDrafts, setStatusDrafts] = useState({});
  const [statusFilter, setStatusFilter] = useState("all");

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

  if (!isSignedIn) return <Navigate to="/" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;

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
      {/* Header */}
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

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          <button
            className={`badge gap-2 cursor-pointer px-3 py-2 text-sm font-medium transition-all ${
              statusFilter === "all"
                ? "badge-primary"
                : "badge-outline cursor-pointer hover:badge-primary/20"
            }`}
            onClick={() => setStatusFilter("all")}
          >
            All Orders ({statusCounts.all})
          </button>
          {STATUS_OPTIONS.map((option) => (
            <button
              key={option.value}
              className={`badge gap-2 cursor-pointer px-3 py-2 text-sm font-medium transition-all ${
                statusFilter === option.value
                  ? getStatusConfig(option.value).color
                  : "badge-outline hover:badge-outline"
              }`}
              onClick={() => setStatusFilter(option.value)}
            >
              {option.label} ({statusCounts[option.value] || 0})
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
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

export default AdminOrdersPage;
