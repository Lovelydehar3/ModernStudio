// Package definitions — addOns are injected at seed time from the Addon collection
const PACKAGES_SEED = [
  {
    name: "Essential",
    priceDisplay: "₹45,000 onwards",
    startingPrice: 45000,
    description: "Perfect for intimate wedding stories with cinematic quality.",
    features: [
      "1 Photographer + 1 Cinematographer",
      "Full day wedding coverage",
      "Candid + Traditional Photography",
      "3-5 min cinematic film",
      "300+ edited photos",
      "Premium album"
    ],
    sortOrder: 1
  },
  {
    name: "Premium",
    priceDisplay: "₹85,000 onwards",
    startingPrice: 85000,
    description: "Elevated storytelling built for multi-event celebrations.",
    features: [
      "2 Photographers + 2 Cinematographers",
      "Multi-event coverage",
      "Drone shots",
      "Cinematic wedding film",
      "Teaser reel in 48 hrs",
      "Bridal editorial portraits",
      "Premium album"
    ],
    sortOrder: 2
  },
  {
    name: "Luxury",
    priceDisplay: "₹1,50,000 onwards",
    startingPrice: 150000,
    description: "Luxury visual production for destination and premium weddings.",
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
    sortOrder: 3
  }
];

module.exports = PACKAGES_SEED;
