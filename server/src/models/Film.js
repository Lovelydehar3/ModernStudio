const mongoose = require("mongoose");

const filmSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    summary: {
      type: String,
      default: ""
    },
    coverImage: {
      type: String,
      default: "",
      trim: true
    },
    videoUrl: {
      type: String,
      default: "",
      trim: true
    },
    tags: {
      type: [String],
      default: []
    },
    isPublished: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

filmSchema.index({ isPublished: 1, createdAt: -1 });

module.exports = mongoose.model("Film", filmSchema);
