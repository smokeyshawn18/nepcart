import type { Request, Response } from "express";
import { getEnv } from "../lib/env";
import z from "zod";
import { getAuth } from "@clerk/express";
import { getLocalUser } from "../lib/users";
import { db } from "../db";
import { CheckoutSessionLine, checkoutSessions, products } from "../db/schema";
import { and, eq, inArray } from "drizzle-orm";
import { polarCreateCheckout } from "../lib/polar";

const env = getEnv();

const cartSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().uuid(),
        quantity: z.number().int().positive(),
      }),
    )
    .min(1),
});

export async function createCheckout(req: Request, res: Response) {
  try {
    console.log("\n========== CHECKOUT START ==========");

    const { userId, isAuthenticated } = getAuth(req);
    console.log("Auth:", { userId, isAuthenticated });

    if (!isAuthenticated || !userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    console.log("Request Body:", req.body);

    const parsed = cartSchema.safeParse(req.body);

    if (!parsed.success) {
      console.error("Validation Error:", parsed.error.flatten());
      return res.status(400).json({
        error: "Invalid cart",
        details: parsed.error.flatten(),
      });
    }

    console.log("Parsed Cart:", parsed.data);

    console.log("POLAR_ACCESS_TOKEN:", !!env.POLAR_ACCESS_TOKEN);
    console.log("POLAR_CHECKOUT_PRODUCT_ID:", env.POLAR_CHECKOUT_PRODUCT_ID);
    console.log("FRONTEND_URL:", env.FRONTEND_URL);

    if (!env.POLAR_ACCESS_TOKEN) {
      return res.status(503).json({
        error: "Payments are not configured",
      });
    }

    const localUser = await getLocalUser(userId);
    console.log("Local User:", localUser);

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

    console.log("Products Found:", prodRows);

    if (prodRows.length !== ids.length) {
      return res.status(400).json({
        error: "One or more products are invalid",
      });
    }

    const byId = new Map(prodRows.map((p) => [p.id, p]));

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

    console.log("Checkout Lines:", lines);
    console.log("Total:", totalCents);

    if (totalCents < 10) {
      return res.status(400).json({
        error: "Total below Polar minimum",
      });
    }

    console.log("Creating checkout session in DB...");

    const [session] = await db
      .insert(checkoutSessions)
      .values({
        userId: localUser.id,
        lines,
        totalCents,
        currency: "usd",
      })
      .returning();

    console.log("Checkout Session:", session);

    const successUrl = `${env.FRONTEND_URL}/checkout/return?checkout_id={CHECKOUT_ID}`;
    const returnUrl = `${env.FRONTEND_URL}/cart`;

    console.log("Calling Polar API...");

    const checkout = await polarCreateCheckout(env, {
      products: [env.POLAR_CHECKOUT_PRODUCT_ID],
      prices: {
        [env.POLAR_CHECKOUT_PRODUCT_ID]: [
          {
            amount_type: "fixed",
            price_currency: "usd",
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

    console.log("Polar Response:", checkout);

    await db
      .update(checkoutSessions)
      .set({
        polarCheckoutId: checkout.id,
      })
      .where(eq(checkoutSessions.id, session.id));

    console.log("Checkout completed successfully");
    console.log("========== CHECKOUT END ==========\n");

    return res.json({
      checkoutUrl: checkout.url,
    });
  } catch (err) {
    console.error("\n========== CHECKOUT ERROR ==========");
    console.error(err);

    if (err instanceof Error) {
      console.error("Message:", err.message);
      console.error("Stack:", err.stack);
    }

    console.error("===================================\n");

    return res.status(500).json({
      error: err instanceof Error ? err.message : "Internal server error",
    });
  }
}
