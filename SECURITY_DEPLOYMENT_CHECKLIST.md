# Security Deployment Checklist

This document provides a comprehensive checklist for deploying Modern Studio with security best practices.

## Pre-Deployment Security Checklist

### Environment Configuration

- [ ] **JWT Secret**: Generate a strong, random JWT secret (minimum 64 characters)
  ```bash
  node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
  ```

- [ ] **Environment Variables**: Set all required environment variables in production
  - `NODE_ENV=production`
  - `JWT_SECRET` (strong random secret)
  - `MONGO_URI` (connection string with authentication)
  - `CLIENT_URL` and `CLIENT_URLS` (production URLs)
  - `COOKIE_SECURE=true`
  - `COOKIE_SAMESITE=lax` or `none` (if cross-origin)

- [ ] **Database Security**:
  - [ ] MongoDB connection uses authentication
  - [ ] Database user has minimal required permissions
  - [ ] MongoDB is not exposed to public internet
  - [ ] TLS/SSL enabled for database connection

- [ ] **Email Configuration**:
  - [ ] SMTP credentials are secure
  - [ ] Email templates don't leak sensitive information
  - [ ] Rate limiting on email sending is configured

### Server Security

- [ ] **HTTPS/TLS**:
  - [ ] Valid SSL certificate installed
  - [ ] TLS 1.2+ enforced
  - [ ] HTTP redirects to HTTPS
  - [ ] HSTS header enabled

- [ ] **Headers**:
  - [ ] Helmet.js middleware is active
  - [ ] CSP (Content Security Policy) is configured
  - [ ] X-Frame-Options set to DENY
  - [ ] X-Content-Type-Options set to nosniff

- [ ] **Rate Limiting**:
  - [ ] Login rate limiting: 5 attempts per 15 minutes
  - [ ] Registration rate limiting: 3 attempts per hour
  - [ ] General API rate limiting configured
  - [ ] Rate limit headers exposed for monitoring

- [ ] **CORS**:
  - [ ] Only production URLs are whitelisted
  - [ ] Credentials mode is properly configured
  - [ ] Preflight caching is configured

### Application Security

- [ ] **Authentication**:
  - [ ] Password requirements enforced (8+ chars, uppercase, lowercase, number, special char)
  - [ ] Account lockout after 5 failed attempts (15-minute lock)
  - [ ] Session invalidation on password change
  - [ ] Secure cookie settings (httpOnly, secure, sameSite)
  - [ ] JWT expiration properly configured

- [ ] **Input Validation**:
  - [ ] All inputs validated on server-side
  - [ ] Zod schemas enforce type safety
  - [ ] SQL/NoSQL injection protection
  - [ ] XSS protection via sanitization

- [ ] **CSRF Protection**:
  - [ ] CSRF tokens implemented
  - [ ] Token comparison uses timing-safe comparison
  - [ ] CSRF token refreshed on session expiry

- [ ] **Error Handling**:
  - [ ] No stack traces exposed in production
  - [ ] Generic error messages for 5xx errors
  - [ ] Security events logged
  - [ ] No sensitive data in error responses

### Client Security

- [ ] **Storage**:
  - [ ] No sensitive tokens in localStorage
  - [ ] Authentication via httpOnly cookies
  - [ ] User data in storage is non-sensitive
  - [ ] Storage is cleared on logout

- [ ] **XSS Protection**:
  - [ ] React's built-in XSS protection active
  - [ ] No dangerous HTML rendering
  - [ ] Input sanitization on all user inputs

- [ ] **CSRF Protection**:
  - [ ] CSRF token included in all state-changing requests
  - [ ] Token refresh on 403 CSRF errors
  - [ ] Proper error handling for CSRF failures

## Post-Deployment Verification

### Security Testing

- [ ] **Manual Testing**:
  - [ ] Test login with invalid credentials
  - [ ] Test registration with duplicate email
  - [ ] Test CSRF protection
  - [ ] Test rate limiting
  - [ ] Test session invalidation after password change

- [ ] **Automated Testing**:
  - [ ] Run security linters (eslint-plugin-security)
  - [ ] Run dependency audit (`npm audit`)
  - [ ] Run OWASP ZAP scan
  - [ ] Run Lighthouse security audit

### Monitoring Setup

- [ ] **Logging**:
  - [ ] Security events are logged
  - [ ] Failed login attempts are tracked
  - [ ] CSRF failures are logged
  - [ ] Rate limit violations are logged

- [ ] **Alerting**:
  - [ ] Alerts for multiple failed logins
  - [ ] Alerts for suspicious activity
  - [ ] Alerts for system errors

## Maintenance

### Regular Tasks

- [ ] **Weekly**:
  - [ ] Review security logs
  - [ ] Check for failed login patterns
  - [ ] Review rate limit violations

- [ ] **Monthly**:
  - [ ] Update dependencies
  - [ ] Review and rotate secrets
  - [ ] Audit user accounts
  - [ ] Review CORS configuration

- [ ] **Quarterly**:
  - [ ] Security audit
  - [ ] Penetration testing
  - [ ] Review and update security policies

## Incident Response

### Security Incident Procedures

1. **Identify**: Detect and confirm security incident
2. **Contain**: Isolate affected systems
3. **Eradicate**: Remove threat
4. **Recover**: Restore normal operations
5. **Learn**: Document and improve defenses

### Contact Information

- Security Team: [security@modernstudio.com]
- Emergency Contact: [phone number]

## Compliance

- [ ] GDPR compliance for EU users
- [ ] Data retention policies implemented
- [ ] Privacy policy updated
- [ ] User data export capability available
- [ ] Right to deletion implemented

---

## Quick Start Production Commands

```bash
# Generate JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Run security audit
npm audit

# Check for vulnerabilities
npm audit --audit-level=high

# Build for production
npm run build

# Start production server
npm run start
```

## Environment Variables Reference

```env
# Required
NODE_ENV=production
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
JWT_SECRET=your-generated-secret-here
CLIENT_URL=https://yourdomain.com
CLIENT_URLS=https://yourdomain.com,https://www.yourdomain.com

# Security
COOKIE_SECURE=true
COOKIE_SAMESITE=lax

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@yourdomain.com

# Optional
JWT_EXPIRES_IN=2h
JWT_SESSION_EXPIRES_IN=2h
JWT_REMEMBER_EXPIRES_IN=7d
```

---

Last Updated: 2026-05-23