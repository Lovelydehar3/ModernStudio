/**
 * Security Audit Logger
 * Logs security-relevant events for monitoring and compliance
 */

const env = require("../config/env");

// Security event types
const SECURITY_EVENTS = {
  LOGIN_SUCCESS: "LOGIN_SUCCESS",
  LOGIN_FAILURE: "LOGIN_FAILURE",
  LOGIN_LOCKED: "LOGIN_LOCKED",
  LOGOUT: "LOGOUT",
  REGISTER_START: "REGISTER_START",
  REGISTER_COMPLETE: "REGISTER_COMPLETE",
  REGISTER_FAILED: "REGISTER_FAILED",
  PASSWORD_RESET_REQUEST: "PASSWORD_RESET_REQUEST",
  PASSWORD_RESET_SUCCESS: "PASSWORD_RESET_SUCCESS",
  PASSWORD_RESET_FAILED: "PASSWORD_RESET_FAILED",
  PASSWORD_CHANGED: "PASSWORD_CHANGED",
  SESSION_INVALIDATED: "SESSION_INVALIDATED",
  CSRF_FAILURE: "CSRF_FAILURE",
  RATE_LIMIT_EXCEEDED: "RATE_LIMIT_EXCEEDED",
  SUSPICIOUS_ACTIVITY: "SUSPICIOUS_ACTIVITY"
};

// Log levels
const LOG_LEVELS = {
  INFO: "INFO",
  WARNING: "WARNING",
  ERROR: "ERROR",
  CRITICAL: "CRITICAL"
};

// Map events to log levels
const eventToLogLevel = (event) => {
  const warningEvents = [
    SECURITY_EVENTS.LOGIN_FAILURE,
    SECURITY_EVENTS.CSRF_FAILURE,
    SECURITY_EVENTS.RATE_LIMIT_EXCEEDED
  ];
  
  const errorEvents = [
    SECURITY_EVENTS.LOGIN_LOCKED,
    SECURITY_EVENTS.SUSPICIOUS_ACTIVITY
  ];
  
  const criticalEvents = [];
  
  if (criticalEvents.includes(event)) return LOG_LEVELS.CRITICAL;
  if (errorEvents.includes(event)) return LOG_LEVELS.ERROR;
  if (warningEvents.includes(event)) return LOG_LEVELS.WARNING;
  return LOG_LEVELS.INFO;
};

/**
 * Log a security event
 * @param {string} event - The security event type
 * @param {Object} details - Additional details about the event
 * @param {string} ipAddress - IP address of the client
 * @param {string} userAgent - User agent string
 */
const logSecurityEvent = (event, details = {}, ipAddress = "unknown", userAgent = "unknown") => {
  const logLevel = eventToLogLevel(event);
  const timestamp = new Date().toISOString();
  
  // Sanitize sensitive data
  const sanitizedDetails = { ...details };
  if (sanitizedDetails.password) delete sanitizedDetails.password;
  if (sanitizedDetails.token) delete sanitizedDetails.token;
  if (sanitizedDetails.otp) delete sanitizedDetails.otp;
  
  const logEntry = {
    timestamp,
    level: logLevel,
    event,
    ipAddress,
    userAgent: userAgent.substring(0, 200), // Limit length
    environment: env.nodeEnv,
    details: sanitizedDetails
  };
  
  // In production, this would be sent to a logging service
  // For now, we log to console with a clear prefix
  const logPrefix = `[SECURITY][${logLevel}]`;
  
  switch (logLevel) {
    case LOG_LEVELS.CRITICAL:
      console.error(logPrefix, JSON.stringify(logEntry));
      break;
    case LOG_LEVELS.ERROR:
      console.error(logPrefix, JSON.stringify(logEntry));
      break;
    case LOG_LEVELS.WARNING:
      console.warn(logPrefix, JSON.stringify(logEntry));
      break;
    default:
      console.info(logPrefix, JSON.stringify(logEntry));
  }
  
  // In production, also log to file or external service
  if (env.nodeEnv === "production") {
    // Could integrate with Winston, Pino, or cloud logging
    // For now, the console log with structured JSON is sufficient
  }
};

/**
 * Log failed login attempt with brute force detection
 */
const logFailedLogin = (email, ipAddress, userAgent, isLocked = false) => {
  logSecurityEvent(
    isLocked ? SECURITY_EVENTS.LOGIN_LOCKED : SECURITY_EVENTS.LOGIN_FAILURE,
    { email, reason: isLocked ? "Account temporarily locked" : "Invalid credentials" },
    ipAddress,
    userAgent
  );
};

/**
 * Log successful login
 */
const logSuccessfulLogin = (userId, email, ipAddress, userAgent) => {
  logSecurityEvent(
    SECURITY_EVENTS.LOGIN_SUCCESS,
    { userId, email },
    ipAddress,
    userAgent
  );
};

/**
 * Log logout
 */
const logLogout = (userId, ipAddress, userAgent) => {
  logSecurityEvent(
    SECURITY_EVENTS.LOGOUT,
    { userId },
    ipAddress,
    userAgent
  );
};

/**
 * Log CSRF failure
 */
const logCsrfFailure = (ipAddress, userAgent, path) => {
  logSecurityEvent(
    SECURITY_EVENTS.CSRF_FAILURE,
    { path },
    ipAddress,
    userAgent
  );
};

/**
 * Log rate limit exceeded
 */
const logRateLimitExceeded = (ipAddress, userAgent, endpoint) => {
  logSecurityEvent(
    SECURITY_EVENTS.RATE_LIMIT_EXCEEDED,
    { endpoint },
    ipAddress,
    userAgent
  );
};

module.exports = {
  SECURITY_EVENTS,
  LOG_LEVELS,
  logSecurityEvent,
  logFailedLogin,
  logSuccessfulLogin,
  logLogout,
  logCsrfFailure,
  logRateLimitExceeded
};