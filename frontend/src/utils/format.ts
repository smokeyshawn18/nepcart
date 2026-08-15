export function formatPrice(
  arg: number | { cents: number; currency?: string },
  maybeCurrency?: string,
) {
  let cents: number | undefined;
  let currency: string | undefined;

  if (typeof arg === "number") {
    cents = arg;
    currency = maybeCurrency;
  } else if (arg && typeof arg === "object") {
    cents = arg.cents;
    currency = arg.currency;
  }

  const c = Number(cents ?? NaN);
  if (!Number.isFinite(c)) return "";

  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: (currency ?? "npr").toUpperCase(),
  }).format(c / 100);
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
