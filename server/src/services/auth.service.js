const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const PendingRegistration = require("../models/PendingRegistration");
const PasswordResetToken = require("../models/PasswordResetToken");
const ApiError = require("../utils/ApiError");
const env = require("../config/env");
const {
  OTP_TTL_MINUTES,
  REGISTRATION_TTL_MINUTES,
  RESET_TOKEN_TTL_MINUTES,
  normalizeEmail,
  normalizePhone,
  generateOtp,
  generateSecureToken,
  hashToken,
  addMinutes,
  sanitizeUser,
  signAuthToken,
  authCookieOptions,
  clearAuthCookieOptions
} = require("../utils/authSecurity");
const { sendOtpEmail, sendPasswordResetEmail } = require("../utils/email");

const RESEND_COOLDOWN_SECONDS = 60;
const MAX_OTP_ATTEMPTS = 5;

const duplicateAccountError = async ({ email, phone }) => {
  const existing = await User.findOne({
    $or: [{ email }, { phone }]
  }).lean();

  if (!existing) return null;
  if (existing.email === email) return "An account with this email already exists.";
  return "An account with this phone number already exists.";
};

const setAuthCookie = (res, user, { remember = false } = {}) => {
  const token = signAuthToken(user, { remember });
  res.cookie(env.authCookieName, token, authCookieOptions({ remember }));
};

const clearAuthCookie = (res) => {
  res.clearCookie(env.authCookieName, clearAuthCookieOptions());
};

const startRegistration = async ({ name, email, phone, password }) => {
  const normalizedEmail = normalizeEmail(email);
  const normalizedPhone = normalizePhone(phone);
  const duplicateMessage = await duplicateAccountError({
    email: normalizedEmail,
    phone: normalizedPhone
  });

  if (duplicateMessage) {
    throw new ApiError(409, duplicateMessage);
  }

  const existingPending = await PendingRegistration.findOne({
    $or: [{ email: normalizedEmail }, { phone: normalizedPhone }]
  });

  if (existingPending && existingPending.email !== normalizedEmail) {
    throw new ApiError(409, "A signup is already pending for this phone number.");
  }

  if (existingPending?.resendAvailableAt && existingPending.resendAvailableAt > new Date()) {
    const waitSeconds = Math.ceil((existingPending.resendAvailableAt.getTime() - Date.now()) / 1000);
    throw new ApiError(429, `Please wait ${waitSeconds} seconds before requesting another code.`, {
      retryAfterSeconds: waitSeconds
    });
  }

  const otp = generateOtp();
  const passwordHash = await bcrypt.hash(password, 12);
  const now = new Date();
  const pendingData = {
    name: name.trim(),
    email: normalizedEmail,
    phone: normalizedPhone,
    passwordHash,
    otpHash: hashToken(otp),
    otpExpiresAt: addMinutes(OTP_TTL_MINUTES),
    otpAttempts: 0,
    resendAvailableAt: new Date(now.getTime() + RESEND_COOLDOWN_SECONDS * 1000),
    lastSentAt: now,
    expiresAt: addMinutes(REGISTRATION_TTL_MINUTES)
  };

  await PendingRegistration.findOneAndUpdate(
    { email: normalizedEmail },
    pendingData,
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  await sendOtpEmail(normalizedEmail, otp, "verification");

  return {
    email: normalizedEmail,
    phone: normalizedPhone,
    resendAfterSeconds: RESEND_COOLDOWN_SECONDS,
    expiresInMinutes: OTP_TTL_MINUTES
  };
};

const resendRegistrationOtp = async ({ email }) => {
  const normalizedEmail = normalizeEmail(email);
  const pending = await PendingRegistration.findOne({ email: normalizedEmail });

  if (!pending) {
    throw new ApiError(404, "No pending signup found. Please start signup again.");
  }

  if (pending.resendAvailableAt > new Date()) {
    const waitSeconds = Math.ceil((pending.resendAvailableAt.getTime() - Date.now()) / 1000);
    throw new ApiError(429, `Please wait ${waitSeconds} seconds before requesting another code.`, {
      retryAfterSeconds: waitSeconds
    });
  }

  const duplicateMessage = await duplicateAccountError({
    email: pending.email,
    phone: pending.phone
  });
  if (duplicateMessage) {
    await pending.deleteOne();
    throw new ApiError(409, duplicateMessage);
  }

  const otp = generateOtp();
  pending.otpHash = hashToken(otp);
  pending.otpExpiresAt = addMinutes(OTP_TTL_MINUTES);
  pending.otpAttempts = 0;
  pending.resendAvailableAt = new Date(Date.now() + RESEND_COOLDOWN_SECONDS * 1000);
  pending.lastSentAt = new Date();
  pending.expiresAt = addMinutes(REGISTRATION_TTL_MINUTES);
  await pending.save();

  await sendOtpEmail(pending.email, otp, "verification");

  return {
    email: pending.email,
    resendAfterSeconds: RESEND_COOLDOWN_SECONDS,
    expiresInMinutes: OTP_TTL_MINUTES
  };
};

const verifyRegistrationOtp = async ({ email, otp }) => {
  const normalizedEmail = normalizeEmail(email);
  const pending = await PendingRegistration.findOne({ email: normalizedEmail });

  if (!pending) {
    throw new ApiError(404, "No pending signup found. Please start signup again.");
  }

  if (pending.otpExpiresAt <= new Date()) {
    throw new ApiError(410, "Verification code expired. Please request a new code.");
  }

  if (pending.otpAttempts >= MAX_OTP_ATTEMPTS) {
    throw new ApiError(429, "Too many incorrect attempts. Please request a new code.");
  }

  if (pending.otpHash !== hashToken(otp)) {
    pending.otpAttempts += 1;
    await pending.save();
    throw new ApiError(401, "Invalid verification code.");
  }

  const duplicateMessage = await duplicateAccountError({
    email: pending.email,
    phone: pending.phone
  });
  if (duplicateMessage) {
    await pending.deleteOne();
    throw new ApiError(409, duplicateMessage);
  }

  const user = await User.create({
    name: pending.name,
    email: pending.email,
    phone: pending.phone,
    passwordHash: pending.passwordHash,
    role: "user",
    isEmailVerified: true,
    authProvider: "local",
    lastLoginAt: new Date()
  });

  await pending.deleteOne();
  return user;
};

const loginWithPassword = async ({ email, password, remember = false }) => {
  const normalizedEmail = normalizeEmail(email);
  const user = await User.findOne({ email: normalizedEmail, isActive: true }).select("+passwordHash +loginAttempts +lockUntil");

  // Generic error message to prevent user enumeration
  const genericError = new ApiError(401, "Invalid email or password.");
  
  if (!user) {
    // Perform a dummy hash to prevent timing attacks
    await bcrypt.compare(password, "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj8YKFqOk0zK");
    throw genericError;
  }

  // Check if account is locked
  if (user.loginAttempts !== undefined && user.loginAttempts >= 5) {
    if (user.lockUntil && user.lockUntil > new Date()) {
      const waitMinutes = Math.ceil((user.lockUntil - new Date()) / 60000);
      throw new ApiError(429, `Account temporarily locked. Try again in ${waitMinutes} minute(s).`);
    }
    // Lock expired, reset attempts
    user.loginAttempts = 0;
    user.lockUntil = undefined;
  }

  if (!user.passwordHash) {
    throw new ApiError(400, "Please continue with Google sign-in for this account.");
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    // Increment login attempts
    user.loginAttempts = (user.loginAttempts || 0) + 1;
    
    // Lock account after 5 failed attempts for 15 minutes
    if (user.loginAttempts >= 5) {
      user.lockUntil = new Date(Date.now() + 15 * 60 * 1000);
    }
    await user.save();
    throw genericError;
  }

  if (!user.isEmailVerified) {
    throw new ApiError(403, "Please verify your email first");
  }

  // Reset login attempts on successful login
  if (user.loginAttempts > 0 || user.lockUntil) {
    user.loginAttempts = 0;
    user.lockUntil = undefined;
  }
  
  user.lastLoginAt = new Date();
  await user.save();

  return { user, remember };
};

const upsertGoogleUser = async ({ googleId, email, name, picture, emailVerified }) => {
  if (!emailVerified) {
    throw new ApiError(401, "Google account email is not verified.");
  }

  const normalizedEmail = normalizeEmail(email);
  let user = await User.findOne({
    $or: [{ googleId }, { email: normalizedEmail }]
  }).select("+passwordHash");

  if (user) {
    if (user.googleId && user.googleId !== googleId) {
      throw new ApiError(409, "This email is already linked to another Google account.");
    }
    user.googleId = user.googleId || googleId;
    user.name = user.name || name || normalizedEmail.split("@")[0];
    user.avatar = user.avatar || picture || null;
    user.isEmailVerified = true;
    user.authProvider = user.passwordHash ? "local" : "google";
    user.lastLoginAt = new Date();
    await user.save();
    return user;
  }

  user = await User.create({
    name: name || normalizedEmail.split("@")[0],
    email: normalizedEmail,
    googleId,
    avatar: picture || null,
    role: "user",
    isEmailVerified: true,
    authProvider: "google",
    lastLoginAt: new Date()
  });

  return user;
};

const requestPasswordReset = async ({ email }) => {
  const normalizedEmail = normalizeEmail(email);
  const user = await User.findOne({ email: normalizedEmail, isActive: true });

  if (!user) {
    return null;
  }

  const rawToken = generateSecureToken();
  const tokenHash = hashToken(rawToken);
  const expiresAt = addMinutes(RESET_TOKEN_TTL_MINUTES);

  await PasswordResetToken.updateMany(
    { userId: user._id, usedAt: null },
    { usedAt: new Date() }
  );

  await PasswordResetToken.create({
    userId: user._id,
    email: user.email,
    tokenHash,
    expiresAt
  });

  const resetUrl = `${env.clientUrl.replace(/\/$/, "")}/reset-password?email=${encodeURIComponent(user.email)}&token=${rawToken}`;
  await sendPasswordResetEmail(user.email, resetUrl);

  return { resetUrl, expiresAt };
};

const findValidResetToken = async ({ email, token }) => {
  const normalizedEmail = normalizeEmail(email);
  const tokenHash = hashToken(token);
  const resetToken = await PasswordResetToken.findOne({
    email: normalizedEmail,
    tokenHash
  });

  if (!resetToken) {
    throw new ApiError(404, "Invalid reset link.");
  }
  if (resetToken.usedAt) {
    throw new ApiError(410, "This reset link has already been used.");
  }
  if (resetToken.expiresAt <= new Date()) {
    throw new ApiError(410, "This reset link has expired.");
  }

  return resetToken;
};

const validatePasswordResetToken = async ({ email, token }) => {
  await findValidResetToken({ email, token });
  return true;
};

const resetPasswordWithToken = async ({ email, token, password }) => {
  const resetToken = await findValidResetToken({ email, token });
  const user = await User.findById(resetToken.userId).select("+passwordHash");

  if (!user || !user.isActive) {
    throw new ApiError(404, "Account does not exist");
  }

  await user.setPassword(password);
  user.authProvider = "local";
  user.isEmailVerified = true;
  user.passwordChangedAt = new Date();
  user.lastPasswordResetAt = new Date();
  await user.save();

  resetToken.usedAt = new Date();
  await resetToken.save();
  await PasswordResetToken.updateMany(
    { userId: user._id, usedAt: null },
    { usedAt: new Date() }
  );

  return user;
};

const getAuthenticatedUser = async (token) => {
  if (!token) {
    throw new ApiError(401, "Authentication token missing.");
  }

  let decoded;
  try {
    decoded = jwt.verify(token, env.jwtSecret);
  } catch {
    throw new ApiError(401, "Invalid or expired token.");
  }

  const user = await User.findById(decoded.userId).select("+passwordChangedAt").lean();
  if (!user || !user.isActive) {
    throw new ApiError(401, "Invalid or inactive user.");
  }

  // Invalidate session if password was changed after token was issued
  if (user.passwordChangedAt) {
    const passwordChangedTime = Math.floor(user.passwordChangedAt.getTime() / 1000);
    if (decoded.iat < passwordChangedTime) {
      throw new ApiError(401, "Session expired. Please log in again.");
    }
  }

  return user;
};

module.exports = {
  startRegistration,
  resendRegistrationOtp,
  verifyRegistrationOtp,
  loginWithPassword,
  upsertGoogleUser,
  requestPasswordReset,
  validatePasswordResetToken,
  resetPasswordWithToken,
  getAuthenticatedUser,
  sanitizeUser,
  setAuthCookie,
  clearAuthCookie
};
