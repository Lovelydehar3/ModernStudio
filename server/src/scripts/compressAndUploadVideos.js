/**
 * Script: compress videos and upload to Cloudinary.
 * Run: node server/src/scripts/compressAndUploadVideos.js
 *
 * Compresses videos to a max 1280px edge without changing aspect ratio.
 * Uploads to Cloudinary and saves URL mapping.
 */

const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");

dotenv.config({ path: path.join(__dirname, "../../.env") });

const ffmpegPath = require("ffmpeg-static");
const ffmpeg = require("fluent-ffmpeg");
const { cloudinary, isCloudinaryConfigured } = require("../config/cloudinary");

ffmpeg.setFfmpegPath(ffmpegPath);

const DEFAULT_VIDEO_DIRS = [
  path.join(__dirname, "../../../Modern Studio Galary"),
  path.join(__dirname, "../../media/videos"),
  path.join(__dirname, "../../../server/media/videos")
];
const VIDEOS_DIR = process.env.VIDEO_SOURCE_DIR
  ? path.resolve(process.env.VIDEO_SOURCE_DIR)
  : DEFAULT_VIDEO_DIRS.find((dir) => fs.existsSync(dir)) || DEFAULT_VIDEO_DIRS[0];
const COMPRESSED_DIR = path.join(__dirname, "../../../server/media/compressed");
const OUTPUT_FILE = path.join(__dirname, "cloudinary-video-urls.json");

const PUBLIC_ID_MAP = {
  "01_1.mp4": "wedding-01",
  "Sequence 01_1.mp4": "sequence-01",
  "Song1 (1).mp4": "song-01"
};

// Target: max 1280px on the longest edge, preserving portrait/landscape ratio.
const COMPRESSION_PRESETS = {
  // Large files (>100MB) - very aggressive compression
  large: {
    maxEdge: 1280,
    videoBitrate: "600k",
    audioBitrate: "96k",
    crf: 28
  },
  // Medium files (10-100MB) - moderate compression
  medium: {
    maxEdge: 1280,
    videoBitrate: "800k",
    audioBitrate: "128k",
    crf: 26
  },
  // Small files (<10MB) - light compression
  small: {
    maxEdge: 1280,
    videoBitrate: "1000k",
    audioBitrate: "128k",
    crf: 24
  }
};

function getPreset(filePath) {
  const stats = fs.statSync(filePath);
  const sizeMB = stats.size / (1024 * 1024);
  if (sizeMB > 100) return COMPRESSION_PRESETS.large;
  if (sizeMB > 10) return COMPRESSION_PRESETS.medium;
  return COMPRESSION_PRESETS.small;
}

function compressVideo(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    const preset = getPreset(inputPath);
    const inputSize = (fs.statSync(inputPath).size / (1024 * 1024)).toFixed(1);
    const scaleFilter =
      `scale=w='if(gte(iw,ih),min(${preset.maxEdge},iw),-2)'` +
      `:h='if(gte(iw,ih),-2,min(${preset.maxEdge},ih))':flags=lanczos,format=yuv420p`;

    console.log(
      `  Compressing (${inputSize}MB) -> max ${preset.maxEdge}px edge, ` +
      `${preset.videoBitrate} video, ${preset.audioBitrate} audio...`
    );

    ffmpeg(inputPath)
      .outputOptions([
        `-vf ${scaleFilter}`,
        `-b:v ${preset.videoBitrate}`,
        `-b:a ${preset.audioBitrate}`,
        `-crf ${preset.crf}`,
        "-preset fast",
        "-movflags +faststart",
        "-c:v libx264",
        "-c:a aac",
        "-y"
      ])
      .output(outputPath)
      .on("end", () => {
        const outputSize = (fs.statSync(outputPath).size / (1024 * 1024)).toFixed(1);
        console.log(`  Done: ${outputSize}MB`);
        resolve(outputPath);
      })
      .on("error", (err) => {
        console.error(`  Compression failed: ${err.message}`);
        reject(err);
      })
      .run();
  });
}

function uploadToCloudinary(filePath, publicId) {
  return new Promise((resolve, reject) => {
    console.log(`  Uploading to Cloudinary...`);
    cloudinary.uploader.upload(
      filePath,
      {
        folder: "modern-wedding-stories/videos",
        public_id: publicId,
        resource_type: "video",
        use_filename: true,
        unique_filename: false,
        overwrite: true
      },
      (error, result) => {
        if (error) return reject(error);
        console.log(`  Uploaded: ${result.secure_url}`);
        resolve({
          secure_url: result.secure_url,
          public_id: result.public_id,
          bytes: result.bytes,
          duration: result.duration
        });
      }
    );
  });
}

async function processVideo(filename) {
  const inputPath = path.join(VIDEOS_DIR, filename);
  const name = path.parse(filename).name;
  const publicId = PUBLIC_ID_MAP[filename] || name.replace(/[^\w-]+/g, "-").replace(/^-+|-+$/g, "").toLowerCase();
  const outputPath = path.join(COMPRESSED_DIR, `${publicId}.mp4`);

  console.log(`\n=== ${filename} ===`);

  // Compress
  await compressVideo(inputPath, outputPath);

  // Upload
  const result = await uploadToCloudinary(outputPath, publicId);

  return {
    originalFile: filename,
    localPath: `/media/videos/${publicId}.mp4`,
    ...result
  };
}

async function main() {
  if (!isCloudinaryConfigured()) {
    console.error("ERROR: Cloudinary not configured. Check server/.env");
    process.exit(1);
  }

  // Create compressed directory
  if (!fs.existsSync(COMPRESSED_DIR)) {
    fs.mkdirSync(COMPRESSED_DIR, { recursive: true });
  }

  const files = fs.readdirSync(VIDEOS_DIR).filter(f => /\.mp4$/i.test(f));
  console.log(`Found ${files.length} videos to process.\n`);

  const results = fs.existsSync(OUTPUT_FILE)
    ? JSON.parse(fs.readFileSync(OUTPUT_FILE, "utf8"))
    : {};

  for (const file of files) {
    try {
      const result = await processVideo(file);
      results[result.localPath] = result;
    } catch (err) {
      console.error(`FAILED for ${file}: ${err.message}`);
    }
  }

  // Save results
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(results, null, 2));
  console.log(`\n=== Done! Results saved to ${OUTPUT_FILE} ===`);
  console.log(`Total uploaded: ${Object.keys(results).length} videos`);

  // Clean up compressed files
  console.log("\nCleaning up compressed files...");
  fs.rmSync(COMPRESSED_DIR, { recursive: true, force: true });
  console.log("Done.");
}

main().catch((err) => {
  console.error("Script failed:", err);
  process.exit(1);
});
