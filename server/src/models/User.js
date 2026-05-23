const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
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
      trim: true
    },
    phone: {
      type: String,
      default: undefined,
      trim: true
    },
    passwordHash: {
      type: String,
      select: false,
      default: null
    },
    googleId: {
      type: String,
      default: undefined,
      trim: true
    },
    avatar: {
      type: String,
      default: null
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user"
    },
    isEmailVerified: {
      type: Boolean,
      default: false
    },
    authProvider: {
      type: String,
      enum: ["local", "google", "phone"],
      default: "local"
    },
    lastLoginAt: {
      type: Date,
      default: null
    },
    loginAttempts: {
      type: Number,
      default: 0,
      min: 0
    },
    lockUntil: {
      type: Date,
      default: null
    },
    isActive: {
      type: Boolean,
      default: true
    },
    passwordChangedAt: {
      type: Date,
      default: null
    },
    lastPasswordResetAt: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

userSchema.index({ email: 1 }, { unique: true });
userSchema.index(
  { phone: 1 },
  {
    unique: true,
    partialFilterExpression: { phone: { $type: "string" } }
  }
);
userSchema.index(
  { googleId: 1 },
  {
    unique: true,
    partialFilterExpression: { googleId: { $type: "string" } }
  }
);
userSchema.index({ role: 1, isActive: 1 });

userSchema.methods.setPassword = async function setPassword(password) {
  this.passwordHash = await bcrypt.hash(password, 12);
};

userSchema.methods.comparePassword = function comparePassword(password) {
  if (!this.passwordHash) return false;
  return bcrypt.compare(password, this.passwordHash);
};

module.exports = mongoose.model("User", userSchema);
