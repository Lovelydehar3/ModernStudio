const mongoose = require("mongoose");

const pendingRegistrationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    passwordHash: {
      type: String,
      required: true
    },
    otpHash: {
      type: String,
      required: true
    },
    otpExpiresAt: {
      type: Date,
      required: true
    },
    otpAttempts: {
      type: Number,
      default: 0,
      min: 0
    },
    resendAvailableAt: {
      type: Date,
      default: Date.now
    },
    lastSentAt: {
      type: Date,
      default: Date.now
    },
    expiresAt: {
      type: Date,
      required: true
    }
  },
  { timestamps: true }
);

pendingRegistrationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
pendingRegistrationSchema.index({ email: 1, otpExpiresAt: 1 });

module.exports = mongoose.model("PendingRegistration", pendingRegistrationSchema);
