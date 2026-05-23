const { OAuth2Client } = require("google-auth-library");
const env = require("../config/env");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");
const {
  upsertGoogleUser,
  sanitizeUser,
  setAuthCookie
} = require("../services/auth.service");

const googleClient = new OAuth2Client(env.googleClientId);

const googleLogin = asyncHandler(async (req, res, next) => {
  if (!env.googleClientId) {
    return next(new ApiError(503, "Google login is not configured."));
  }

  const { credential } = req.body;

  let ticket;
  try {
    ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: env.googleClientId
    });
  } catch {
    return next(new ApiError(401, "Invalid Google token."));
  }

  const payload = ticket.getPayload();
  const user = await upsertGoogleUser({
    googleId: payload.sub,
    email: payload.email,
    name: payload.name,
    picture: payload.picture,
    emailVerified: Boolean(payload.email_verified)
  });

  setAuthCookie(res, user, { remember: true });

  return ApiResponse.success(
    res,
    "Google login successful.",
    { user: sanitizeUser(user) },
    200
  );
});

module.exports = { googleLogin };
