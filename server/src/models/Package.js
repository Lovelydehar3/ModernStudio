const mongoose = require("mongoose");

const packageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    priceDisplay: {
      type: String,
      required: true,
      trim: true
    },
    startingPrice: {
      type: Number,
      required: true,
      min: 0
    },
    description: {
      type: String,
      default: ""
    },
    features: {
      type: [String],
      default: []
    },
    coverImage: {
      type: String,
      default: "",
      trim: true
    },
    galleryImages: {
      type: [String],
      default: []
    },
    // Reference standalone Addon collection
    addOns: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Addon"
      }
    ],
    isActive: {
      type: Boolean,
      default: true
    },
    sortOrder: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

packageSchema.index({ isActive: 1, sortOrder: 1, startingPrice: 1 });

module.exports = mongoose.model("Package", packageSchema);
