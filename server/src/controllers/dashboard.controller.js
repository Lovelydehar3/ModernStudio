const Package = require("../models/Package");
const Media = require("../models/Media");
const Film = require("../models/Film");
const Booking = require("../models/Booking");
const Inquiry = require("../models/Inquiry");
const Addon = require("../models/Addon");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");

const getDashboardStats = asyncHandler(async (_req, res) => {
  const [
    totalPackages,
    totalMedia,
    totalFilms,
    totalBookings,
    pendingBookings,
    acceptedBookings,
    rejectedBookings,
    unresolvedInquiries,
    totalAddons,
    recentBookings
  ] = await Promise.all([
    Package.countDocuments(),
    Media.countDocuments(),
    Film.countDocuments(),
    Booking.countDocuments(),
    Booking.countDocuments({ status: "pending" }),
    Booking.countDocuments({ status: "accepted" }),
    Booking.countDocuments({ status: "rejected" }),
    Inquiry.countDocuments({ isResolved: false }),
    Addon.countDocuments(),
    Booking.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name email phone status selectedPackage.name createdAt paymentStatus totalAmount")
      .lean()
  ]);

  return ApiResponse.success(
    res,
    "Dashboard stats fetched.",
    {
      totalPackages,
      totalMedia,
      totalFilms,
      totalBookings,
      pendingBookings,
      acceptedBookings,
      rejectedBookings,
      unresolvedInquiries,
      totalAddons,
      recentBookings
    },
    200
  );
});

module.exports = {
  getDashboardStats
};
