import type { Request, Response, NextFunction } from "express";
import { db } from "../db";
import { products } from "../db/schema";
import { and, desc, eq, inArray, sql } from "drizzle-orm";
import { redis } from "../db/redis";

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

    try {
      const cached = await redis.get(cacheKey);
      if (cached) {
        console.log("cache HIT", cacheKey);
        return res.json(cached);
      }
    } catch (err) {
      console.error("Redis GET error in listFeaturedProducts:", err);
    }

    console.log("cache MISS", cacheKey);

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
      .select({
        count: sql<number>`count(*)`,
      })
      .from(products)
      .where(whereClause);

    const total = Number(count[0]?.count ?? 0);

    const payload = {
      products: rows,
      page,
      limit,
      total,
      hasMore: offset + rows.length < total,
    };

    try {
      await redis.set(cacheKey, payload, { ex: 60 });
    } catch (err) {
      console.error("Redis SET error in listFeaturedProducts:", err);
    }

    res.json(payload);
  } catch (e) {
    console.error("listFeaturedProducts threw:", e);
    next(e);
  }
}
