import { ChevronRightIcon, PackageIcon } from "lucide-react";
import { OrdersListSkeleton } from "../components/LoadingSkeletons";
import { PageError } from "../components/PageError";
import useOrdersPage from "../hooks/useOrdersPage";
import { Link } from "react-router";
import { OrderPreview } from "../components/OrderPreview";
import { formatOrderWhen, formatPrice } from "../utils/format";

function OrdersPage() {
  const { isLoading, error, orders, staff } = useOrdersPage();

  if (isLoading) {
    return (
      <div className="text-left">
        <div className="skeleton mb-2 h-10 w-64 max-w-full" />
        <div className="skeleton mb-8 h-4 w-96 max-w-full" />
        <OrdersListSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <PageError message="Could not load orders." action={{ to: "/", label: "Back to shop" }} />
    );
  }

  return (
    <div className="text-left">
      <h1 className="mb-2 flex items-center gap-2 text-3xl font-bold text-base-content">
        <PackageIcon className="size-8 text-primary" aria-hidden />
        {staff ? "Orders" : "Your orders"}
      </h1>

      <p className="mb-8 text-sm text-base-content/70">
        {staff
          ? "All store orders. Open one for customer support chat."
          : "Paid orders include customer support: open an order for chat."}
      </p>

      {orders.length === 0 ? (
        <p className="text-base-content/70">
          No orders yet.{" "}
          <Link to="/" className="link link-primary">
            Browse the shop
          </Link>
        </p>
      ) : (
        <ul className="space-y-4">
          {orders.map((o) => {
            const previewItems = o.previewItems ?? [];
            const totalUnits = previewItems.reduce((sum, row) => sum + row.quantity, 0);
            const lineCount = previewItems.length;
            const summary =
              lineCount === 0
                ? "No line items"
                : lineCount === 1
                  ? `${totalUnits} ${totalUnits === 1 ? "item" : "items"}`
                  : `${lineCount} products · ${totalUnits} items`;

            return (
              <li key={o.id}>
                <Link
                  to={`/orders/${o.id}`}
                  className="group card border border-base-300 bg-base-100 shadow-sm transition hover:border-primary/45 hover:shadow-md"
                >
                  <div className="card-body flex-row flex-wrap items-center gap-4 py-5 sm:gap-5">
                    <OrderPreview items={previewItems} />

                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs text-base-content/55 sm:text-sm">
                          {o.id.slice(0, 8)}…
                        </span>

                        <span
                          className={`badge badge-sm capitalize ${
                            o.status === "paid"
                              ? "badge-success"
                              : o.status === "pending"
                                ? "badge-warning"
                                : "badge-error"
                          }`}
                        >
                          {o.status}
                        </span>
                      </div>

                      <p className="mt-1 text-sm text-base-content/60">
                        {formatOrderWhen(o.createdAt)}
                      </p>

                      <p className="mt-2 text-sm text-base-content/75">{summary}</p>
                    </div>

                    <div className="flex shrink-0 items-center gap-3">
                      <div className="text-right">
                        <p className="text-xs font-medium uppercase tracking-wide text-base-content/50">
                          Total
                        </p>
                        <p className="text-lg font-bold tabular-nums text-base-content sm:text-xl">
                          {formatPrice(o.totalCents, "usd")}
                        </p>
                      </div>
                      <ChevronRightIcon
                        className="size-5 shrink-0 text-base-content/40 transition group-hover:translate-x-0.5 group-hover:text-primary"
                        aria-hidden
                      />
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
export default OrdersPage;
