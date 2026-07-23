import "dotenv/config";
import express, { type Response } from "express";
import cors from "cors";

import fs from "node:fs";
import path from "node:path";

import * as Sentry from "@sentry/node";

import { clerkMiddleware } from "@clerk/express";
import { getEnv } from "./lib/env";
import keepAliveCron from "./lib/cron";

import productRouter from "./routes/productRouter";
import meRouter from "./routes/meRouter";
import streamRouter from "./routes/streamRouter";
import chekoutRouter from "./routes/chekoutRouter";
import adminRouter from "./routes/adminRouter";
import orderRouter from "./routes/orderRouter";

import { polarWebhookHandler } from "./webhooks/polar";
import { sentryClerkUserMiddleware } from "./middleware/sentryClerkUser";
import { rateLimit } from "./middleware/rateLimitMiddleware";
import {
  apiLimiter,
  authLimiter,
  adminLimiter,
  webhookLimiter,
  checkoutLimiter,
} from "./lib/rateLimit";
import { clerkWebhookHandler } from "./webhooks/clerk";

const env = getEnv();
const app = express();

app.set("trust proxy", 1); // trust first proxy

const rawJson = express.raw({ type: "application/json", limit: "1mb" });

app.post(
  "/webhooks/polar",
  rawJson,
  rateLimit(webhookLimiter, "polar-webhook"), // IP-based since no Clerk auth here
  (req, res) => {
    void polarWebhookHandler(req, res);
  },
);

app.post(
  "/webhooks/clerk",
  rawJson,
  rateLimit(webhookLimiter, "clerk-webhook"),
  (req, res) => {
    void clerkWebhookHandler(req, res);
  },
);

app.use(express.json());
app.use(
  cors({
    origin: [env.FRONTEND_URL, "http://localhost:5173"],
    credentials: true,
  }),
);
app.use(clerkMiddleware());
app.use(sentryClerkUserMiddleware);

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/products", rateLimit(apiLimiter, "api"), productRouter);
app.use("/api/orders", rateLimit(apiLimiter, "api"), orderRouter);
app.use("/api/stream", rateLimit(apiLimiter, "api"), streamRouter);

app.use("/api/me", rateLimit(authLimiter, "auth"), meRouter);
app.use("/api/checkout", rateLimit(checkoutLimiter, "checkout"), chekoutRouter);
app.use("/api/admin", rateLimit(adminLimiter, "admin"), adminRouter);
app.use((res: Response, err: any) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

const publicDir = path.join(process.cwd(), "public");

console.log("cwd:", process.cwd());
console.log("publicDir:", publicDir);
console.log("exists:", fs.existsSync(publicDir));
if (fs.existsSync(publicDir)) {
  app.use(express.static(publicDir));

  app.get("/{*any}", (req, res, next) => {
    if (req.method !== "GET" && req.method !== "HEAD") {
      next();
      return;
    }

    if (req.path.startsWith("/api") || req.path.startsWith("/webhooks")) {
      next();
      return;
    }

    res.sendFile(path.join(publicDir, "index.html"), (err) => next(err));
  });
}

// sentry will be attached to the response object
Sentry.setupExpressErrorHandler(app);

app.use(
  (
    _err: unknown,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    const sentryId = (res as express.Response & { sentry?: string }).sentry;

    res.status(500).json({
      error: "Internal server error",
      ...(sentryId !== undefined && { sentryId }),
    });
  },
);

app.listen(env.PORT, () => {
  console.log("Listening on port:", env.PORT);
  if (env.NODE_ENV === "production") {
    keepAliveCron.start();
  }
});
