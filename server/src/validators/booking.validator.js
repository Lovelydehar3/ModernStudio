const { z } = require("zod");

const selectedPackageSchema = z.object({
  packageId: z.string().trim().optional(),
  name: z.string().trim().min(1),
  priceDisplay: z.string().trim().min(1),
  startingPrice: z.number().nonnegative()
});

const addOnSchema = z.object({
  name: z.string().trim().min(1),
  priceDisplay: z.string().trim().min(1),
  startingPrice: z.number().nonnegative()
});

const bookingCreateSchema = z.object({
  name: z.string().trim().min(1),
  email: z.string().email().transform((value) => value.toLowerCase()),
  phone: z.string().trim().min(7).max(20),
  eventType: z.string().trim().min(1).max(80),
  eventDate: z.string().or(z.date()),
  eventLocation: z.string().trim().min(1).max(200),
  days: z.number().int().min(1).max(30),
  message: z.string().trim().max(1000).default(""),
  selectedPackage: selectedPackageSchema,
  addOns: z.array(addOnSchema).default([])
});

const bookingStatusUpdateSchema = z.object({
  status: z.enum(["accepted", "rejected"]),
  note: z.string().trim().max(250).default("")
});

const bookingUpdateSchema = z.object({
  name: z.string().trim().min(1),
  email: z.string().email().transform((value) => value.toLowerCase()),
  phone: z.string().trim().min(7).max(20),
  eventType: z.string().trim(),
  eventDate: z.string().or(z.date()).nullable(),
  eventLocation: z.string().trim().max(200),
  days: z.number().int().min(1).max(30),
  message: z.string().trim().max(1000),
  selectedPackage: selectedPackageSchema,
  addOns: z.array(addOnSchema)
}).partial();

module.exports = {
  bookingCreateSchema,
  bookingStatusUpdateSchema,
  bookingUpdateSchema
};
