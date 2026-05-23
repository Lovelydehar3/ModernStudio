const { z } = require("zod");

const inquiryCreateSchema = z.object({
  name: z.string().trim().min(1),
  email: z.string().email().transform((value) => value.toLowerCase()),
  phone: z.string().trim().max(20).default(""),
  message: z.string().trim().min(10).max(1000),
  sourcePage: z.string().trim().default("home")
});

const inquiryResolveSchema = z.object({
  isResolved: z.boolean()
});

module.exports = {
  inquiryCreateSchema,
  inquiryResolveSchema
};
