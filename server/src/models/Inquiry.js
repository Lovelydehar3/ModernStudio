const mongoose = require("mongoose");

const inquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, default: "", trim: true },
    message: { type: String, required: true, trim: true },
    sourcePage: { type: String, default: "home", trim: true },
    isResolved: { type: Boolean, default: false },
    resolvedAt: { type: Date, default: null },
    resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    adminNotes: { type: String, default: "", trim: true }
  },
  { timestamps: true }
);

inquirySchema.index({ isResolved: 1, createdAt: -1 });

module.exports = mongoose.model("Inquiry", inquirySchema);
