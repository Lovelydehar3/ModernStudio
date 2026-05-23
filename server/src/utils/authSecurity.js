const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const env = require("../config/env");

const OTP_LENGTH = 6;
const OTP_TTL_MINUTES = 10;
const REGISTRATION_TTL_MINUTES = 30;
const RESET_TOKEN_TTL_MINUTES = 3;

const normalizeEmail = (email = "") => email.trim().toLowerCase();

const normalizePhone = (phone = "") => phone.replace(/[^\d+]/g, "").trim();

const generateOtp = () => crypto.randomInt(10 ** (OTP_LENGTH - 1), 10 ** OTP_LENGTH).toString();

const generateSecureToken = () => crypto.randomBytes(32).toString("hex");

const hashToken = (value) => crypto.createHash("sha256").update(String(value)).digest("hex");

const addMinutes = (minutes) => new Date(Date.now() + minutes * 60 * 1000);

const sanitizeUser = (user) => ({
  id: user._id?.toString?.() || user.id,
  name: user.name,
  email: user.email,
  phone: user.phone || "",
  role: user.role,
  avatar: user.avatar || null,
  isEmailVerified: Boolean(user.isEmailVerified)
});

const getJwtTtl = (remember = false) =>
  remember ? env.jwtRememberExpiresIn : env.jwtSessionExpiresIn;

const signAuthToken = (user, { remember = false } = {}) =>
  jwt.sign(
    {
      userId: user._id.toString(),
      email: user.email,
      role: user.role
    },
    env.jwtSecret,
    { expiresIn: getJwtTtl(remember) }
  );

const parseDurationToMs = (value) => {
  if (typeof value === "number") return value * 1000;
  const match = String(value || "").trim().match(/^(\d+)([smhd])$/i);
  if (!match) return 2 * 60 * 60 * 1000;

  const amount = Number(match[1]);
  const unit = match[2].toLowerCase();
  const multipliers = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000
  };
  return amount * multipliers[unit];
};

const authCookieOptions = ({ remember = false } = {}) => ({
  httpOnly: true,
  secure: env.cookieSecure,
  sameSite: env.cookieSameSite,
  path: "/",
  maxAge: parseDurationToMs(getJwtTtl(remember))
});

const clearAuthCookieOptions = () => ({
  httpOnly: true,
  secure: env.cookieSecure,
  sameSite: env.cookieSameSite,
  path: "/"
});

const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,100}$/;

module.exports = {
  OTP_LENGTH,
  OTP_TTL_MINUTES,
  REGISTRATION_TTL_MINUTES,
  RESET_TOKEN_TTL_MINUTES,
  PASSWORD_PATTERN,
  normalizeEmail,
  normalizePhone,
  generateOtp,
  generateSecureToken,
  hashToken,
  addMinutes,
  sanitizeUser,
  signAuthToken,
  authCookieOptions,
  clearAuthCookieOptions,
  parseDurationToMs
};
