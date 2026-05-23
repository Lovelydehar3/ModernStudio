const dotenv = require("dotenv");

dotenv.config();

const jwtSecret = process.env.JWT_SECRET || "change-me-in-production";

if (process.env.NODE_ENV === "production" && jwtSecret === "change-me-in-production") {
  throw new Error("FATAL: JWT_SECRET must be set in production. Generate with: node -e \"console.log(require('crypto').randomBytes(64).toString('hex'))\"");
}

const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
const clientUrls = (process.env.CLIENT_URLS || clientUrl)
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);

const cookieSameSite = process.env.COOKIE_SAMESITE || "lax";
const cookieSecure =
  process.env.COOKIE_SECURE === "true" ||
  (process.env.NODE_ENV === "production" && cookieSameSite === "none");

const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 5000),
  mongoUri: process.env.MONGO_URI || "",
  jwtSecret,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "2h",
  jwtSessionExpiresIn: process.env.JWT_SESSION_EXPIRES_IN || process.env.JWT_EXPIRES_IN || "2h",
  jwtRememberExpiresIn: process.env.JWT_REMEMBER_EXPIRES_IN || "7d",
  authCookieName: process.env.AUTH_COOKIE_NAME || "token",
  cookieSameSite,
  cookieSecure,
  clientUrl,
  clientUrls,
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY || "",
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET || "",
  googleClientId: process.env.GOOGLE_CLIENT_ID || "",

  // SMTP (for sending OTP emails)
  smtpHost: process.env.SMTP_HOST || "",
  smtpPort: parseInt(process.env.SMTP_PORT || "587", 10),
  smtpSecure: process.env.SMTP_SECURE || "false",
  smtpUser: process.env.SMTP_USER || "",
  smtpPass: process.env.SMTP_PASS || "",
  smtpFrom: process.env.SMTP_FROM || "",
  adminEmail: process.env.ADMIN_EMAIL || "",
  emailDevMode: process.env.EMAIL_DEV_MODE === "true"
};

module.exports = env;
