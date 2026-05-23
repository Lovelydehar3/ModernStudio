const nodemailer = require("nodemailer");
const env = require("../config/env");

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  if (!env.smtpHost || !env.smtpUser || !env.smtpPass) {
    if (env.emailDevMode) {
      console.warn("[Email] EMAIL_DEV_MODE=true. Emails will be logged instead of sent.");
      return null;
    }
    throw new Error("SMTP is not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, and SMTP_PASS.");
  }

  transporter = nodemailer.createTransport({
    host: env.smtpHost,
    port: env.smtpPort || 587,
    secure: env.smtpSecure === "true",
    auth: {
      user: env.smtpUser,
      pass: env.smtpPass
    }
  });

  return transporter;
}

const sendMail = async ({ to, subject, html, devLog }) => {
  const transport = getTransporter();

  if (!transport) {
    console.log(devLog);
    return true;
  }

  await transport.sendMail({
    from: env.smtpFrom || `"Modern Wedding Studios" <${env.smtpUser}>`,
    to,
    subject,
    html
  });
  return true;
};

async function sendOtpEmail(to, otp, purpose = "verification") {
  const subjects = {
    verification: "Verify Your Email - Modern Wedding Studios",
    reset: "Password Reset Code - Modern Wedding Studios"
  };

  const labels = {
    verification: "verify your email address",
    reset: "reset your password"
  };

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin:0;padding:0;background-color:#faf8f6;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
      <div style="max-width:480px;margin:40px auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e8e0d8;">
        <div style="background:linear-gradient(135deg,#D8A7B1,#8B7AA8);padding:32px 24px;text-align:center;">
          <h1 style="color:#ffffff;margin:0;font-size:20px;font-weight:600;letter-spacing:1px;">MODERN WEDDING STUDIOS</h1>
        </div>
        <div style="padding:32px 24px;">
          <p style="color:#333;font-size:15px;line-height:1.6;margin:0 0 24px;">
            Use the following code to ${labels[purpose]}:
          </p>
          <div style="background:#f5f0ec;border-radius:12px;padding:20px;text-align:center;margin-bottom:24px;">
            <span style="font-size:36px;font-weight:700;letter-spacing:8px;color:#333;">${otp}</span>
          </div>
          <p style="color:#888;font-size:13px;line-height:1.5;margin:0;">
            This code expires in 10 minutes. If you didn't request this, please ignore this email.
          </p>
        </div>
        <div style="padding:16px 24px;border-top:1px solid #f0ebe6;text-align:center;">
          <p style="color:#aaa;font-size:11px;margin:0;">Modern Wedding Studios &bull; Cinematic Wedding Films & Portraits</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendMail({
    to,
    subject: subjects[purpose] || subjects.verification,
    html,
    devLog: `[Email OTP] To: ${to} | Purpose: ${purpose} | Code: ${otp}`
  });
  console.log(`[Email] OTP sent to ${to} (${purpose})`);
  return true;
}

async function sendPasswordResetEmail(to, resetUrl) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin:0;padding:0;background-color:#faf8f6;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
      <div style="max-width:520px;margin:40px auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e8e0d8;">
        <div style="background:linear-gradient(135deg,#D8A7B1,#8B7AA8);padding:32px 24px;text-align:center;">
          <h1 style="color:#ffffff;margin:0;font-size:20px;font-weight:600;letter-spacing:1px;">MODERN WEDDING STUDIOS</h1>
        </div>
        <div style="padding:32px 24px;">
          <p style="color:#333;font-size:15px;line-height:1.6;margin:0 0 24px;">
          Use this secure link to reset your password. It expires in 15 minutes and can be used only once.
          </p>
          <p style="margin:0 0 28px;text-align:center;">
            <a href="${resetUrl}" style="display:inline-block;background:#1F1F1F;color:#ffffff;text-decoration:none;border-radius:999px;padding:14px 24px;font-size:13px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">
              Reset Password
            </a>
          </p>
          <p style="color:#888;font-size:12px;line-height:1.6;margin:0;word-break:break-all;">
            If the button does not work, paste this link into your browser:<br>${resetUrl}
          </p>
        </div>
        <div style="padding:16px 24px;border-top:1px solid #f0ebe6;text-align:center;">
          <p style="color:#aaa;font-size:11px;margin:0;">Modern Wedding Studios &bull; Cinematic Wedding Films & Portraits</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendMail({
    to,
    subject: "Reset Your Password - Modern Wedding Studios",
    html,
    devLog: `[Password Reset Link] To: ${to} | ${resetUrl}`
  });
  console.log(`[Email] Password reset link sent to ${to}`);
  return true;
}

async function sendBookingConfirmationEmail(to, booking) {
  const eventDate = booking.eventDate
    ? new Date(booking.eventDate).toLocaleDateString("en-IN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
      })
    : "To be confirmed";

  const addOnsList =
    booking.addOns?.length
      ? booking.addOns.map((a) => `<li style="padding:4px 0;color:#555;">${a.name} — ${a.priceDisplay}</li>`).join("")
      : '<li style="padding:4px 0;color:#999;">None</li>';

  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
    <body style="margin:0;padding:0;background-color:#faf8f6;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
      <div style="max-width:520px;margin:40px auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e8e0d8;">
        <div style="background:linear-gradient(135deg,#D8A7B1,#8B7AA8);padding:32px 24px;text-align:center;">
          <h1 style="color:#ffffff;margin:0;font-size:20px;font-weight:600;letter-spacing:1px;">BOOKING CONFIRMED</h1>
        </div>
        <div style="padding:32px 24px;">
          <p style="color:#333;font-size:15px;line-height:1.6;margin:0 0 20px;">
            Hi ${booking.name},<br>Thank you for choosing Modern Wedding Studios! We've received your booking request.
          </p>
          <div style="background:#f5f0ec;border-radius:12px;padding:20px;margin-bottom:20px;">
            <table style="width:100%;font-size:14px;color:#333;border-collapse:collapse;">
              <tr><td style="padding:6px 0;font-weight:600;">Event</td><td style="padding:6px 0;">${booking.eventType}</td></tr>
              <tr><td style="padding:6px 0;font-weight:600;">Date</td><td style="padding:6px 0;">${eventDate}</td></tr>
              <tr><td style="padding:6px 0;font-weight:600;">Location</td><td style="padding:6px 0;">${booking.eventLocation || "TBD"}</td></tr>
              <tr><td style="padding:6px 0;font-weight:600;">Days</td><td style="padding:6px 0;">${booking.days || 1}</td></tr>
              <tr><td style="padding:6px 0;font-weight:600;">Package</td><td style="padding:6px 0;">${booking.selectedPackage?.name || "TBD"}</td></tr>
            </table>
          </div>
          <p style="color:#333;font-size:14px;font-weight:600;margin:0 0 8px;">Add-ons:</p>
          <ul style="margin:0 0 20px;padding-left:20px;">${addOnsList}</ul>
          <p style="color:#888;font-size:13px;line-height:1.5;margin:0;">
            Our team will review your request and get back to you within 24 hours with availability and next steps.
          </p>
        </div>
        <div style="padding:16px 24px;border-top:1px solid #f0ebe6;text-align:center;">
          <p style="color:#aaa;font-size:11px;margin:0;">Modern Wedding Studios &bull; Cinematic Wedding Films & Portraits</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendMail({
    to,
    subject: "Booking Received - Modern Wedding Studios",
    html,
    devLog: `[Booking Confirmation] To: ${to} | Event: ${booking.eventType} | Date: ${eventDate}`
  });
  return true;
}

async function sendAdminBookingNotification(booking) {
  const eventDate = booking.eventDate
    ? new Date(booking.eventDate).toLocaleDateString("en-IN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
      })
    : "Not specified";

  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
    <body style="margin:0;padding:0;background-color:#faf8f6;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
      <div style="max-width:520px;margin:40px auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e8e0d8;">
        <div style="background:#1F1F1F;padding:24px;text-align:center;">
          <h1 style="color:#D8A7B1;margin:0;font-size:18px;font-weight:600;letter-spacing:1px;">NEW BOOKING REQUEST</h1>
        </div>
        <div style="padding:24px;">
          <table style="width:100%;font-size:14px;color:#333;border-collapse:collapse;">
            <tr><td style="padding:6px 0;font-weight:600;width:100px;">Name</td><td style="padding:6px 0;">${booking.name}</td></tr>
            <tr><td style="padding:6px 0;font-weight:600;">Email</td><td style="padding:6px 0;">${booking.email}</td></tr>
            <tr><td style="padding:6px 0;font-weight:600;">Phone</td><td style="padding:6px 0;">${booking.phone}</td></tr>
            <tr><td style="padding:6px 0;font-weight:600;">Event</td><td style="padding:6px 0;">${booking.eventType}</td></tr>
            <tr><td style="padding:6px 0;font-weight:600;">Date</td><td style="padding:6px 0;">${eventDate}</td></tr>
            <tr><td style="padding:6px 0;font-weight:600;">Location</td><td style="padding:6px 0;">${booking.eventLocation || "TBD"}</td></tr>
            <tr><td style="padding:6px 0;font-weight:600;">Days</td><td style="padding:6px 0;">${booking.days || 1}</td></tr>
            <tr><td style="padding:6px 0;font-weight:600;">Package</td><td style="padding:6px 0;">${booking.selectedPackage?.name || "TBD"} — ${booking.selectedPackage?.priceDisplay || ""}</td></tr>
          </table>
          ${booking.message ? `<p style="color:#555;font-size:13px;margin:16px 0 0;padding:12px;background:#f9f7f5;border-radius:8px;"><strong>Message:</strong> ${booking.message}</p>` : ""}
        </div>
        <div style="padding:16px 24px;border-top:1px solid #f0ebe6;text-align:center;">
          <p style="color:#aaa;font-size:11px;margin:0;">Modern Wedding Studios Admin</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const adminEmail = env.adminEmail || env.smtpFrom;
  if (adminEmail) {
    await sendMail({
      to: adminEmail,
      subject: `[New Booking] ${booking.name} — ${booking.eventType}`,
      html,
      devLog: `[Admin Booking Notification] ${booking.name} | ${booking.email} | ${booking.eventType}`
    });
  }
  return true;
}

module.exports = { sendOtpEmail, sendPasswordResetEmail, sendBookingConfirmationEmail, sendAdminBookingNotification };
