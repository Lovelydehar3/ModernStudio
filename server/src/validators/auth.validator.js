const { z } = require("zod");
const { PASSWORD_PATTERN, normalizePhone } = require("../utils/authSecurity");

const strongPasswordMessage =
  "Password must be at least 8 characters and include uppercase, lowercase, number, and special character.";

const passwordSchema = z
  .string()
  .min(8, strongPasswordMessage)
  .max(100, "Password must be 100 characters or less.")
  .regex(PASSWORD_PATTERN, strongPasswordMessage);

const loginSchema = z.object({
  email: z.string().email().transform((value) => value.toLowerCase()),
  password: z.string().min(1, "Password is required.").max(100),
  remember: z.boolean().default(false)
});

const registerSchema = z.object({
  name: z.string().min(1).max(100).transform((value) => value.trim()),
  email: z.string().email().transform((value) => value.toLowerCase()),
  phone: z
    .string()
    .min(7, "Phone number is required.")
    .max(20, "Phone number is too long.")
    .transform(normalizePhone)
    .refine((value) => /^[+]?\d{7,15}$/.test(value), "Enter a valid phone number."),
  password: passwordSchema,
  confirmPassword: z.string().min(1, "Confirm password is required.")
}).refine((value) => value.password === value.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"]
});

const emailSchema = z.object({
  email: z.string().email().transform((value) => value.toLowerCase())
});

const verifyEmailSchema = z.object({
  email: z.string().email().transform((value) => value.toLowerCase()),
  otp: z.string().regex(/^\d{6}$/, "Enter the 6-digit verification code.")
});

const googleLoginSchema = z.object({
  credential: z.string().min(20, "Google credential is required.")
});

const validateResetTokenSchema = z.object({
  email: z.string().email().transform((value) => value.toLowerCase()),
  token: z.string().min(32, "Reset token is required.")
});

const resetPasswordSchema = z.object({
  email: z.string().email().transform((value) => value.toLowerCase()),
  token: z.string().min(32, "Reset token is required."),
  password: passwordSchema,
  confirmPassword: z.string().min(1, "Confirm password is required.")
}).refine((value) => value.password === value.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"]
});

module.exports = {
  loginSchema,
  registerSchema,
  emailSchema,
  verifyEmailSchema,
  googleLoginSchema,
  validateResetTokenSchema,
  resetPasswordSchema,
  strongPasswordMessage
};
