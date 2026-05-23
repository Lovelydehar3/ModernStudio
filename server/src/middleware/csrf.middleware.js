const crypto = require("crypto");
const env = require("../config/env");

const CSRF_COOKIE = "csrf_token";
const CSRF_HEADER = "x-csrf-token";
const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

const generateToken = () => crypto.randomBytes(32).toString("hex");

const cookieOptions = {
  httpOnly: false,
  sameSite: env.cookieSameSite,
  secure: env.cookieSecure,
  path: "/",
  maxAge: 1000 * 60 * 60 * 24 * 2
};

const csrfMiddleware = (req, res, next) => {
  // Generate CSRF token on GET requests (set as readable cookie)
  if (SAFE_METHODS.has(req.method)) {
    const existing = req.cookies?.[CSRF_COOKIE];
    if (!existing) {
      res.cookie(CSRF_COOKIE, generateToken(), cookieOptions);
    }
    return next();
  }

  // Validate CSRF token on state-changing requests
  const cookieToken = req.cookies?.[CSRF_COOKIE];
  const headerToken = req.headers[CSRF_HEADER];

  if (!cookieToken || !headerToken || cookieToken !== headerToken) {
    return res.status(403).json({
      success: false,
      message: "CSRF token validation failed."
    });
  }

  return next();
};

module.exports = csrfMiddleware;
