/**
 * Basic input sanitization middleware.
 * Trims strings and removes potential XSS vectors from request body.
 */
const sanitizeValue = (value) => {
  if (typeof value === "string") {
    return value
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/on\w+\s*=\s*["'][^"']*["']/gi, "")
      .replace(/javascript\s*:/gi, "")
      .replace(/data\s*:\s*text\/html/gi, "")
      .trim();
  }
  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }
  if (value && typeof value === "object") {
    const sanitized = {};
    for (const [key, val] of Object.entries(value)) {
      if (key.startsWith("$") || key.includes(".")) continue;
      sanitized[key] = sanitizeValue(val);
    }
    return sanitized;
  }
  return value;
};

const sanitize = (req, _res, next) => {
  if (req.body && typeof req.body === "object") {
    req.body = sanitizeValue(req.body);
  }
  if (req.query && typeof req.query === "object") {
    req.query = sanitizeValue(req.query);
  }
  if (req.params && typeof req.params === "object") {
    req.params = sanitizeValue(req.params);
  }
  next();
};

module.exports = sanitize;
