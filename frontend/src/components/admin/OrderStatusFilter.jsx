import { getStatusConfig } from "../../lib/statusConfigAdminOrder";
import { STATUS_OPTIONS } from "../../utils/admin-order-utils";

export function OrderStatusFilter({
  statusFilter,
  onSelectFilter,
  statusCounts,
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        className={`badge gap-2 cursor-pointer px-3 py-2 text-sm font-medium transition-all ${
          statusFilter === "all"
            ? "badge-primary"
            : "badge-outline cursor-pointer hover:badge-primary/20"
        }`}
        onClick={() => onSelectFilter("all")}
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
          onClick={() => onSelectFilter(option.value)}
        >
          {option.label} ({statusCounts[option.value] || 0})
        </button>
      ))}
    </div>
  );
}
