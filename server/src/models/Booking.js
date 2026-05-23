const mongoose = require("mongoose");

const selectedPackageSchema = new mongoose.Schema(
  {
    packageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Package",
      default: null
    },
    name: { type: String, required: true, trim: true },
    priceDisplay: { type: String, required: true, trim: true },
    startingPrice: { type: Number, required: true, min: 0 }
  },
  { _id: false }
);

const bookingAddOnSchema = new mongoose.Schema(
  {
    addonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Addon",
      default: null
    },
    name: { type: String, required: true, trim: true },
    priceDisplay: { type: String, required: true, trim: true },
    startingPrice: { type: Number, required: true, min: 0 }
  },
  { _id: false }
);

const statusHistorySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      required: true
    },
    note: {
      type: String,
      default: ""
    },
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    changedAt: {
      type: Date,
      default: Date.now
    }
  },
  { _id: false }
);

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true
    },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    eventType: { type: String, default: "", trim: true },
    eventDate: { type: Date, default: null },
    eventLocation: { type: String, default: "", trim: true },
    days: { type: Number, default: 1, min: 1, max: 30 },
    message: { type: String, default: "", trim: true },
    selectedPackage: {
      type: selectedPackageSchema,
      required: true
    },
    addOns: {
      type: [bookingAddOnSchema],
      default: []
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending"
    },
    statusHistory: {
      type: [statusHistorySchema],
      default: [{ status: "pending", note: "Booking created." }]
    },
    // Payment fields (future-ready)
    paymentStatus: {
      type: String,
      enum: ["unpaid", "processing", "paid", "failed", "refunded"],
      default: "unpaid"
    },
    totalAmount: {
      type: Number,
      default: 0,
      min: 0
    },
    advancePaid: {
      type: Number,
      default: 0,
      min: 0
    },
    payment: {
      status: {
        type: String,
        enum: ["unpaid", "processing", "paid", "failed", "refunded"],
        default: "unpaid"
      },
      amount: { type: Number, default: 0 },
      currency: { type: String, default: "INR" },
      transactionId: { type: String, default: "" },
      provider: { type: String, default: "" },
      paidAt: { type: Date, default: null }
    }
  },
  { timestamps: true }
);

bookingSchema.index({ status: 1, createdAt: -1 });
bookingSchema.index({ email: 1, phone: 1 });
bookingSchema.index({ paymentStatus: 1 });

module.exports = mongoose.model("Booking", bookingSchema);
