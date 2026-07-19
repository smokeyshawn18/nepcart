import { Redis } from "@upstash/redis";
import { getEnv } from "../lib/env";

const env = getEnv();

export const redis = new Redis({
  url: env.UPSTASH_REDIS_REST_URL!,
  token: env.UPSTASH_REDIS_REST_TOKEN!,
});
