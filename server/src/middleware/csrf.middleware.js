const crypto = require("crypto");
const env = require("../config/env");
const { logCsrfFailure } = require("../utils/securityLogger");

const CSRF_COOKIE = "csrf_token";
const CSRF_HEADER = "x-csrf-token";
const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

// Generate a cryptographically secure CSRF token
const generateToken = () => crypto.randomBytes(32).toString("hex");

// Use timing-safe comparison to prevent timing attacks
const safeCompare = (a, b) => {
  if (typeof a !== "string" || typeof b !== "string") {
    return false;
  }
  if (a.length !== b.length) {
    return false;
  }
  return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
};

const cookieOptions = {
  httpOnly: false, // Must be false so JavaScript can read it for the header
  sameSite: env.cookieSameSite,
  secure: env.cookieSecure,
  path: "/",
  maxAge: 1000 * 60 * 60 * 24 * 2, // 2 days
  // Do not set domain to prevent subdomain attacks
};

const csrfMiddleware = (req, res, next) => {
  // Generate CSRF token on GET requests (set as readable cookie)
  if (SAFE_METHODS.has(req.method)) {
    const existing = req.cookies?.[CSRF_COOKIE];
    if (!existing) {
      const token = generateToken();
      res.cookie(CSRF_COOKIE, token, cookieOptions);
    }
    return next();
  }

  // Validate CSRF token on state-changing requests
  const cookieToken = req.cookies?.[CSRF_COOKIE];
  const headerToken = req.headers[CSRF_HEADER];

  if (!cookieToken || !headerToken || !safeCompare(cookieToken, headerToken)) {
    logCsrfFailure(req.ip, req.get("User-Agent"), req.path);
    return res.status(403).json({
      success: false,
      message: "CSRF token validation failed. Please refresh the page and try again."
    });
  }

  return next();
};

module.exports = csrfMiddleware;
