const { z } = require("zod");

const addOnSchema = z.object({
  name: z.string().trim().min(1),
  priceDisplay: z.string().trim().min(1),
  startingPrice: z.number().nonnegative()
});

const packageCreateSchema = z.object({
  name: z.string().trim().min(1),
  priceDisplay: z.string().trim().min(1),
  startingPrice: z.number().nonnegative(),
  description: z.string().trim().default(""),
  features: z.array(z.string().trim().min(1)).default([]),
  addOns: z.array(addOnSchema).default([]),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(0)
});

const packageUpdateSchema = packageCreateSchema.partial();

module.exports = {
  packageCreateSchema,
  packageUpdateSchema
};
