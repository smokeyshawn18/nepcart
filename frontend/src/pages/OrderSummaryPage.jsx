import { ListOrderedIcon, PackageIcon } from "lucide-react";
import { Link, useOutletContext } from "react-router";
import { IK_PRESETS, imageKitOptimizedUrl } from "../lib/imagekitUrl";
import { formatPrice } from "../utils/format";

function OrderSummaryPage() {
  const { order, items } = useOutletContext();

  return (
    <div className="overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-md">
      <div className="border-b border-base-300 bg-base-200/40 px-5 py-4 sm:px-6">
        <h2 className="flex items-center gap-2 text-lg font-bold text-base-content">
          <ListOrderedIcon className="size-5 text-primary" aria-hidden />
          Line items
        </h2>
        <p className="mt-1 text-sm text-base-content/60">
          {items.length} {items.length === 1 ? "product" : "products"} in this order
        </p>
      </div>

      <ul className="divide-y divide-base-300">
        {items.map((row) => (
          <li key={row.id} className="px-4 py-5 sm:px-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6 sm:justify-between">
              <div className="flex flex-1 gap-4">
                <Link
                  to={`/product/${row.product.slug}`}
                  className="group/img relative shrink-0 overflow-hidden rounded-xl border border-base-300 bg-base-200 shadow-sm ring-1 ring-base-300/30 transition hover:ring-primary/40"
                >
                  <div className="h-24 w-24 sm:h-28 sm:w-28">
                    {row.product.imageUrl ? (
                      <img
                        src={imageKitOptimizedUrl(row.product.imageUrl, IK_PRESETS.orderLineThumb)}
                        alt=""
                        className="h-full w-full object-cover transition duration-300 group-hover/img:scale-[1.03]"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-base-300 to-base-200">
                        <PackageIcon className="size-10 text-base-content/30" aria-hidden />
                      </div>
                    )}
                  </div>
                </Link>

                <div className="min-w-0 flex-1">
                  <Link
                    to={`/product/${row.product.slug}`}
                    className="link link-hover text-lg font-semibold leading-snug text-base-content"
                  >
                    {row.product.name}
                  </Link>
                  {row.product.category ? (
                    <p className="mt-1 text-sm text-base-content/55">{row.product.category}</p>
                  ) : null}
                  <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-base-content/65">
                    <span>Qty {row.quantity}</span>
                    <span className="text-base-content/40">·</span>
                    <span>{formatPrice(row.unitPriceCents, row.product.currency)} each</span>
                  </div>
                </div>
              </div>

              <div className="flex shrink-0 flex-col border-t border-base-300 pt-3 sm:border-t-0 sm:pt-0 sm:text-right">
                <span className="text-xs font-medium uppercase tracking-wide text-base-content/45">
                  Subtotal
                </span>
                <span className="text-xl font-bold tabular-nums text-base-content">
                  {formatPrice(row.unitPriceCents * row.quantity, row.product.currency)}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-between gap-4 border-t border-base-300 bg-base-200/50 px-5 py-5 sm:px-6">
        <span className="text-lg font-semibold text-base-content">Total</span>
        <span className="text-2xl font-bold tabular-nums text-primary">
          {formatPrice(order.totalCents, "usd")}
        </span>
      </div>
    </div>
  );
}
export default OrderSummaryPage;
