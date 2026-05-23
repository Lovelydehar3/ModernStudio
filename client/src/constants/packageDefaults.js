import { addOnDefaults } from "./addOnDefaults";
import { packageThumbnails } from "./mediaLibrary";

export const packageDefaults = [
  {
    name: "Essential",
    priceDisplay: "₹45,000 onwards",
    startingPrice: 45000,
    description: "Perfect for intimate wedding stories with cinematic quality.",
    thumbnail: packageThumbnails.Essential,
    features: [
      "1 Photographer + 1 Cinematographer",
      "Full day wedding coverage",
      "Candid + Traditional Photography",
      "3-5 min cinematic film",
      "300+ edited photos",
      "Premium album"
    ],
    addOns: addOnDefaults
  },
  {
    name: "Premium",
    priceDisplay: "₹85,000 onwards",
    startingPrice: 85000,
    description: "Elevated storytelling built for multi-event celebrations.",
    thumbnail: packageThumbnails.Premium,
    features: [
      "2 Photographers + 2 Cinematographers",
      "Multi-event coverage",
      "Drone shots",
      "Cinematic wedding film",
      "Teaser reel in 48 hrs",
      "Bridal editorial portraits",
      "Premium album"
    ],
    addOns: addOnDefaults
  },
  {
    name: "Luxury",
    priceDisplay: "₹1,50,000 onwards",
    startingPrice: 150000,
    description: "Luxury visual production for destination and premium weddings.",
    thumbnail: packageThumbnails.Luxury,
    features: [
      "Full luxury wedding production",
      "Documentary-style wedding film",
      "Drone + cinematic storytelling",
      "Same-day edit",
      "Couple love story film",
      "Luxury album + premium box",
      "Instagram content coverage",
      "For destination & premium weddings"
    ],
    addOns: addOnDefaults
  }
];
