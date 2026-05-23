const { z } = require("zod");

const CATEGORIES = [
  "home", "films", "weddings", "portfolio",
  "wedding", "pre-wedding", "engagement", "haldi", "mehndi",
  "cinematic-films", "drone", "fashion", "baby-shoot"
];

// Multipart form data sends everything as strings, so accept both strings and native types
const mediaCreateSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  type: z.enum(["photo", "video"]),
  category: z.enum(CATEGORIES),
  url: z.string().url().or(z.literal("")).optional(),
  thumbnailUrl: z.string().url().or(z.literal("")).optional(),
  alt: z.string().trim().default(""),
  altText: z.string().trim().default(""),
  tags: z.string().or(z.array(z.string())).optional(),
  isFeatured: z.union([z.boolean(), z.literal("true"), z.literal("false")]).default(false),
  sortOrder: z.union([z.number(), z.string().regex(/^\d+$/)]).default(0)
});

const mediaUpdateSchema = mediaCreateSchema.partial();

module.exports = { mediaCreateSchema, mediaUpdateSchema };
