const mongoose = require("mongoose");
const Package = require("../models/Package");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");

const listPublicPackages = asyncHandler(async (_req, res) => {
  const packages = await Package.find({ isActive: true })
    .populate("addOns")
    .sort({ sortOrder: 1, startingPrice: 1 })
    .lean();

  return ApiResponse.success(res, "Packages fetched.", packages, 200);
});

const listAdminPackages = asyncHandler(async (_req, res) => {
  const packages = await Package.find()
    .populate("addOns")
    .sort({ sortOrder: 1, startingPrice: 1 })
    .lean();
  return ApiResponse.success(res, "Packages fetched.", packages, 200);
});

const createPackage = asyncHandler(async (req, res) => {
  const created = await Package.create(req.body);
  const populated = await Package.findById(created._id).populate("addOns").lean();
  return ApiResponse.success(res, "Package created.", populated, 201);
});

const updatePackage = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ApiError(400, "Invalid package id."));
  }

  const updated = await Package.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true
  })
    .populate("addOns")
    .lean();

  if (!updated) {
    return next(new ApiError(404, "Package not found."));
  }

  return ApiResponse.success(res, "Package updated.", updated, 200);
});

const deletePackage = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ApiError(400, "Invalid package id."));
  }

  const deleted = await Package.findByIdAndDelete(id).lean();
  if (!deleted) {
    return next(new ApiError(404, "Package not found."));
  }

  return ApiResponse.success(res, "Package deleted.", deleted, 200);
});

module.exports = {
  listPublicPackages,
  listAdminPackages,
  createPackage,
  updatePackage,
  deletePackage
};
