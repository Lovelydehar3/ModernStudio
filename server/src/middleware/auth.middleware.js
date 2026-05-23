const env = require("../config/env");
const ApiError = require("../utils/ApiError");
const { getAuthenticatedUser } = require("../services/auth.service");
const { sanitizeUser } = require("../utils/authSecurity");

const extractToken = (req) => req.cookies?.[env.authCookieName] || null;

const authMiddleware = async (req, _res, next) => {
  try {
    const user = await getAuthenticatedUser(extractToken(req));

    req.user = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      isEmailVerified: Boolean(user.isEmailVerified)
    };
    req.authUser = sanitizeUser(user);
    return next();
  } catch (error) {
    if (error instanceof ApiError) return next(error);
    return next(new ApiError(401, "Invalid or expired token."));
  }
};

module.exports = authMiddleware;
