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
