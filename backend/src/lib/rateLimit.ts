import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "../db/redis";

const createSlidingWindowLimiter = (
  requests: number,
  window: `${number} ${"ms" | "s" | "m" | "h" | "d"}`,
  prefix: string,
) =>
  new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(requests, window),
    analytics: false,
    prefix: `ratelimit:${prefix}`,
  });

export const authLimiter = createSlidingWindowLimiter(20, "30 m", "auth");
export const apiLimiter = createSlidingWindowLimiter(50, "1 h", "api");
export const checkoutLimiter = createSlidingWindowLimiter(
  10,
  "15 m",
  "checkout",
);
export const adminLimiter = createSlidingWindowLimiter(300, "15 m", "admin");
export const webhookLimiter = createSlidingWindowLimiter(60, "1 m", "webhook");
