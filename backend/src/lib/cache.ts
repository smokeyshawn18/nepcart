// Add these helper functions at the top of your admin controller file
// or import them from product.controller.ts

import { redis } from "../db/redis";

// Helper 1: Invalidate featured products cache
export async function invalidateFeaturedProductsCache() {
  try {
    const keys = await redis.keys("featured-products:*");
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } catch (err) {
    console.error("Failed to invalidate featured products cache:", err);
  }
}

// Helper 2: Invalidate all product-related caches
export async function invalidateProductCaches(
  productId?: string,
  slug?: string,
) {
  try {
    const keysToDelete: string[] = [];

    // Featured products cache
    const featuredKeys = await redis.keys("featured-products:*");
    keysToDelete.push(...featuredKeys);

    // Products list cache
    const productListKeys = await redis.keys("products:list:*");
    keysToDelete.push(...productListKeys);

    // Categories cache
    const categoryKeys = await redis.keys("products:categories");
    keysToDelete.push(...categoryKeys);

    // Specific product cache if ID provided
    if (productId) {
      keysToDelete.push(`product:${productId}`);
    }

    // Specific product cache if slug provided
    if (slug) {
      keysToDelete.push(`product:slug:${slug}`);
    }

    // Delete all collected keys
    if (keysToDelete.length > 0) {
      await redis.del(...keysToDelete);
      //   console.log(`Invalidated ${keysToDelete.length} product cache keys`);
    }
  } catch (err) {
    console.error("Failed to invalidate product caches:", err);
  }
}

export async function getCacheWithTTL(key: string) {
  try {
    const cached = await redis.get(key);
    if (cached) {
      //   const ttl = await redis.ttl(key);

      //   if (ttl > 0) {
      //     const hours = Math.floor(ttl / 3600);
      //     const minutes = Math.floor((ttl % 3600) / 60);
      //     const seconds = ttl % 60;

      //     console.log(
      //       `✅ Cache HIT: ${key} | TTL: ${hours}h ${minutes}m ${seconds}s remaining`,
      //     );
      //   } else if (ttl === -1) {
      //     console.log(`✅ Cache HIT: ${key} | No expiration (persistent)`);
      //   } else if (ttl === -2) {
      //     console.log(
      //       `⚠️ Cache HIT: ${key} | Key expired but value still retrieved`,
      //     );
      //   }

      return cached;
    }
    return null;
  } catch (err) {
    console.error(`Redis GET error for ${key}:`, err);
    return null;
  }
}
interface Payload {
  products: {
    id: string;
    slug: string;
    name: string;
    category: string;
    description: string;
    priceCents: number;
    currency: string;
    imageUrl: string | null;
    imageKitFileId: string | null;
    active: boolean;
    featured: boolean;
    createdAt: Date;
  }[];
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

export async function setCacheWithTTL(
  key: string,
  value: Payload,
  ttlSeconds: number,
) {
  try {
    await redis.set(key, JSON.stringify(value), { ex: ttlSeconds });
  } catch (err) {
    console.error(`Redis SET error for ${key}:`, err);
  }
}
