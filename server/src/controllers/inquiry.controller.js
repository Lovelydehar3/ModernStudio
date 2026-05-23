const mongoose = require("mongoose");
const Inquiry = require("../models/Inquiry");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");

const createInquiry = asyncHandler(async (req, res) => {
  const created = await Inquiry.create(req.body);
  return ApiResponse.success(res, "Inquiry submitted successfully.", created, 201);
});

const listInquiries = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.status === "resolved") filter.isResolved = true;
  if (req.query.status === "unresolved") filter.isResolved = false;

  const inquiries = await Inquiry.find(filter).sort({ createdAt: -1 }).lean();
  return ApiResponse.success(res, "Inquiries fetched.", inquiries, 200);
});

const resolveInquiry = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ApiError(400, "Invalid inquiry id."));
  }

  const payload = {
    isResolved: req.body.isResolved,
    resolvedAt: req.body.isResolved ? new Date() : null,
    resolvedBy: req.body.isResolved ? req.user?.id || null : null
  };

  if (req.body.adminNotes !== undefined) {
    payload.adminNotes = req.body.adminNotes;
  }

  const updated = await Inquiry.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true
  }).lean();

  if (!updated) {
    return next(new ApiError(404, "Inquiry not found."));
  }

  return ApiResponse.success(res, "Inquiry updated.", updated, 200);
});

const deleteInquiry = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ApiError(400, "Invalid inquiry id."));
  }

  const deleted = await Inquiry.findByIdAndDelete(id).lean();
  if (!deleted) {
    return next(new ApiError(404, "Inquiry not found."));
  }

  return ApiResponse.success(res, "Inquiry deleted.", deleted, 200);
});

module.exports = {
  createInquiry,
  listInquiries,
  resolveInquiry,
  deleteInquiry
};
