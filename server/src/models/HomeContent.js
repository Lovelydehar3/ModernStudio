const mongoose = require("mongoose");

const statSchema = new mongoose.Schema(
  {
    label: { type: String, required: true, trim: true },
    value: { type: String, required: true, trim: true }
  },
  { _id: false }
);

const homeContentSchema = new mongoose.Schema(
  {
    singletonKey: {
      type: String,
      default: "main",
      unique: true
    },
    heroTitle: {
      type: String,
      default: "Cinematic Wedding Studios & Fashion Imagery"
    },
    heroSubtitle: {
      type: String,
      default: "We do not capture moments. We craft films and frames."
    },
    heroBackgroundMedia: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1800&q=80"
    },
    aboutSnippet: {
      type: String,
      default:
        "Modern Wedding Studios is a premium creative brand focused on cinematic wedding storytelling and high-end fashion photography."
    },
    stats: {
      type: [statSchema],
      default: [
        { label: "Weddings Captured", value: "180+" },
        { label: "Fashion Campaigns", value: "60+" },
        { label: "Cinematic Films", value: "220+" }
      ]
    },
    ctaText: {
      type: String,
      default: "Book a Story"
    },
    ctaLink: {
      type: String,
      default: "/booking"
    },
    sectionBlocks: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("HomeContent", homeContentSchema);
