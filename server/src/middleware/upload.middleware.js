const multer = require("multer");
const path = require("path");

const storage = multer.memoryStorage();
const MAX_UPLOAD_SIZE_MB = 100;

const allowedImageTypes = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/avif"
]);

const allowedVideoTypes = new Set([
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "video/x-msvideo"
]);

const allowedTypes = new Set([...allowedImageTypes, ...allowedVideoTypes]);
const allowedExtensions = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".avif",
  ".mp4",
  ".webm",
  ".mov",
  ".avi"
]);

const createUploadError = (message) => {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
};

const upload = multer({
  storage,
  limits: {
    fileSize: MAX_UPLOAD_SIZE_MB * 1024 * 1024
  },
  fileFilter: (_req, file, cb) => {
    const extension = path.extname(file.originalname || "").toLowerCase();

    if (!allowedTypes.has(file.mimetype) || !allowedExtensions.has(extension)) {
      return cb(
        createUploadError(
          "Only JPG, PNG, WEBP, AVIF images and MP4, WEBM, MOV, AVI videos are allowed."
        )
      );
    }
    cb(null, true);
  }
});

module.exports = upload;
