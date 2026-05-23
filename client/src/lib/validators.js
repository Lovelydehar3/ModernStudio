export function validateEmail(email) {
  if (!email || !email.trim()) return "Email is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return "Enter a valid email";
  return null;
}

export function validatePhone(phone) {
  if (!phone || !phone.trim()) return "Phone number is required";
  if (!/^[\d\s+\-()]{7,15}$/.test(phone.trim())) return "Enter a valid phone number";
  return null;
}

export function validateOtp(otp) {
  if (!otp || !otp.trim()) return "OTP is required";
  if (!/^\d{6}$/.test(otp.trim())) return "Enter the 6-digit OTP";
  return null;
}

export function validatePassword(password) {
  if (!password) return "Password is required";
  if (password.length < 8) return "Minimum 8 characters";
  if (!/[A-Z]/.test(password)) return "Add at least one uppercase letter";
  if (!/[a-z]/.test(password)) return "Add at least one lowercase letter";
  if (!/\d/.test(password)) return "Add at least one number";
  if (!/[^A-Za-z\d]/.test(password)) return "Add at least one special character";
  return null;
}

export function validateName(name) {
  if (!name || !name.trim()) return "Name is required";
  return null;
}
