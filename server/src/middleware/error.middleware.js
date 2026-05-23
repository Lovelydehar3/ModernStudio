const env = require("../config/env");
const ApiResponse = require("../utils/ApiResponse");

/**
 * Global Error Handler Middleware
 * Handles all errors and ensures no sensitive information is leaked
 */
const errorMiddleware = (error, req, res, _next) => {
  let statusCode = error.statusCode || 500;
  let message = error.message || "Internal server error.";
  let details = error.details || null;

  // Handle MongoDB duplicate key error
  if (error.code === 11000) {
    statusCode = 409;
    const field = Object.keys(error.keyPattern || {})[0] || "value";
    // Don't reveal which specific value already exists
    message = `An account with this ${field} already exists.`;
  }

  // Handle Multer file upload errors
  if (error.name === "MulterError") {
    statusCode = 400;
    message =
      error.code === "LIMIT_FILE_SIZE"
        ? "File is too large. Upload files up to 100 MB."
        : "File upload failed.";
  }

  // Handle Mongoose validation errors
  if (error.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(error.errors || {})
      .map((entry) => entry.message)
      .filter(Boolean)
      .join(" ") || "Validation failed.";
  }

  // Handle Mongoose cast errors (invalid ObjectId format)
  if (error.name === "CastError") {
    statusCode = 400;
    message = "Invalid request value.";
  }

  // Handle JSON parsing errors
  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    statusCode = 400;
    message = "Invalid JSON in request body.";
  }

  // Handle JWT errors
  if (error.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid authentication token.";
  }

  if (error.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Authentication token has expired.";
  }

  // For 5xx errors, log the full error but return generic message
  if (statusCode >= 500) {
    console.error(`[API Error] ${req.method} ${req.originalUrl}`, {
      error: error.message,
      stack: env.nodeEnv === "development" ? error.stack : undefined,
      body: req.body,
      query: req.query
    });
    // Never expose internal error details to client
    message = "Internal server error.";
    details = null;
  }

  // Log 4xx errors for monitoring
  if (statusCode >= 400 && statusCode < 500) {
    console.warn(`[API Warning] ${statusCode} - ${req.method} ${req.originalUrl}:`, message);
  }

  return ApiResponse.error(res, message, statusCode, details);
};

module.exports = errorMiddleware;
