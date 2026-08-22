import z from "zod";

export const productCreate = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  category: z.string().min(1).default("General"),
  description: z.string().default(""),
  priceCents: z.number().int().positive(),
  currency: z.string().min(1).default("usd"),
  quantity: z.number().int().nonnegative().default(0),
  imageUrl: z
    .union([z.string().url(), z.literal("")])
    .optional()
    .nullable(),
  imageKitFileId: z
    .union([z.string().min(1), z.literal(""), z.null()])
    .optional(),
  active: z.boolean().default(true),
  featured: z.boolean().optional(),
});

export const productPatch = productCreate.partial();
export const orderStatusPatch = z.object({
  status: z.enum(["pending", "paid", "failed", "delivered", "cancelled"]),
});
