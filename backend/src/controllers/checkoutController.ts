import type { Request, Response } from "express";
import { z } from "zod";
import { getAuth } from "@clerk/express";
import {
  createCheckout as createCheckoutService,
  verifyEsewaCheckout as verifyEsewaCheckoutService,
} from "../services/checkout.services";
import { CheckoutError } from "../utils/checkoutErrHelper";

const addressSchema = z.object({
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
  paymentMethod: z.enum(["polar", "cod", "esewa"]).default("polar"),
  shippingAddress: addressSchema.optional(),
  billingAddress: addressSchema.optional(),
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

    const result = await createCheckoutService({
      clerkUserId: userId,
      items: parsed.data.items,
      paymentMethod: parsed.data.paymentMethod,
      shippingAddress: parsed.data.shippingAddress,
      billingAddress: parsed.data.billingAddress,
    });

    if (result.kind === "redirect") {
      return res.json({ checkoutUrl: result.checkoutUrl });
    }

    if (result.kind === "form") {
      return res.json({
        paymentUrl: result.paymentUrl,
        paymentData: result.paymentData,
      });
    }

    return res.json({
      orderId: result.orderId,
      paymentMethod: result.paymentMethod,
    });
  } catch (err) {
    return handleError(err, res);
  }
}

// GET /api/checkout/esewa/verify?data=<base64>
// eSewa redirects the user's browser here after payment with a base64-encoded
// JSON payload in `data`. Verify it, cross-check against eSewa's status API,
// then finalize the order.
export async function verifyEsewaCheckout(req: Request, res: Response) {
  try {
    const data = req.query.data;

    if (typeof data !== "string") {
      return res.status(400).json({ error: "Missing data param" });
    }

    const result = await verifyEsewaCheckoutService(data);

    return res.json(result);
  } catch (err) {
    return handleError(err, res);
  }
}

function handleError(err: unknown, res: Response) {
  if (err instanceof CheckoutError) {
    return res.status(err.httpStatus).json({
      error: err.message,
      ...(err.details ? { details: err.details } : {}),
    });
  }

  if (err instanceof Error) {
    console.error("Message:", err.message);
    console.error("Stack:", err.stack);
  }

  return res.status(500).json({
    error: err instanceof Error ? err.message : "Internal server error",
  });
}
