/**
 * Validate email address with proper format checking
 * @param {string} email - Email to validate
 * @returns {string|null} Error message or null if valid
 */
export function validateEmail(email) {
  if (!email || !email.trim()) return "Email is required";
  const trimmed = email.trim();
  // Check length to prevent abuse
  if (trimmed.length > 254) return "Email is too long";
  // RFC 5322 compliant email regex (simplified but secure)
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return "Enter a valid email";
  // Additional check for common invalid patterns
  if (trimmed.startsWith(".") || trimmed.endsWith(".") || trimmed.includes("..")) {
    return "Email format is invalid";
  }
  return null;
}

/**
 * Validate phone number with international format support
 * @param {string} phone - Phone number to validate
 * @returns {string|null} Error message or null if valid
 */
export function validatePhone(phone) {
  if (!phone || !phone.trim()) return "Phone number is required";
  const trimmed = phone.trim();
  // Remove all non-digit characters except + at start
  const digitsOnly = trimmed.replace(/^(\+)?[^\d]/g, "$1").replace(/[^\d]/g, "");
  if (digitsOnly.length < 7 || digitsOnly.length > 15) {
    return "Phone number must be 7-15 digits";
  }
  if (!/^[\d\s+\-()]{7,20}$/.test(trimmed)) return "Enter a valid phone number";
  return null;
}

/**
 * Validate 6-digit OTP
 * @param {string} otp - OTP to validate
 * @returns {string|null} Error message or null if valid
 */
export function validateOtp(otp) {
  if (!otp || !otp.trim()) return "OTP is required";
  const trimmed = otp.trim();
  if (!/^\d{6}$/.test(trimmed)) return "Enter the 6-digit OTP";
  return null;
}

/**
 * Validate password with strong security requirements
 * @param {string} password - Password to validate
 * @returns {string|null} Error message or null if valid
 */
export function validatePassword(password) {
  if (!password) return "Password is required";
  if (password.length < 8) return "Minimum 8 characters";
  if (password.length > 128) return "Maximum 128 characters";
  if (!/[A-Z]/.test(password)) return "Add at least one uppercase letter";
  if (!/[a-z]/.test(password)) return "Add at least one lowercase letter";
  if (!/\d/.test(password)) return "Add at least one number";
  if (!/[^A-Za-z\d]/.test(password)) return "Add at least one special character";
  // Check for common weak patterns
  if (/(.)\1{2,}/.test(password)) return "Password should not contain repeated characters";
  if (/^(123|abc|qwerty|password|admin)/i.test(password)) return "Password is too common";
  return null;
}

/**
 * Validate user name
 * @param {string} name - Name to validate
 * @returns {string|null} Error message or null if valid
 */
export function validateName(name) {
  if (!name || !name.trim()) return "Name is required";
  const trimmed = name.trim();
  if (trimmed.length < 2) return "Name must be at least 2 characters";
  if (trimmed.length > 100) return "Name must be less than 100 characters";
  // Allow unicode characters for international names
  if (!/^[\p{L}\s'-]+$/u.test(trimmed)) {
    return "Name contains invalid characters";
  }
  return null;
}

/**
 * Validate confirm password matches
 * @param {string} password - Original password
 * @param {string} confirmPassword - Confirmation password
 * @returns {string|null} Error message or null if valid
 */
export function validateConfirmPassword(password, confirmPassword) {
  if (!confirmPassword) return "Please confirm your password";
  if (password !== confirmPassword) return "Passwords do not match";
  return null;
}
