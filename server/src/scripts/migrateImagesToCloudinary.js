/**
 * Migration script: uploads all local images to Cloudinary.
 * Run: node server/src/scripts/migrateImagesToCloudinary.js
 *
 * Reads images from client/public/media/images/ and client/public/uploads/,
 * uploads each to Cloudinary, and saves the URL mapping to a JSON file.
 */

const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");

dotenv.config({ path: path.join(__dirname, "../../.env") });

const { cloudinary, isCloudinaryConfigured } = require("../config/cloudinary");

const IMAGES_DIR = path.join(__dirname, "../../../client/public/media/images");
const UPLOADS_DIR = path.join(__dirname, "../../../client/public/uploads");
const OUTPUT_FILE = path.join(__dirname, "cloudinary-image-urls.json");

async function uploadImage(filePath, folder) {
  const filename = path.basename(filePath);
  const publicId = path.parse(filename).name;

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      filePath,
      {
        folder: `modern-wedding-stories/${folder}`,
        public_id: publicId,
        resource_type: "image",
        use_filename: true,
        unique_filename: false,
        overwrite: true
      },
      (error, result) => {
        if (error) return reject(error);
        resolve({
          localPath: filePath,
          secure_url: result.secure_url,
          public_id: result.public_id,
          bytes: result.bytes
        });
      }
    );
  });
}

async function migrate() {
  if (!isCloudinaryConfigured()) {
    console.error(
      "ERROR: Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in server/.env"
    );
    process.exit(1);
  }

  const results = {};

  // Upload images from client/public/media/images/
  console.log("\n=== Uploading media/images/ ===\n");
  if (fs.existsSync(IMAGES_DIR)) {
    const files = fs.readdirSync(IMAGES_DIR).filter((f) => /\.(jpe?g|png|webp|avif)$/i.test(f));
    for (const file of files) {
      const filePath = path.join(IMAGES_DIR, file);
      try {
        console.log(`Uploading: ${file}...`);
        const result = await uploadImage(filePath, "images");
        results[`/media/images/${file}`] = result;
        console.log(`  -> ${result.secure_url}`);
      } catch (err) {
        console.error(`  FAILED: ${err.message}`);
      }
    }
  } else {
    console.log("No media/images/ directory found, skipping.");
  }

  // Upload images from client/public/uploads/
  console.log("\n=== Uploading uploads/ ===\n");
  if (fs.existsSync(UPLOADS_DIR)) {
    const files = fs.readdirSync(UPLOADS_DIR).filter((f) => /\.(jpe?g|png|webp|avif)$/i.test(f));
    for (const file of files) {
      const filePath = path.join(UPLOADS_DIR, file);
      try {
        console.log(`Uploading: ${file}...`);
        const result = await uploadImage(filePath, "uploads");
        results[`/uploads/${file}`] = result;
        console.log(`  -> ${result.secure_url}`);
      } catch (err) {
        console.error(`  FAILED: ${err.message}`);
      }
    }
  } else {
    console.log("No uploads/ directory found, skipping.");
  }

  // Save results
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(results, null, 2));
  console.log(`\n=== Done! Results saved to ${OUTPUT_FILE} ===`);
  console.log(`Total uploaded: ${Object.keys(results).length} images`);
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
