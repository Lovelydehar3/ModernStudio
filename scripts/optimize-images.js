const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const TARGETS = [
  { dir: path.join(__dirname, "../client/public/media/images"), quality: 78 },
  { dir: path.join(__dirname, "../client/public/uploads"), quality: 78 }
];

const MAX_WIDTH = 1920;

async function optimizeImage(filePath, quality) {
  const ext = path.extname(filePath).toLowerCase();
  if (![".jpg", ".jpeg", ".png"].includes(ext)) return null;

  const originalSize = fs.statSync(filePath).size;
  const buffer = fs.readFileSync(filePath);

  const image = sharp(buffer);
  const metadata = await image.metadata();

  let pipeline = image;

  // Resize if wider than max
  if (metadata.width > MAX_WIDTH) {
    pipeline = pipeline.resize(MAX_WIDTH, null, { withoutEnlargement: true });
  }

  // Compress based on format
  if (ext === ".png") {
    pipeline = pipeline.png({ quality, compressionLevel: 9 });
  } else {
    pipeline = pipeline.jpeg({ quality, progressive: true, mozjpeg: true });
  }

  const optimized = await pipeline.toBuffer();

  // Only overwrite if smaller
  if (optimized.length < originalSize) {
    fs.writeFileSync(filePath, optimized);
    const saved = ((originalSize - optimized.length) / 1024 / 1024).toFixed(2);
    const pct = ((1 - optimized.length / originalSize) * 100).toFixed(1);
    return { file: path.basename(filePath), original: (originalSize / 1024 / 1024).toFixed(2), optimized: (optimized.length / 1024 / 1024).toFixed(2), saved, pct };
  }

  return { file: path.basename(filePath), original: (originalSize / 1024 / 1024).toFixed(2), optimized: (originalSize / 1024 / 1024).toFixed(2), saved: "0", pct: "0" };
}

async function run() {
  let totalOriginal = 0;
  let totalOptimized = 0;

  for (const target of TARGETS) {
    if (!fs.existsSync(target.dir)) {
      console.log(`Skipping ${target.dir} (not found)`);
      continue;
    }

    const files = fs.readdirSync(target.dir).filter((f) => {
      const ext = path.extname(f).toLowerCase();
      return [".jpg", ".jpeg", ".png"].includes(ext);
    });

    console.log(`\nProcessing ${files.length} files in ${target.dir}...`);

    for (const file of files) {
      const filePath = path.join(target.dir, file);
      const result = await optimizeImage(filePath, target.quality);
      if (result) {
        totalOriginal += parseFloat(result.original);
        totalOptimized += parseFloat(result.optimized);
        console.log(`  ${result.file}: ${result.original} MB -> ${result.optimized} MB (-${result.pct}%)`);
      }
    }
  }

  console.log(`\n=== SUMMARY ===`);
  console.log(`Total original: ${totalOriginal.toFixed(2)} MB`);
  console.log(`Total optimized: ${totalOptimized.toFixed(2)} MB`);
  console.log(`Total saved: ${(totalOriginal - totalOptimized).toFixed(2)} MB (${((1 - totalOptimized / totalOriginal) * 100).toFixed(1)}%)`);
}

run().catch(console.error);
