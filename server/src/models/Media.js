const mongoose = require("mongoose");

const mediaSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      enum: ["photo", "video"],
      required: true
    },
    category: {
      type: String,
      enum: [
        "home", "films", "weddings", "portfolio",
        "wedding", "pre-wedding", "engagement", "haldi", "mehndi",
        "cinematic-films", "drone", "fashion", "baby-shoot"
      ],
      required: true
    },
    url: {
      type: String,
      required: true,
      trim: true
    },
    thumbnailUrl: {
      type: String,
      default: "",
      trim: true
    },
    altText: {
      type: String,
      default: "",
      trim: true
    },
    // Keep legacy 'alt' as alias for backward compatibility
    alt: {
      type: String,
      default: "",
      trim: true
    },
    tags: {
      type: [String],
      default: []
    },
    cloudinaryPublicId: {
      type: String,
      default: "",
      trim: true
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    sortOrder: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

mediaSchema.index({ category: 1, isFeatured: 1, sortOrder: 1 });
mediaSchema.index({ tags: 1 });

module.exports = mongoose.model("Media", mediaSchema);
