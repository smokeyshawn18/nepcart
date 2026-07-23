import { Request, Response, NextFunction } from "express";
import { getAuth } from "@clerk/express";
import { Ratelimit } from "@upstash/ratelimit";

export const rateLimit = (limiter: Ratelimit, keyPrefix: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = getAuth(req);
      const identifier = userId ? `user:${userId}` : `ip:${req.ip}`;

      const { success, limit, remaining, reset } = await limiter.limit(
        `${keyPrefix}:${identifier}`,
      );

      res.setHeader("RateLimit-Limit", limit.toString());
      res.setHeader("RateLimit-Remaining", remaining.toString());
      res.setHeader("RateLimit-Reset", reset.toString());

      if (!success) {
        const retryAfterSec = Math.ceil((reset - Date.now()) / 1000);
        res.setHeader("Retry-After", retryAfterSec.toString());
        return res.status(429).json({
          error: "Too many requests. Please slow down.",
          retryAfter: retryAfterSec,
        });
      }

      next();
    } catch (err) {
      console.error("Rate limiter error:", err);
      // fail-open so a Redis outage doesn't take down the whole API
      next();
    }
  };
};
