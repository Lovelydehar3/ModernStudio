const ApiResponse = require("../utils/ApiResponse");

const errorMiddleware = (error, _req, res, _next) => {
  let statusCode = error.statusCode || 500;
  let message = error.message || "Internal server error.";
  const details = error.details || null;

  if (error.code === 11000) {
    statusCode = 409;
    const field = Object.keys(error.keyPattern || {})[0] || "value";
    message = `An account with this ${field} already exists.`;
  }

  if (error.name === "MulterError") {
    statusCode = 400;
    message =
      error.code === "LIMIT_FILE_SIZE"
        ? "File is too large. Upload files up to 100 MB."
        : error.message || "File upload failed.";
  }

  if (error.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(error.errors || {})
      .map((entry) => entry.message)
      .filter(Boolean)
      .join(" ") || "Validation failed.";
  }

  if (error.name === "CastError") {
    statusCode = 400;
    message = "Invalid request value.";
  }

  if (statusCode >= 500) {
    console.error("[API Error]", error);
    message = "Internal server error.";
  }

  return ApiResponse.error(res, message, statusCode, details);
};

module.exports = errorMiddleware;
