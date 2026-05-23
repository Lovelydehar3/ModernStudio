/**
 * Seed script: creates Media documents with Cloudinary URLs.
 * Run: node server/src/scripts/seedMedia.js
 */

const mongoose = require("mongoose");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.join(__dirname, "../../.env") });

const Media = require("../models/Media");

const MEDIA_FILES = [
  // ── Wedding Photos (10) ──
  { title: "Wedding Portrait 01", type: "photo", category: "weddings", url: "https://res.cloudinary.com/dkaiwzkxz/image/upload/v1779209749/modern-wedding-stories/images/photo-01.jpg", cloudinaryPublicId: "modern-wedding-stories/images/photo-01", isFeatured: true, sortOrder: 1, tags: ["wedding", "portrait"] },
  { title: "Wedding Portrait 02", type: "photo", category: "weddings", url: "https://res.cloudinary.com/dkaiwzkxz/image/upload/v1779209752/modern-wedding-stories/images/photo-02.jpg", cloudinaryPublicId: "modern-wedding-stories/images/photo-02", sortOrder: 2, tags: ["wedding"] },
  { title: "Wedding Portrait 03", type: "photo", category: "weddings", url: "https://res.cloudinary.com/dkaiwzkxz/image/upload/v1779209761/modern-wedding-stories/images/photo-03.jpg", cloudinaryPublicId: "modern-wedding-stories/images/photo-03", sortOrder: 3, tags: ["wedding"] },
  { title: "Wedding Portrait 04", type: "photo", category: "weddings", url: "https://res.cloudinary.com/dkaiwzkxz/image/upload/v1779209763/modern-wedding-stories/images/photo-04.jpg", cloudinaryPublicId: "modern-wedding-stories/images/photo-04", sortOrder: 4, tags: ["wedding"] },
  { title: "Wedding Portrait 05", type: "photo", category: "weddings", url: "https://res.cloudinary.com/dkaiwzkxz/image/upload/v1779209765/modern-wedding-stories/images/photo-05.jpg", cloudinaryPublicId: "modern-wedding-stories/images/photo-05", sortOrder: 5, tags: ["wedding"] },
  { title: "Wedding Portrait 06", type: "photo", category: "weddings", url: "https://res.cloudinary.com/dkaiwzkxz/image/upload/v1779209766/modern-wedding-stories/images/photo-06.jpg", cloudinaryPublicId: "modern-wedding-stories/images/photo-06", sortOrder: 6, tags: ["wedding"] },
  { title: "Wedding Portrait 07", type: "photo", category: "weddings", url: "https://res.cloudinary.com/dkaiwzkxz/image/upload/v1779209769/modern-wedding-stories/images/photo-07.jpg", cloudinaryPublicId: "modern-wedding-stories/images/photo-07", sortOrder: 7, tags: ["wedding"] },
  { title: "Wedding Portrait 08", type: "photo", category: "weddings", url: "https://res.cloudinary.com/dkaiwzkxz/image/upload/v1779209771/modern-wedding-stories/images/photo-08.jpg", cloudinaryPublicId: "modern-wedding-stories/images/photo-08", sortOrder: 8, tags: ["wedding"] },
  { title: "Wedding Portrait 09", type: "photo", category: "weddings", url: "https://res.cloudinary.com/dkaiwzkxz/image/upload/v1779209774/modern-wedding-stories/images/photo-09.jpg", cloudinaryPublicId: "modern-wedding-stories/images/photo-09", sortOrder: 9, tags: ["wedding"] },
  { title: "Wedding Portrait 10", type: "photo", category: "weddings", url: "https://res.cloudinary.com/dkaiwzkxz/image/upload/v1779209776/modern-wedding-stories/images/photo-10.jpg", cloudinaryPublicId: "modern-wedding-stories/images/photo-10", isFeatured: true, sortOrder: 10, tags: ["wedding", "featured"] },

  // ── Wedding/Bridal Photos (3) ──
  { title: "Bridal Portrait 01", type: "photo", category: "weddings", url: "https://res.cloudinary.com/dkaiwzkxz/image/upload/v1779209779/modern-wedding-stories/images/photo-11.jpg", cloudinaryPublicId: "modern-wedding-stories/images/photo-11", sortOrder: 11, tags: ["bridal", "portrait"] },
  { title: "Bridal Portrait 02", type: "photo", category: "weddings", url: "https://res.cloudinary.com/dkaiwzkxz/image/upload/v1779209781/modern-wedding-stories/images/photo-12.jpg", cloudinaryPublicId: "modern-wedding-stories/images/photo-12", sortOrder: 12, tags: ["bridal"] },
  { title: "Bridal Portrait 03", type: "photo", category: "weddings", url: "https://res.cloudinary.com/dkaiwzkxz/image/upload/v1779209783/modern-wedding-stories/images/photo-13.jpg", cloudinaryPublicId: "modern-wedding-stories/images/photo-13", sortOrder: 13, tags: ["bridal"] },

  // ── Fashion/Model Photos (6) ──
  { title: "Model Portfolio 01", type: "photo", category: "fashion", url: "https://res.cloudinary.com/dkaiwzkxz/image/upload/v1779209784/modern-wedding-stories/images/photo-14.jpg", cloudinaryPublicId: "modern-wedding-stories/images/photo-14", isFeatured: true, sortOrder: 14, tags: ["model", "portfolio"] },
  { title: "Model Portfolio 02", type: "photo", category: "fashion", url: "https://res.cloudinary.com/dkaiwzkxz/image/upload/v1779209786/modern-wedding-stories/images/photo-15.jpg", cloudinaryPublicId: "modern-wedding-stories/images/photo-15", sortOrder: 15, tags: ["model"] },
  { title: "Model Portfolio 03", type: "photo", category: "fashion", url: "https://res.cloudinary.com/dkaiwzkxz/image/upload/v1779209788/modern-wedding-stories/images/photo-16.jpg", cloudinaryPublicId: "modern-wedding-stories/images/photo-16", sortOrder: 16, tags: ["model"] },
  { title: "Fashion Portrait 01", type: "photo", category: "fashion", url: "https://res.cloudinary.com/dkaiwzkxz/image/upload/v1779209789/modern-wedding-stories/images/photo-17.jpg", cloudinaryPublicId: "modern-wedding-stories/images/photo-17", sortOrder: 17, tags: ["fashion"] },
  { title: "Fashion Portrait 02", type: "photo", category: "fashion", url: "https://res.cloudinary.com/dkaiwzkxz/image/upload/v1779209791/modern-wedding-stories/images/photo-18.jpg", cloudinaryPublicId: "modern-wedding-stories/images/photo-18", sortOrder: 18, tags: ["fashion"] },
  { title: "Fashion Portrait 03", type: "photo", category: "fashion", url: "https://res.cloudinary.com/dkaiwzkxz/image/upload/v1779209793/modern-wedding-stories/images/photo-19.jpg", cloudinaryPublicId: "modern-wedding-stories/images/photo-19", sortOrder: 19, tags: ["fashion"] },

  // ── Videos (6) ──
  { title: "Wedding Film 01", type: "video", category: "films", url: "https://res.cloudinary.com/dkaiwzkxz/video/upload/v1779214406/modern-wedding-stories/videos/film-01.mp4", cloudinaryPublicId: "modern-wedding-stories/videos/film-01", isFeatured: true, sortOrder: 20, tags: ["wedding", "film"] },
  { title: "Wedding Film 02", type: "video", category: "films", url: "https://res.cloudinary.com/dkaiwzkxz/video/upload/v1779214494/modern-wedding-stories/videos/film-02.mp4", cloudinaryPublicId: "modern-wedding-stories/videos/film-02", sortOrder: 21, tags: ["wedding", "film"] },
  { title: "Wedding Reel 01", type: "video", category: "films", url: "https://res.cloudinary.com/dkaiwzkxz/video/upload/v1779214517/modern-wedding-stories/videos/ref-01.mp4", cloudinaryPublicId: "modern-wedding-stories/videos/ref-01", sortOrder: 22, tags: ["wedding", "reel"] },
  { title: "Wedding Coverage 01", type: "video", category: "films", url: "https://res.cloudinary.com/dkaiwzkxz/video/upload/v1779248579/modern-wedding-stories/videos/wedding-01.mp4", cloudinaryPublicId: "modern-wedding-stories/videos/wedding-01", sortOrder: 23, tags: ["wedding", "coverage"] },
  { title: "Wedding Sequence 01", type: "video", category: "films", url: "https://res.cloudinary.com/dkaiwzkxz/video/upload/v1779248653/modern-wedding-stories/videos/sequence-01.mp4", cloudinaryPublicId: "modern-wedding-stories/videos/sequence-01", sortOrder: 24, tags: ["wedding", "sequence"] },
  { title: "Wedding Song Edit 01", type: "video", category: "films", url: "https://res.cloudinary.com/dkaiwzkxz/video/upload/v1779248755/modern-wedding-stories/videos/song-01.mp4", cloudinaryPublicId: "modern-wedding-stories/videos/song-01", isFeatured: true, sortOrder: 25, tags: ["wedding", "song", "highlight"] }
];

async function seedMedia() {
  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || "";
  if (!mongoUri) {
    console.error("ERROR: MONGO_URI not found in environment. Check server/.env");
    process.exit(1);
  }

  console.log("Connecting to MongoDB...");
  await mongoose.connect(mongoUri);
  console.log("Connected.");

  const count = await Media.countDocuments();
  if (count > 0) {
    console.log(`Media collection already has ${count} documents. Skipping seed.`);
    console.log("To re-seed, drop the Media collection first: db.media.drop()");
    await mongoose.disconnect();
    process.exit(0);
  }

  const created = await Media.insertMany(MEDIA_FILES);
  console.log(`\nSeeded ${created.length} media documents:`);

  const photos = created.filter((m) => m.type === "photo");
  const videos = created.filter((m) => m.type === "video");
  console.log(`  - ${photos.length} photos`);
  console.log(`  - ${videos.length} videos`);

  const categories = {};
  created.forEach((m) => {
    categories[m.category] = (categories[m.category] || 0) + 1;
  });
  Object.entries(categories).forEach(([cat, n]) => {
    console.log(`  - ${cat}: ${n}`);
  });

  console.log("\nDone! Media items will now appear in the admin panel.");
  await mongoose.disconnect();
  process.exit(0);
}

seedMedia().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
