const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const {
  startRegistration,
  resendRegistrationOtp,
  verifyRegistrationOtp,
  loginWithPassword,
  requestPasswordReset,
  validatePasswordResetToken,
  resetPasswordWithToken,
  sanitizeUser,
  setAuthCookie,
  clearAuthCookie
} = require("../services/auth.service");

const register = asyncHandler(async (req, res) => {
  const pending = await startRegistration(req.body);
  return ApiResponse.success(
    res,
    "Verification code sent to your email.",
    {
      verificationRequired: true,
      ...pending
    },
    202
  );
});

const sendVerificationOtp = asyncHandler(async (req, res) => {
  const pending = await resendRegistrationOtp(req.body);
  return ApiResponse.success(
    res,
    "Verification code sent to your email.",
    pending,
    200
  );
});

const verifyEmailOtp = asyncHandler(async (req, res) => {
  const user = await verifyRegistrationOtp(req.body);
  setAuthCookie(res, user, { remember: true });

  return ApiResponse.success(
    res,
    "Email verified. Account created successfully.",
    { user: sanitizeUser(user) },
    201
  );
});

const login = asyncHandler(async (req, res) => {
  const { user, remember } = await loginWithPassword(req.body);
  setAuthCookie(res, user, { remember });

  return ApiResponse.success(
    res,
    "Login successful.",
    { user: sanitizeUser(user) },
    200
  );
});

const forgotPassword = asyncHandler(async (req, res) => {
  await requestPasswordReset(req.body);
  return ApiResponse.success(
    res,
    "If an account exists, a secure reset link has been sent.",
    null,
    200
  );
});

const validateResetToken = asyncHandler(async (req, res) => {
  await validatePasswordResetToken(req.body);
  return ApiResponse.success(res, "Reset link is valid.", null, 200);
});

const resetPassword = asyncHandler(async (req, res) => {
  await resetPasswordWithToken(req.body);
  return ApiResponse.success(res, "Password reset successful. Please sign in.", null, 200);
});

const me = asyncHandler(async (req, res) => {
  return ApiResponse.success(res, "Profile fetched.", { user: req.authUser }, 200);
});

const csrf = asyncHandler(async (_req, res) => {
  return ApiResponse.success(res, "CSRF token ready.", null, 200);
});

const logout = asyncHandler(async (_req, res) => {
  clearAuthCookie(res);
  return ApiResponse.success(res, "Logged out successfully.", null, 200);
});

module.exports = {
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
};
