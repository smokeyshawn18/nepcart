import { useState } from "react";
import { Link } from "react-router-dom";
import {
  TruckIcon,
  MapPinIcon,
  CreditCardIcon,
  ChevronDownIcon,
} from "lucide-react";
import { formatOrderWhen, formatPrice } from "../../utils/format.js";
import {
  formatShippingAddress,
  STATUS_OPTIONS,
} from "../../utils/admin-order-utils.js";
import { getStatusConfig } from "../../lib/statusConfigAdminOrder.js";

function StatusIcon({ status }) {
  const config = getStatusConfig(status);
  const Icon = config.icon;
  return <Icon className="size-5" />;
}

export function OrderCard({ order, onStatusChange, isPending, currentStatus }) {
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
              <MapPinIcon className="mt-0.5 size-4 shrink-0" />
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
