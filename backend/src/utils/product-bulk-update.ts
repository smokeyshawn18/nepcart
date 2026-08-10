import z from "zod";
import { products } from "../db/schema";
import { productPatch } from "./admin-product-schema";

export function buildProductUpdateSet(body: z.infer<typeof productPatch>) {
  const data: Partial<typeof products.$inferInsert> = {};
  if (body.slug !== undefined) data.slug = body.slug;
  if (body.name !== undefined) data.name = body.name;
  if (body.category !== undefined) data.category = body.category;
  if (body.description !== undefined) data.description = body.description;
  if (body.priceCents !== undefined) data.priceCents = body.priceCents;
  if (body.currency !== undefined) data.currency = body.currency;
  if (body.imageUrl !== undefined)
    data.imageUrl = body.imageUrl === "" ? null : body.imageUrl;
  if (body.imageKitFileId !== undefined) {
    data.imageKitFileId =
      body.imageKitFileId === "" ? null : body.imageKitFileId;
  }
  if (body.active !== undefined) data.active = body.active;
  if (body.featured !== undefined) data.featured = body.featured;
  return data;
}
