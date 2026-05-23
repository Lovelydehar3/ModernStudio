const { z } = require("zod");

const statSchema = z.object({
  label: z.string().trim().min(1),
  value: z.string().trim().min(1)
});

const homeUpdateSchema = z.object({
  heroTitle: z.string().trim().min(1).optional(),
  heroSubtitle: z.string().trim().min(1).optional(),
  heroBackgroundMedia: z.string().trim().min(1).or(z.literal("")).optional(),
  aboutSnippet: z.string().trim().min(1).optional(),
  stats: z.array(statSchema).optional(),
  ctaText: z.string().trim().min(1).optional(),
  ctaLink: z.string().trim().min(1).optional(),
  sectionBlocks: z.record(z.string(), z.any()).optional()
});

module.exports = {
  homeUpdateSchema
};
