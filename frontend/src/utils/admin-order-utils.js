export const STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "paid", label: "Paid" },
  { value: "failed", label: "Failed" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

export function statusBadgeClass(status) {
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

export function formatShippingAddress(address) {
  if (!address || typeof address !== "object") return null;

  const parts = [
    address.name || "",
    address.phone || "",
    address.address || "",
    [address.city, address.region, address.postalCode]
      .filter(Boolean)
      .join(" "),
    address.country || "",
  ].filter(Boolean);

  return parts.join(" • ");
}
