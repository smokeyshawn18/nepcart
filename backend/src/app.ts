import express from "express";
import cors from "cors";
import path from "node:path";
import fs from "node:fs";
import * as Sentry from "@sentry/node";
import { clerkMiddleware } from "@clerk/express";

import { getEnv } from "./config/env";
import productRouter from "./routes/productRouter";
import meRouter from "./routes/meRouter";
import streamRouter from "./routes/streamRouter";
import chekoutRouter from "./routes/chekoutRouter";
import adminRouter from "./routes/adminRouter";
import orderRouter from "./routes/orderRouter";

import { polarWebhookHandler } from "./webhooks/polar";
import { clerkWebhookHandler } from "./webhooks/clerk";
import { sentryClerkUserMiddleware } from "./middleware/sentryClerkUser";
import { rateLimit } from "./middleware/rateLimitMiddleware";
import {
  apiLimiter,
  authLimiter,
  adminLimiter,
  webhookLimiter,
  checkoutLimiter,
} from "./config/rateLimit";

import type { Express, Request, Response, NextFunction } from "express";

// Extend Response interface locally for Sentry ID support
interface SentryResponse extends Response {
  sentry?: string;
}

export function createApp(): Express {
  const env = getEnv();
  const app: Express = express();

  app.set("trust proxy", 1);

  // Webhooks (Raw JSON)
  const rawJson = express.raw({ type: "application/json", limit: "1mb" });

  app.post(
    "/webhooks/polar",
    rawJson,
    rateLimit(webhookLimiter, "polar-webhook"),
    (req: Request, res: Response): void => {
      void polarWebhookHandler(req, res);
    },
  );

  app.post(
    "/webhooks/clerk",
    rawJson,
    rateLimit(webhookLimiter, "clerk-webhook"),
    (req: Request, res: Response): void => {
      void clerkWebhookHandler(req, res);
    },
  );

  // Global Middleware
  app.use(express.json());
  app.use(
    cors({
      origin: [env.FRONTEND_URL, "http://localhost:5173"],
      credentials: true,
    }),
  );
  app.use(clerkMiddleware());
  app.use(sentryClerkUserMiddleware);

  // Health Check
  app.get("/health", (_req: Request, res: Response): void => {
    res.json({ ok: true });
  });

  // API Routes
  app.use("/api/products", productRouter);
  app.use("/api/orders", rateLimit(apiLimiter, "api"), orderRouter);
  app.use("/api/stream", rateLimit(apiLimiter, "api"), streamRouter);
  app.use("/api/me", rateLimit(authLimiter, "auth"), meRouter);
  app.use(
    "/api/checkout",
    rateLimit(checkoutLimiter, "checkout"),
    chekoutRouter,
  );
  app.use("/api/admin", rateLimit(adminLimiter, "admin"), adminRouter);

  // Static Frontend Serving
  const publicDir: string = path.join(process.cwd(), "public");
  if (fs.existsSync(publicDir)) {
    app.use(express.static(publicDir));

    app.get(
      "/{*any}",
      (req: Request, res: Response, next: NextFunction): void => {
        if (req.method !== "GET" && req.method !== "HEAD") {
          return next();
        }
        if (req.path.startsWith("/api") || req.path.startsWith("/webhooks")) {
          return next();
        }
        res.sendFile(path.join(publicDir, "index.html"), (err?: Error) => {
          if (err) next(err);
        });
      },
    );
  }

  // Sentry Error Handler
  Sentry.setupExpressErrorHandler(app);

  // Centralized Error Handling Middleware
  app.use(
    (
      _err: unknown,
      _req: Request,
      res: SentryResponse,
      _next: NextFunction,
    ): void => {
      const sentryId = res.sentry;

      res.status(500).json({
        error: "Internal server error",
        ...(sentryId !== undefined && { sentryId }),
      });
    },
  );

  return app;
}
