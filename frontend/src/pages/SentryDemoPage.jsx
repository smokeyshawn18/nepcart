import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router";
import * as Sentry from "@sentry/react";

/** Attributes for Sentry Logs  */
function logDemo(extra = {}) {
  return { "demo.tutorial": true, ...extra };
}

function checkoutBreadcrumbs() {
  Sentry.addBreadcrumb({
    category: "checkout",
    message: "Shipping address validated",
    level: "info",
    data: { country: "US", region: "CA" },
  });
  Sentry.addBreadcrumb({
    category: "checkout",
    message: "Cart totals recomputed",
    level: "info",
    data: { subtotalUsd: 184.5, lineCount: 3 },
  });
}

function applyDemoScope(scope, scenarioId) {
  scope.setTag("demo.tutorial", "true");
  scope.setTag("demo.scenario", scenarioId);
}

function sendPaymentDeclinedError() {
  const paymentIntentId = "pi_demo_3k9x";
  Sentry.logger.info(
    Sentry.logger.fmt`Confirming payment intent ${paymentIntentId}`,
    logDemo({
      area: "payments",
      paymentIntentId,
      amountUsd: 184.5,
      currency: "usd",
    }),
  );
  checkoutBreadcrumbs();
  Sentry.addBreadcrumb({
    category: "payment",
    message: "Submitting charge to processor",
    level: "info",
    data: { processor: "stripe", paymentIntentId: "pi_demo_3k9x" },
  });
  Sentry.logger.warn(
    "Issuer auth result: declined (demo)",
    logDemo({
      area: "payments",
      declineCode: "card_declined",
      networkDeclineCode: "05",
    }),
  );
  Sentry.logger.error(
    "Charge failed after issuer decision",
    logDemo({
      area: "payments",
      processor: "stripe",
      declineCode: "card_declined",
      last4: "4242",
    }),
  );
  Sentry.withScope((scope) => {
    applyDemoScope(scope, "payment_declined");
    scope.setTag("area", "payments");
    scope.setTag("payment.processor", "stripe");
    scope.setLevel("error");
    scope.setContext("payment", {
      amountUsd: 184.5,
      currency: "usd",
      last4: "4242",
      declineCode: "card_declined",
      networkDeclineCode: "05",
    });
    Sentry.captureException(new Error("Charge failed: card_declined — Do not honor (issuer)."));
  });
}

function sendInsufficientStockError() {
  Sentry.logger.debug(
    "Inventory: loading availability for cart lines",
    logDemo({
      area: "inventory",
      lineCount: 3,
    }),
  );
  checkoutBreadcrumbs();
  Sentry.addBreadcrumb({
    category: "inventory",
    message: "Reserving line items",
    level: "info",
  });
  Sentry.logger.info(
    "Inventory: reserving SKU NW-KEY-01",
    logDemo({
      area: "inventory",
      sku: "NW-KEY-01",
      requested: 2,
    }),
  );
  Sentry.logger.error(
    "Reservation failed: insufficient on-hand quantity",
    logDemo({
      area: "inventory",
      sku: "NW-KEY-01",
      requested: 2,
      available: 0,
      warehouse: "US-WEST-1",
    }),
  );
  Sentry.withScope((scope) => {
    applyDemoScope(scope, "insufficient_stock");
    scope.setTag("area", "inventory");
    scope.setTag("sku", "NW-KEY-01");
    scope.setContext("inventory", {
      sku: "NW-KEY-01",
      requested: 2,
      available: 0,
      warehouse: "US-WEST-1",
    });
    Sentry.captureException(
      new Error("Cannot reserve inventory: insufficient quantity for SKU NW-KEY-01."),
    );
  });
}

function sendShippingTimeoutError() {
  Sentry.logger.info(
    "Shipping: requesting live carrier rates",
    logDemo({
      area: "shipping",
      carrier: "ups",
      originZip: "94107",
      destZip: "10001",
    }),
  );
  checkoutBreadcrumbs();
  Sentry.addBreadcrumb({
    category: "shipping",
    message: "Requesting carrier rates",
    level: "info",
    data: { carrier: "UPS" },
  });
  Sentry.logger.warn(
    "UPS rating call exceeded client deadline; retry exhausted",
    logDemo({
      area: "shipping",
      attempt: 2,
      timeoutMs: 15000,
    }),
  );
  Sentry.logger.error(
    "Carrier rating request timed out",
    logDemo({
      area: "shipping",
      carrier: "ups",
      endpoint: "/rating/v1/shop",
    }),
  );
  Sentry.withScope((scope) => {
    applyDemoScope(scope, "carrier_timeout");
    scope.setTag("area", "shipping");
    scope.setTag("carrier", "ups");
    scope.setContext("shipping", {
      originZip: "94107",
      destZip: "10001",
      timeoutMs: 15000,
      attempt: 2,
    });
    Sentry.captureException(
      new Error("Carrier rate request timed out after 15000ms (UPS REST /rating)."),
    );
  });
}

function sendTaxServiceError() {
  Sentry.logger.info(
    "Tax: computing for checkout session",
    logDemo({
      area: "tax",
      provider: "vertex",
      jurisdiction: "US-CA-SF",
    }),
  );
  checkoutBreadcrumbs();
  Sentry.logger.error(
    "Tax engine rejected ship-from for jurisdiction",
    logDemo({
      area: "tax",
      provider: "vertex",
      httpStatus: 422,
      jurisdiction: "US-CA-SF",
    }),
  );
  Sentry.withScope((scope) => {
    applyDemoScope(scope, "tax_calculation");
    scope.setTag("area", "tax");
    scope.setTag("provider", "vertex");
    scope.setContext("tax", {
      jurisdiction: "US-CA-SF",
      nexus: true,
      httpStatus: 422,
    });
    Sentry.captureException(
      new Error(
        "Tax engine rejected request: invalid ship-from address for jurisdiction US-CA-SF.",
      ),
    );
  });
}

function sendWebhookVerificationError() {
  Sentry.logger.info(
    "Webhook: received Stripe signed payload",
    logDemo({
      area: "webhooks",
      provider: "stripe",
      endpoint: "/api/webhooks/stripe",
    }),
  );

  Sentry.addBreadcrumb({
    category: "webhook",
    message: "Received payment provider callback",
    level: "info",
  });

  Sentry.logger.error(
    "Webhook: signature verification failed (replay or clock skew)",
    logDemo({
      area: "webhooks",
      provider: "stripe",
      toleranceSec: 300,
    }),
  );

  Sentry.withScope((scope) => {
    applyDemoScope(scope, "webhook_signature");
    scope.setTag("area", "webhooks");
    scope.setTag("provider", "stripe");
    scope.setContext("webhook", {
      endpoint: "/api/webhooks/stripe",
      signatureHeaderPresent: true,
      toleranceSec: 300,
    });

    Sentry.captureException(
      new Error("Webhook signature verification failed: timestamp outside tolerance."),
    );
  });
}

function sendRateLimitWarning() {
  Sentry.logger.warn(
    "API gateway: tenant over public rate limit",
    logDemo({
      area: "api",
      tenantId: "org_demo_northwind",
      limitPerMinute: 120,
      retryAfterSec: 34,
    }),
  );

  Sentry.withScope((scope) => {
    applyDemoScope(scope, "rate_limit");
    scope.setTag("area", "api");
    scope.setLevel("warning");
    scope.setContext("rate_limit", {
      tenantId: "org_demo_northwind",
      limitPerMinute: 120,
      retryAfterSec: 34,
    });

    Sentry.captureMessage(
      "Public catalog API rate limit exceeded for tenant org_demo_northwind.",
      "warning",
    );
  });
}

function sendErrorBatch() {
  const runners = [
    sendPaymentDeclinedError,
    sendInsufficientStockError,
    sendShippingTimeoutError,
    sendTaxServiceError,
    sendWebhookVerificationError,
  ];
  runners.forEach((fn, i) => {
    window.setTimeout(fn, i * 120);
  });
}

export function SentryDemoPage() {
  const [lastAction, setLastAction] = useState(null);

  const run = useCallback((id, fn) => {
    fn();
    setLastAction(id);
  }, []);

  useEffect(() => {
    Sentry.logger.trace("Sentry demo panel mounted", logDemo({ route: "/demo-sentry" }));
  }, []);

  return (
    <div className="mx-auto max-w-3xl">
      <p className="text-sm font-medium uppercase tracking-wide text-primary">Observability</p>
      <h1 className="mt-1 text-3xl font-semibold tracking-tight text-base-content">
        Sentry demo events
      </h1>
      <p className="mt-3 text-base leading-relaxed text-base-content/70">
        Each button sends structured{" "}
        <strong className="font-medium text-base-content/85">Logs</strong> (via{" "}
        <code className="rounded bg-base-300 px-1 py-0.5 text-xs">Sentry.logger</code>
        ), <strong className="font-medium text-base-content/85">Issues</strong> (
        <code className="rounded bg-base-300 px-1 py-0.5 text-xs">captureException</code>
        ), and breadcrumbs — useful for Replay, traces, and the Logs UI. Not connected to real
        payments or webhooks.
      </p>

      <ul className="mt-8 divide-y divide-base-300 rounded-box border border-base-300 bg-base-100">
        <li className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-medium text-base-content">Payment declined</p>
            <p className="mt-1 text-sm text-base-content/65">
              Charge failure after a card attempt — good for payment context in Issues.
            </p>
          </div>
          <button
            type="button"
            className="btn btn-outline btn-sm shrink-0"
            onClick={() => run("payment", sendPaymentDeclinedError)}
          >
            Send event
          </button>
        </li>
        <li className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-medium text-base-content">Insufficient stock</p>
            <p className="mt-1 text-sm text-base-content/65">
              Inventory reservation failure during checkout.
            </p>
          </div>
          <button
            type="button"
            className="btn btn-outline btn-sm shrink-0"
            onClick={() => run("stock", sendInsufficientStockError)}
          >
            Send event
          </button>
        </li>
        <li className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-medium text-base-content">Carrier API timeout</p>
            <p className="mt-1 text-sm text-base-content/65">
              Shipping rate request timed out — shows shipping + retry context.
            </p>
          </div>
          <button
            type="button"
            className="btn btn-outline btn-sm shrink-0"
            onClick={() => run("shipping", sendShippingTimeoutError)}
          >
            Send event
          </button>
        </li>
        <li className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-medium text-base-content">Tax calculation rejected</p>
            <p className="mt-1 text-sm text-base-content/65">
              Engine returned a validation error for the jurisdiction.
            </p>
          </div>
          <button
            type="button"
            className="btn btn-outline btn-sm shrink-0"
            onClick={() => run("tax", sendTaxServiceError)}
          >
            Send event
          </button>
        </li>
        <li className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-medium text-base-content">Webhook signature failed</p>
            <p className="mt-1 text-sm text-base-content/65">
              Provider callback could not be verified — common ops scenario.
            </p>
          </div>
          <button
            type="button"
            className="btn btn-outline btn-sm shrink-0"
            onClick={() => run("webhook", sendWebhookVerificationError)}
          >
            Send event
          </button>
        </li>
        <li className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-medium text-base-content">API rate limit (warning)</p>
            <p className="mt-1 text-sm text-base-content/65">
              A warning-level event for quota / abuse dashboards.
            </p>
          </div>
          <button
            type="button"
            className="btn btn-outline btn-sm shrink-0"
            onClick={() => run("ratelimit", sendRateLimitWarning)}
          >
            Send event
          </button>
        </li>
        <li className="px-4 py-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-medium text-base-content">Burst: send five errors</p>
              <p className="mt-1 text-sm text-base-content/65">
                Fires payment, inventory, shipping, tax, and webhook scenarios in quick succession.
              </p>
            </div>
            <button
              type="button"
              className="btn btn-primary btn-sm shrink-0"
              onClick={() => run("batch", sendErrorBatch)}
            >
              Send batch
            </button>
          </div>
        </li>
      </ul>

      {lastAction ? (
        <p className="mt-6 text-sm text-success" role="status">
          Last sent: <span className="font-mono">{lastAction}</span> — open Sentry to see new issues
          or the stream.
        </p>
      ) : null}

      <p className="mt-8 text-sm text-base-content/55">
        <Link to="/" className="link link-hover">
          ← Back to shop
        </Link>
      </p>
    </div>
  );
}
