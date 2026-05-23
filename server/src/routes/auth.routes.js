const express = require("express");
const rateLimit = require("express-rate-limit");
const {
  register,
  sendVerificationOtp,
  verifyEmailOtp,
  login,
  forgotPassword,
  validateResetToken,
  resetPassword,
  me,
  csrf,
  logout
} = require("../controllers/auth.controller");
const { googleLogin } = require("../controllers/googleAuth.controller");
const validate = require("../middleware/validate.middleware");
const authMiddleware = require("../middleware/auth.middleware");
const {
  loginSchema,
  registerSchema,
  emailSchema,
  verifyEmailSchema,
  googleLoginSchema,
  validateResetTokenSchema,
  resetPasswordSchema
} = require("../validators/auth.validator");

const router = express.Router();

// Stricter rate limiting for login: 5 attempts per 15 minutes
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, message: "Too many login attempts. Try again in 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false
});

const authActionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: "Too many requests. Try again in 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false
});

// Public auth routes
router.post("/register", authActionLimiter, validate(registerSchema), register);
router.post("/send-verification-otp", authActionLimiter, validate(emailSchema), sendVerificationOtp);
router.post("/resend-verification-otp", authActionLimiter, validate(emailSchema), sendVerificationOtp);
router.post("/verify-email-otp", authActionLimiter, validate(verifyEmailSchema), verifyEmailOtp);
router.post("/login", loginLimiter, validate(loginSchema), login);
router.post("/google", authActionLimiter, validate(googleLoginSchema), googleLogin);
router.post("/forgot-password", authActionLimiter, validate(emailSchema), forgotPassword);
router.post("/validate-reset-token", authActionLimiter, validate(validateResetTokenSchema), validateResetToken);
router.post("/reset-password", authActionLimiter, validate(resetPasswordSchema), resetPassword);
router.get("/csrf", csrf);

// Protected routes
router.get("/me", authMiddleware, me);
router.post("/logout", logout);

module.exports = router;
