import { getEnv } from "../config/env";
import { db } from "../db";
import { CheckoutSessionLine, checkoutSessions } from "../db/schema";
import { eq } from "drizzle-orm";
import { polarCreateCheckout } from "../lib/polar";
import {
  checkEsewaStatus,
  decodeEsewaResponse,
  generateEsewaSignature,
  verifyEsewaSignature,
} from "../lib/esewa";
import { getLocalUser } from "../lib/users";
import { Address, CreateCheckoutInput } from "../types/checkout.types";

import {
  CheckoutError,
  createOrderFromSession,
  insertCheckoutSession,
  resolveLineItems,
} from "../utils/checkout.utils";

const env = getEnv();

// ---- Main entrypoint ----------------------------------------------------

export async function createCheckout(input: CreateCheckoutInput) {
  const { paymentMethod, items } = input;

  if (paymentMethod === "polar" && !env.POLAR_ACCESS_TOKEN) {
    throw new CheckoutError("Payments are not configured", 503);
  }

  const localUser = await getLocalUser(input.clerkUserId);
  if (!localUser) {
    throw new CheckoutError("Account not synced yet", 503);
  }

  const { lines, totalCents, currency } = await resolveLineItems(items);

  if (paymentMethod === "polar" && totalCents < 10) {
    throw new CheckoutError("Total below Polar minimum", 400);
  }

  if (!input.shippingAddress) {
    throw new CheckoutError("Shipping address is required", 400);
  }

  const shippingAddress = input.shippingAddress ?? null;
  const billingAddress = input.billingAddress ?? null;

  if (paymentMethod === "polar") {
    return createPolarCheckout({
      userId: localUser.id,
      clerkUserId: input.clerkUserId,
      shippingAddress,
      billingAddress,
      lines,
      totalCents,
      currency,
    });
  }

  if (paymentMethod === "esewa") {
    return createEsewaCheckout({
      userId: localUser.id,
      shippingAddress,
      billingAddress,
      lines,
      totalCents,
      currency,
    });
  }

  return createCodOrder({
    userId: localUser.id,
    shippingAddress,
    billingAddress,
    lines,
    totalCents,
    currency,
  });
}

// ---- Polar ---------------------------------------------------------------

async function createPolarCheckout(params: {
  userId: string;
  clerkUserId: string;
  shippingAddress: Address | null;
  billingAddress: Address | null;
  lines: CheckoutSessionLine[];
  totalCents: number;
  currency: string;
}) {
  const session = await insertCheckoutSession(params);

  const successUrl = `${env.FRONTEND_URL}/checkout/return?checkout_id={CHECKOUT_ID}`;
  const returnUrl = `${env.FRONTEND_URL}/cart`;

  const checkout = await polarCreateCheckout(env, {
    products: [env.POLAR_CHECKOUT_PRODUCT_ID],
    prices: {
      [env.POLAR_CHECKOUT_PRODUCT_ID]: [
        {
          amount_type: "fixed",
          price_currency: params.currency,
          price_amount: params.totalCents,
        },
      ],
    },
    success_url: successUrl,
    return_url: returnUrl,
    external_customer_id: params.clerkUserId,
    metadata: {
      checkout_session_id: session.id,
    },
  });

  await db
    .update(checkoutSessions)
    .set({ polarCheckoutId: checkout.id })
    .where(eq(checkoutSessions.id, session.id));

  return { kind: "redirect" as const, checkoutUrl: checkout.url };
}

// ---- Cash on delivery ------------------------------------------------------

async function createCodOrder(params: {
  userId: string;
  shippingAddress: Address | null;
  billingAddress: Address | null;
  lines: CheckoutSessionLine[];
  totalCents: number;
  currency: string;
}) {
  const order = await db.transaction(async (tx) => {
    const [session] = await tx
      .insert(checkoutSessions)
      .values(params)
      .returning();

    return createOrderFromSession(
      tx,
      { ...session, userId: params.userId },
      "cod",
      "pending",
    );
  });

  return {
    kind: "order" as const,
    orderId: order.id,
    paymentMethod: "cod" as const,
  };
}

// ---- eSewa -----------------------------------------------------------------
// eSewa expects a decimal rupee amount (e.g. "150.00"), not subunits like
// Polar's cents. Confirm priceCents is genuinely in cents before trusting
// this conversion in production.

function centsToEsewaAmount(totalCents: number): string {
  return (totalCents / 100).toFixed(2);
}

async function createEsewaCheckout(params: {
  userId: string;
  shippingAddress: Address | null;
  billingAddress: Address | null;
  lines: CheckoutSessionLine[];
  totalCents: number;
  currency: string;
}) {
  const session = await insertCheckoutSession(params);

  const totalAmount = centsToEsewaAmount(params.totalCents);
  const transactionUuid = `${session.id}-${Date.now()}`;

  const message = `total_amount=${totalAmount},transaction_uuid=${transactionUuid},product_code=${env.ESEWA_MERCHANT_CODE}`;
  const signature = generateEsewaSignature(message, env.ESEWA_SECRET_KEY);

  await db
    .update(checkoutSessions)
    .set({ providerRef: transactionUuid })
    .where(eq(checkoutSessions.id, session.id));
  //   console.log(
  //     "[eSewa create] wrote providerRef:",
  //     transactionUuid,
  //     "for session:",
  //     session.id,
  //   );
  return {
    kind: "form" as const,
    paymentUrl: env.ESEWA_PAYMENT_URL,
    paymentData: {
      amount: totalAmount,
      total_amount: totalAmount,
      tax_amount: "0",
      product_service_charge: "0",
      product_delivery_charge: "0",
      product_code: env.ESEWA_MERCHANT_CODE,
      transaction_uuid: transactionUuid,
      success_url: `${env.FRONTEND_URL}/checkout/esewa/return`,
      failure_url: `${env.FRONTEND_URL}/checkout/esewa/failure`,
      signed_field_names: "total_amount,transaction_uuid,product_code",
      signature,
    },
  };
}

export async function verifyEsewaCheckout(encodedData: string) {
  const payload = decodeEsewaResponse(encodedData);

  // eSewa's callback signs signed_field_names itself as one of the fields
  // (unlike the initiation request, which only signs
  // total_amount,transaction_uuid,product_code) - it must be included here
  // or the reconstructed message won't match what eSewa actually signed.
  const validSig = verifyEsewaSignature(
    {
      transaction_code: payload.transaction_code,
      status: payload.status,
      total_amount: payload.total_amount,
      transaction_uuid: payload.transaction_uuid,
      product_code: payload.product_code,
      signed_field_names: payload.signed_field_names,
    },
    payload.signed_field_names,
    env.ESEWA_SECRET_KEY,
    payload.signature,
  );

  if (!validSig) {
    throw new CheckoutError("Invalid signature", 400);
  }

  // Look up the session before hitting eSewa's status API — lets a repeat
  // call (StrictMode double-effect, a page refresh, a retried request)
  // short-circuit to the already-created order instead of re-verifying
  // and failing on a session that's legitimately already been consumed.

  //   console.log("[eSewa verify] decoded payload:", payload);
  //   console.log(
  //     "[eSewa verify] looking up transaction_uuid:",
  //     payload.transaction_uuid,
  //   );

  const [session] = await db
    .select()
    .from(checkoutSessions)
    .where(eq(checkoutSessions.providerRef, payload.transaction_uuid));

  if (!session) {
    throw new CheckoutError("Checkout session not found", 404);
  }
  // console.log("[eSewa verify] session found:", session);

  if (session.orderId) {
    return { orderId: session.orderId, paymentMethod: "esewa" as const };
  }

  // Don't trust the redirect payload alone (it's a plain GET the user's
  // browser makes and could in principle be replayed) — confirm against
  // eSewa's own record before creating the order.
  const statusResult = await checkEsewaStatus({
    statusCheckUrl: env.ESEWA_STATUS_CHECK_URL,
    productCode: env.ESEWA_MERCHANT_CODE,
    totalAmount: payload.total_amount,
    transactionUuid: payload.transaction_uuid,
  });

  if (statusResult.status !== "COMPLETE") {
    throw new CheckoutError("Payment not completed", 400, {
      status: statusResult.status,
    });
  }

  const order = await db.transaction(async (tx) =>
    createOrderFromSession(tx, session, "esewa", "paid", {
      deleteSession: false,
    }),
  );

  return { orderId: order.id, paymentMethod: "esewa" as const };
}
