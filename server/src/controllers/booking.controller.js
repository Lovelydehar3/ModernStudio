const mongoose = require("mongoose");
const Booking = require("../models/Booking");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");
const { sendBookingConfirmationEmail, sendAdminBookingNotification } = require("../utils/email");

const createBooking = asyncHandler(async (req, res, next) => {
  const { eventDate, days = 1 } = req.body;

  // Double-booking prevention: check for overlapping dates with pending/accepted bookings
  if (eventDate) {
    const newStart = new Date(eventDate);
    newStart.setHours(0, 0, 0, 0);
    const newEnd = new Date(newStart);
    newEnd.setDate(newEnd.getDate() + Number(days) - 1);
    newEnd.setHours(23, 59, 59, 999);

    // Indexed query: only fetch bookings overlapping the requested range
    const candidates = await Booking.find({
      status: { $in: ["pending", "accepted"] },
      eventDate: { $gte: new Date(newStart.getTime() - (30 * 24 * 60 * 60 * 1000)), $lte: newEnd }
    }).select("eventDate days").lean();

    const conflict = candidates.find((b) => {
      const existingStart = new Date(b.eventDate);
      existingStart.setHours(0, 0, 0, 0);
      const existingEnd = new Date(existingStart);
      existingEnd.setDate(existingEnd.getDate() + (b.days || 1) - 1);
      existingEnd.setHours(23, 59, 59, 999);
      return existingStart <= newEnd && existingEnd >= newStart;
    });

    if (conflict) {
      return next(
        new ApiError(
          409,
          "This date is already booked. Please choose a different date or contact us directly."
        )
      );
    }
  }

  const booking = await Booking.create({
    ...req.body,
    user: req.user?.id || null,
    status: "pending",
    statusHistory: [{ status: "pending", note: "Booking submitted." }]
  });

  // Fire-and-forget emails — don't block the response
  sendBookingConfirmationEmail(booking.email, booking.toObject()).catch((err) =>
    console.error("[Email] Booking confirmation failed:", err.message)
  );
  sendAdminBookingNotification(booking.toObject()).catch((err) =>
    console.error("[Email] Admin notification failed:", err.message)
  );

  return ApiResponse.success(
    res,
    "Booking submitted successfully. Our team will contact you shortly.",
    booking,
    201
  );
});

const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const listBookings = asyncHandler(async (req, res) => {
  const { status, search, page = 1, limit = 20 } = req.query;
  const query = {};
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
  const skip = (pageNum - 1) * limitNum;

  if (status && ["pending", "accepted", "rejected"].includes(status)) {
    query.status = status;
  }
  if (search) {
    const escaped = escapeRegex(search.trim());
    query.$or = [
      { name: { $regex: escaped, $options: "i" } },
      { email: { $regex: escaped, $options: "i" } },
      { phone: { $regex: escaped, $options: "i" } }
    ];
  }

  const [bookings, total] = await Promise.all([
    Booking.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean(),
    Booking.countDocuments(query)
  ]);

  return ApiResponse.success(res, "Bookings fetched.", {
    bookings,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
      hasNextPage: pageNum < Math.ceil(total / limitNum),
      hasPrevPage: pageNum > 1
    }
  }, 200);
});

const updateBookingStatus = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ApiError(400, "Invalid booking id."));
  }

  const { status, note } = req.body;
  const booking = await Booking.findById(id);
  if (!booking) {
    return next(new ApiError(404, "Booking not found."));
  }

  booking.status = status;
  booking.statusHistory.push({
    status,
    note: (note || "").trim(),
    changedBy: req.user?.id || null,
    changedAt: new Date()
  });

  await booking.save();

  return ApiResponse.success(res, "Booking status updated.", booking, 200);
});

const getBooking = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ApiError(400, "Invalid booking id."));
  }

  const booking = await Booking.findById(id).lean();
  if (!booking) {
    return next(new ApiError(404, "Booking not found."));
  }

  return ApiResponse.success(res, "Booking fetched.", booking, 200);
});

const updateBooking = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ApiError(400, "Invalid booking id."));
  }

  const booking = await Booking.findById(id);
  if (!booking) {
    return next(new ApiError(404, "Booking not found."));
  }

  const allowedFields = [
    "name", "email", "phone", "eventType",
    "eventDate", "eventLocation", "days",
    "message", "selectedPackage", "addOns"
  ];
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      booking[field] = req.body[field];
    }
  });

  await booking.save();

  return ApiResponse.success(res, "Booking updated successfully.", booking, 200);
});

const deleteBooking = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ApiError(400, "Invalid booking id."));
  }

  const booking = await Booking.findByIdAndDelete(id);
  if (!booking) {
    return next(new ApiError(404, "Booking not found."));
  }

  return ApiResponse.success(res, "Booking deleted successfully.", null, 200);
});

module.exports = {
  createBooking,
  listBookings,
  updateBookingStatus,
  getBooking,
  updateBooking,
  deleteBooking
};
