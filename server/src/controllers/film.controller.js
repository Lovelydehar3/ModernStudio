const mongoose = require("mongoose");
const Film = require("../models/Film");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");

const listPublicFilms = asyncHandler(async (_req, res) => {
  const films = await Film.find({ isPublished: true }).sort({ createdAt: -1 }).lean();
  return ApiResponse.success(res, "Films fetched.", films, 200);
});

const listAdminFilms = asyncHandler(async (_req, res) => {
  const films = await Film.find().sort({ createdAt: -1 }).lean();
  return ApiResponse.success(res, "Films fetched.", films, 200);
});

const createFilm = asyncHandler(async (req, res) => {
  const created = await Film.create(req.body);
  return ApiResponse.success(res, "Film created.", created, 201);
});

const updateFilm = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ApiError(400, "Invalid film id."));
  }

  const updated = await Film.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true
  }).lean();

  if (!updated) {
    return next(new ApiError(404, "Film not found."));
  }

  return ApiResponse.success(res, "Film updated.", updated, 200);
});

const deleteFilm = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ApiError(400, "Invalid film id."));
  }

  const deleted = await Film.findByIdAndDelete(id).lean();
  if (!deleted) {
    return next(new ApiError(404, "Film not found."));
  }

  return ApiResponse.success(res, "Film deleted.", deleted, 200);
});

module.exports = {
  listPublicFilms,
  listAdminFilms,
  createFilm,
  updateFilm,
  deleteFilm
};
