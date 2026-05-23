const { z } = require("zod");

const filmCreateSchema = z.object({
  title: z.string().trim().min(1),
  slug: z.string().trim().min(1).regex(/^[a-z0-9-]+$/),
  summary: z.string().trim().default(""),
  coverImage: z.string().url().or(z.literal("")).default(""),
  videoUrl: z.string().url().or(z.literal("")).default(""),
  tags: z.array(z.string().trim().min(1)).default([]),
  isPublished: z.boolean().default(true)
});

const filmUpdateSchema = filmCreateSchema.partial();

module.exports = {
  filmCreateSchema,
  filmUpdateSchema
};
