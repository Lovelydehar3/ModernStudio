const mongoose = require("mongoose");
const Addon = require("../models/Addon");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");

// ─── Public ───────────────────────────────────────────────

const listPublicAddons = asyncHandler(async (_req, res) => {
  const addons = await Addon.find({ isActive: true })
    .sort({ sortOrder: 1, createdAt: -1 })
    .lean();
  return ApiResponse.success(res, "Add-ons fetched.", addons, 200);
});

// ─── Admin ────────────────────────────────────────────────

const listAdminAddons = asyncHandler(async (_req, res) => {
  const addons = await Addon.find().sort({ sortOrder: 1, createdAt: -1 }).lean();
  return ApiResponse.success(res, "Add-ons fetched.", addons, 200);
});

const createAddon = asyncHandler(async (req, res) => {
  const created = await Addon.create(req.body);
  return ApiResponse.success(res, "Add-on created.", created, 201);
});

const updateAddon = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ApiError(400, "Invalid add-on id."));
  }

  const updated = await Addon.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true
  }).lean();

  if (!updated) {
    return next(new ApiError(404, "Add-on not found."));
  }

  return ApiResponse.success(res, "Add-on updated.", updated, 200);
});

const deleteAddon = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ApiError(400, "Invalid add-on id."));
  }

  const deleted = await Addon.findByIdAndDelete(id).lean();
  if (!deleted) {
    return next(new ApiError(404, "Add-on not found."));
  }

  return ApiResponse.success(res, "Add-on deleted.", deleted, 200);
});

module.exports = {
  listPublicAddons,
  listAdminAddons,
  createAddon,
  updateAddon,
  deleteAddon
};
