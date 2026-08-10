export function formatPrice({
  cents,
  currency,
}: {
  cents: number;
  currency?: string;
}) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: (currency ?? "npr").toUpperCase(),
  }).format(cents / 100);
}

export function formatOrderWhen({
  iso,
  opts = {},
}: {
  iso?: string;
  opts?: { dateStyle?: Intl.DateTimeFormatOptions["dateStyle"] };
} = {}) {
  const { dateStyle = "medium" } = opts;
  if (!iso) return "";

  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat(undefined, {
    dateStyle,
    timeStyle: "short",
  }).format(date);
}
