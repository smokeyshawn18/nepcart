import type { Request, Response } from "express";
import { getEnv } from "../config/env";
import z from "zod";
import { getAuth } from "@clerk/express";
import { getLocalUser } from "../lib/users";
import { db } from "../db";
import {
  CheckoutSessionLine,
  checkoutSessions,
  orderItems,
  orders,
  products,
} from "../db/schema";
import { and, eq, inArray } from "drizzle-orm";
import { polarCreateCheckout } from "../lib/polar";

const env = getEnv();

const shippingAddressSchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(1),
  address: z.string().min(1),
  city: z.string().min(1),
  postalCode: z.string().min(1),
  region: z.string().optional(),
  country: z.string().optional(),
  notes: z.string().optional(),
});

const cartSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().uuid(),
        quantity: z.number().int().positive(),
      }),
    )
    .min(1),
  paymentMethod: z.enum(["polar", "cod"]).default("polar"),
  shippingAddress: shippingAddressSchema.optional(),
});

export async function createCheckout(req: Request, res: Response) {
  try {
    const { userId, isAuthenticated } = getAuth(req);

    if (!isAuthenticated || !userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const parsed = cartSchema.safeParse(req.body);

    if (!parsed.success) {
      console.error("Validation Error:", parsed.error.flatten());
      return res.status(400).json({
        error: "Invalid cart",
        details: parsed.error.flatten(),
      });
    }

    console.log("Parsed Cart:", parsed.data);

    const paymentMethod = parsed.data.paymentMethod;

    if (paymentMethod === "polar" && !env.POLAR_ACCESS_TOKEN) {
      return res.status(503).json({
        error: "Payments are not configured",
      });
    }

    const localUser = await getLocalUser(userId);

    if (!localUser) {
      return res.status(503).json({
        error: "Account not synced yet",
      });
    }

    const ids = parsed.data.items.map((i) => i.productId);
    console.log("Product IDs:", ids);

    const prodRows = await db
      .select()
      .from(products)
      .where(and(inArray(products.id, ids), eq(products.active, true)));

    if (prodRows.length !== ids.length) {
      return res.status(400).json({
        error: "One or more products are invalid",
      });
    }

    const byId = new Map(prodRows.map((p) => [p.id, p]));

    const currency =
      env.POLAR_PRESENTMENT_CURRENCY ?? prodRows[0].currency ?? "usd";
    for (const p of prodRows) {
      if (p.currency !== currency) {
        return res.status(400).json({
          error: "All products in the checkout must use the same currency",
        });
      }
    }

    let totalCents = 0;
    const lines: CheckoutSessionLine[] = [];

    for (const line of parsed.data.items) {
      const p = byId.get(line.productId)!;

      totalCents += p.priceCents * line.quantity;

      lines.push({
        productId: p.id,
        quantity: line.quantity,
        unitPriceCents: p.priceCents,
      });
    }

    if (paymentMethod === "polar" && totalCents < 10) {
      return res.status(400).json({
        error: "Total below Polar minimum",
      });
    }

    if (paymentMethod === "cod" && !parsed.data.shippingAddress) {
      return res.status(400).json({
        error: "Shipping address is required for cash on delivery",
      });
    }

    const shippingAddress = parsed.data.shippingAddress ?? null;

    if (paymentMethod === "polar") {
      console.log("Creating checkout session in DB...");

      const [session] = await db
        .insert(checkoutSessions)
        .values({
          userId: localUser.id,
          shippingAddress,
          lines,
          totalCents,
          currency,
        })
        .returning();

      const successUrl = `${env.FRONTEND_URL}/checkout/return?checkout_id={CHECKOUT_ID}`;
      const returnUrl = `${env.FRONTEND_URL}/cart`;

      const checkout = await polarCreateCheckout(env, {
        products: [env.POLAR_CHECKOUT_PRODUCT_ID],
        prices: {
          [env.POLAR_CHECKOUT_PRODUCT_ID]: [
            {
              amount_type: "fixed",
              price_currency: currency,
              price_amount: totalCents,
            },
          ],
        },
        success_url: successUrl,
        return_url: returnUrl,
        external_customer_id: userId,
        metadata: {
          checkout_session_id: session.id,
        },
      });

      await db
        .update(checkoutSessions)
        .set({
          polarCheckoutId: checkout.id,
        })
        .where(eq(checkoutSessions.id, session.id));

      return res.json({
        checkoutUrl: checkout.url,
      });
    }

    const [order] = await db.transaction(async (tx) => {
      const [session] = await tx
        .insert(checkoutSessions)
        .values({
          userId: localUser.id,
          shippingAddress,
          lines,
          totalCents,
          currency,
        })
        .returning();

      const [createdOrder] = await tx
        .insert(orders)
        .values({
          userId: localUser.id,
          status: "pending",
          paymentMethod,
          shippingAddress,
          totalCents,
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

      await tx
        .delete(checkoutSessions)
        .where(eq(checkoutSessions.id, session.id));

      return [createdOrder];
    });

    return res.json({
      orderId: order.id,
      paymentMethod: "cod",
    });
  } catch (err) {
    if (err instanceof Error) {
      console.error("Message:", err.message);
      console.error("Stack:", err.stack);
    }

    return res.status(500).json({
      error: err instanceof Error ? err.message : "Internal server error",
    });
  }
}
