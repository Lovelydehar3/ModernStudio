const mongoose = require("mongoose");
const streamifier = require("streamifier");
const Media = require("../models/Media");
const { cloudinary, isCloudinaryConfigured } = require("../config/cloudinary");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");

// Helpers

/**
 * Upload a buffer to Cloudinary.
 * @param {Buffer} buffer - file buffer from multer memoryStorage
 * @param {string} resourceType - "image" or "video"
 * @returns {Promise<object>} Cloudinary upload result
 */
const uploadToCloudinary = (buffer, resourceType = "image") =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "modern-wedding-stories",
        resource_type: resourceType,
        use_filename: true,
        unique_filename: true,
        overwrite: false
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });

/**
 * Delete an asset from Cloudinary by public_id.
 * Determines resource_type from the media type field.
 */
const deleteFromCloudinary = async (publicId, mediaType) => {
  if (!publicId) return;
  const resourceType = getCloudinaryResourceType(mediaType);
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (err) {
    console.error(`Cloudinary delete failed for ${publicId}:`, err.message);
  }
};

const getMediaTypeFromFile = (file) =>
  file?.mimetype?.startsWith("video/") ? "video" : "photo";

const getCloudinaryResourceType = (mediaType) => (mediaType === "video" ? "video" : "image");

const uploadFileToCloudinary = async (file, mediaType) => {
  try {
    return await uploadToCloudinary(file.buffer, getCloudinaryResourceType(mediaType));
  } catch (error) {
    throw new ApiError(
      502,
      `Cloudinary upload failed: ${error.message || "check Cloudinary credentials and file settings."}`
    );
  }
};

const parseTags = (tags) => {
  if (!tags) return [];
  const values = Array.isArray(tags) ? tags : String(tags).split(",");
  return values.map((tag) => String(tag).trim()).filter(Boolean);
};

const toBoolean = (value) => value === true || value === "true";

const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

// Public

const listPublicMedia = asyncHandler(async (req, res) => {
  const { category, type, featured, tag } = req.query;
  const query = {};

  if (category) query.category = category;
  if (type) query.type = type;
  if (featured === "true") query.isFeatured = true;
  if (tag) query.tags = tag;

  const media = await Media.find(query).sort({ sortOrder: 1, createdAt: -1 }).lean();
  return ApiResponse.success(res, "Media fetched.", media, 200);
});

// Admin

const listAdminMedia = asyncHandler(async (req, res) => {
  const { category, type, tag } = req.query;
  const query = {};

  if (category) query.category = category;
  if (type) query.type = type;
  if (tag) query.tags = tag;

  const media = await Media.find(query).sort({ sortOrder: 1, createdAt: -1 }).lean();
  return ApiResponse.success(res, "Media fetched.", media, 200);
});

const createMedia = asyncHandler(async (req, res, next) => {
  const { title, type, category, url, thumbnailUrl, altText, alt, tags, isFeatured, sortOrder } =
    req.body;

  let finalType = type || "photo";
  let finalUrl = url || "";
  let finalThumbnailUrl = thumbnailUrl || "";
  let cloudinaryPublicId = "";

  if (req.file) {
    if (!isCloudinaryConfigured()) {
      return next(
        new ApiError(
          400,
          "Cloudinary is not configured. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to server/.env."
        )
      );
    }

    finalType = getMediaTypeFromFile(req.file);
    const result = await uploadFileToCloudinary(req.file, finalType);
    finalUrl = result.secure_url;
    cloudinaryPublicId = result.public_id;

    if (finalType === "photo") {
      finalThumbnailUrl = finalThumbnailUrl || result.secure_url;
    }
  }

  if (!finalUrl) {
    return next(new ApiError(400, "Choose a photo/video file to upload or provide a valid URL."));
  }

  const created = await Media.create({
    title,
    type: finalType,
    category: category || "home",
    url: finalUrl,
    thumbnailUrl: finalThumbnailUrl,
    altText: altText || alt || "",
    alt: altText || alt || "",
    tags: parseTags(tags),
    cloudinaryPublicId,
    isFeatured: toBoolean(isFeatured),
    sortOrder: toNumber(sortOrder)
  });

  return ApiResponse.success(res, "Media created.", created, 201);
});

const updateMedia = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ApiError(400, "Invalid media id."));
  }

  const existing = await Media.findById(id);
  if (!existing) {
    return next(new ApiError(404, "Media not found."));
  }

  const updateData = { ...req.body };
  let oldCloudinaryPublicIdToDelete = "";
  let oldMediaTypeToDelete = "";

  if (req.file) {
    if (!isCloudinaryConfigured()) {
      return next(new ApiError(400, "Cloudinary is not configured."));
    }

    const replacementType = getMediaTypeFromFile(req.file);
    const result = await uploadFileToCloudinary(req.file, replacementType);
    oldCloudinaryPublicIdToDelete = existing.cloudinaryPublicId;
    oldMediaTypeToDelete = existing.type;
    updateData.type = replacementType;
    updateData.url = result.secure_url;
    updateData.cloudinaryPublicId = result.public_id;

    if (replacementType === "photo" && !updateData.thumbnailUrl) {
      updateData.thumbnailUrl = result.secure_url;
    }
  }

  if (updateData.tags !== undefined) {
    updateData.tags = parseTags(updateData.tags);
  }

  if (updateData.altText) updateData.alt = updateData.altText;
  if (updateData.alt && !updateData.altText) updateData.altText = updateData.alt;

  if (updateData.isFeatured !== undefined) {
    updateData.isFeatured = toBoolean(updateData.isFeatured);
  }

  if (updateData.sortOrder !== undefined) {
    updateData.sortOrder = toNumber(updateData.sortOrder);
  }

  const updated = await Media.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true
  }).lean();

  await deleteFromCloudinary(oldCloudinaryPublicIdToDelete, oldMediaTypeToDelete);

  return ApiResponse.success(res, "Media updated.", updated, 200);
});

const deleteMedia = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ApiError(400, "Invalid media id."));
  }

  const deleted = await Media.findByIdAndDelete(id);
  if (!deleted) {
    return next(new ApiError(404, "Media not found."));
  }

  // Cleanup from Cloudinary (supports both image and video)
  await deleteFromCloudinary(deleted.cloudinaryPublicId, deleted.type);

  return ApiResponse.success(res, "Media deleted.", deleted, 200);
});

module.exports = {
  listPublicMedia,
  listAdminMedia,
  createMedia,
  updateMedia,
  deleteMedia
};
