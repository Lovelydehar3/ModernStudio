const { z } = require("zod");

const addonCreateSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  priceDisplay: z.string().trim().min(1, "Price display is required"),
  startingPrice: z.number().min(0, "Starting price must be non-negative"),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(0)
});

const addonUpdateSchema = addonCreateSchema.partial();

module.exports = { addonCreateSchema, addonUpdateSchema };
