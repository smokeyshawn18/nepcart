import type { Request, Response, NextFunction } from "express";
import { db } from "../db";
import { products } from "../db/schema";
import { and, desc, eq, inArray, sql } from "drizzle-orm";

import logger from "../config/logger";
import { getCacheWithTTL, setCacheWithTTL } from "../lib/cache";

export async function listProducts(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const cat =
      typeof req.query.category === "string" ? req.query.category.trim() : "";

    const page = Math.max(Number(req.query.page ?? 1), 1);
    const limit = Math.max(Number(req.query.limit ?? 6), 1);
    const offset = (page - 1) * limit;

    const activeOnly = eq(products.active, true);
    const whereClause = cat
      ? and(activeOnly, eq(products.category, cat))
      : activeOnly;

    const rows = await db
      .select()
      .from(products)
      .where(whereClause)
      .orderBy(desc(products.createdAt))
      .limit(limit)
      .offset(offset);

    const countRows = await db
      .select({ count: sql<number>`count(*)` })
      .from(products)
      .where(whereClause);

    const total = Number(countRows[0]?.count ?? 0);
    const hasMore = offset + rows.length < total;

    logger.info("Products listed", {
      category: cat || "all",
      page,
      limit,
      total,
      returned: rows.length,
      hasMore,
    });
    res.json({
      products: rows,
      page,
      limit,
      total,
      hasMore,
    });
  } catch (e) {
    next(e);
  }
}

export async function getProductsByIds(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { ids } = req.body as { ids: string[] };

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.json({ products: [] });
    }

    const rows = await db
      .select()
      .from(products)
      .where(inArray(products.id, ids));

    logger.info("Products fetched by IDs", {
      requested: ids.length,
      returned: rows.length,
    });

    res.json({
      products: rows,
    });
  } catch (e) {
    next(e);
  }
}

export async function getCategories(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const rows = await db
      .select({ category: products.category })
      .from(products)
      .where(eq(products.active, true));

    const categories = [...new Set(rows.map((r) => r.category))].sort((a, b) =>
      a.localeCompare(b),
    );
    logger.info("Categories fetched", {
      count: categories.length,
    });

    res.json({ categories });
  } catch (e) {
    next(e);
  }
}

export async function getProductBySlug(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const [row] = await db
      .select()
      .from(products)
      .where(eq(products.slug, req.params.slug as string))
      .limit(1);

    if (!row || !row.active)
      return res.status(404).json({ error: "Not found" });
    logger.warn("Product not found", {
      slug: req.params.slug,
    });
    logger.info("Product fetched", {
      slug: row.slug,
      productId: row.id,
    });

    res.json({ product: row });
  } catch (e) {
    next(e);
  }
}

export async function listFeaturedProducts(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const page = Math.max(Number(req.query.page ?? 1), 1);
    const limit = Math.max(Number(req.query.limit ?? 5), 1);
    const offset = (page - 1) * limit;

    const cacheKey = `featured-products:page:${page}:limit:${limit}`;

    // Use the helper
    const cached = await getCacheWithTTL(cacheKey);
    if (cached) {
      logger.info("Featured products cache hit", {
        page,
        limit,
        cacheKey,
      });
      return res.json(cached);
    }

    // console.log(`❌ Cache MISS: ${cacheKey}`);

    // Fetch from DB
    const whereClause = and(
      eq(products.active, true),
      eq(products.featured, true),
    );

    const rows = await db
      .select()
      .from(products)
      .where(whereClause)
      .orderBy(desc(products.createdAt))
      .limit(limit)
      .offset(offset);

    const count = await db
      .select({ count: sql<number>`count(*)` })
      .from(products)
      .where(whereClause);

    const total = Number(count[0]?.count ?? 0);
    logger.info("Featured products fetched", {
      page,
      limit,
      total,
      returned: rows.length,
    });

    const payload = {
      products: rows,
      page,
      limit,
      total,
      hasMore: offset + rows.length < total,
    };

    // Cache for 1 hour
    await setCacheWithTTL(cacheKey, payload, 3600);

    res.json(payload);
  } catch (e) {
    next(e);
  }
}
