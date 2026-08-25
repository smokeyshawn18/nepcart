import {
  CheckoutSessionLine,
  checkoutSessions,
  orderItems,
  orders,
  products,
} from "../db/schema";
import { and, eq, inArray } from "drizzle-orm";

import { Address, CartItemInput, PaymentMethod } from "../types/checkout.types";
import { db } from "../db";
import { getEnv } from "../config/env";

const env = getEnv();

// ---- Errors -----------------------------------------------------------
// Thrown with an httpStatus so the controller can map them straight to a
// response without re-deriving status codes from string matching.

export class CheckoutError extends Error {
  httpStatus: number;
  details?: unknown;

  constructor(message: string, httpStatus = 400, details?: unknown) {
    super(message);
    this.name = "CheckoutError";
    this.httpStatus = httpStatus;
    this.details = details;
  }
}

// ---- Shared helpers -----------------------------------------------------

export async function resolveLineItems(items: CartItemInput[]) {
  const ids = items.map((i) => i.productId);

  const prodRows = await db
    .select()
    .from(products)
    .where(and(inArray(products.id, ids), eq(products.active, true)));

  if (prodRows.length !== ids.length) {
    throw new CheckoutError("One or more products are invalid", 400);
  }

  const byId = new Map(prodRows.map((p) => [p.id, p]));

  const currency =
    env.POLAR_PRESENTMENT_CURRENCY ?? prodRows[0].currency ?? "usd";

  for (const p of prodRows) {
    if (p.currency !== currency) {
      throw new CheckoutError(
        "All products in the checkout must use the same currency",
        400,
      );
    }
  }

  let totalCents = 0;
  const lines: CheckoutSessionLine[] = [];

  for (const item of items) {
    const p = byId.get(item.productId)!;
    totalCents += p.priceCents * item.quantity;
    lines.push({
      productId: p.id,
      quantity: item.quantity,
      unitPriceCents: p.priceCents,
    });
  }

  return { lines, totalCents, currency };
}

export async function insertCheckoutSession(params: {
  userId: string;
  shippingAddress: Address | null;
  billingAddress: Address | null;
  lines: CheckoutSessionLine[];
  totalCents: number;
  currency: string;
}) {
  const [session] = await db
    .insert(checkoutSessions)
    .values(params)
    .returning();
  return session;
}

export async function createOrderFromSession(
  tx: Parameters<Parameters<typeof db.transaction>[0]>[0],
  session: {
    id: string;
    userId: string;
    lines: CheckoutSessionLine[];
    totalCents: number;
    shippingAddress: Address | null;
  },
  paymentMethod: PaymentMethod,
  status: "pending" | "paid",
  options: { deleteSession?: boolean } = {},
) {
  const { deleteSession = true } = options;

  const [createdOrder] = await tx
    .insert(orders)
    .values({
      userId: session.userId,
      status,
      paymentMethod,
      shippingAddress: session.shippingAddress,
      totalCents: session.totalCents,
    })
    .returning();

  if (session.lines.length && createdOrder) {
    await tx.insert(orderItems).values(
      session.lines.map((line) => ({
        orderId: createdOrder.id,
        productId: line.productId,
        quantity: line.quantity,
        unitPriceCents: line.unitPriceCents,
      })),
    );
  }

  if (deleteSession) {
    await tx
      .delete(checkoutSessions)
      .where(eq(checkoutSessions.id, session.id));
  } else {
    // esewa's verify callback can legitimately be re-delivered (StrictMode
    // double-effect in dev, a page refresh, a client retry). Keep the
    // session row and stamp it with the resulting order so a repeat call
    // can short-circuit to the existing order instead of 404ing.
    await tx
      .update(checkoutSessions)
      .set({ orderId: createdOrder.id })
      .where(eq(checkoutSessions.id, session.id));
  }

  return createdOrder;
}
