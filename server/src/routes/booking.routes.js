const express = require("express");
const rateLimit = require("express-rate-limit");
const validate = require("../middleware/validate.middleware");
const {
  createBooking,
  listBookings,
  updateBookingStatus,
  getBooking,
  updateBooking,
  deleteBooking
} = require("../controllers/booking.controller");
const {
  bookingCreateSchema,
  bookingStatusUpdateSchema,
  bookingUpdateSchema
} = require("../validators/booking.validator");

const publicBookingRoutes = express.Router();
const adminBookingRoutes = express.Router();

const bookingLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: { success: false, message: "Too many booking requests. Try again later." }
});

publicBookingRoutes.post("/", bookingLimiter, validate(bookingCreateSchema), createBooking);

adminBookingRoutes.get("/", listBookings);
adminBookingRoutes.patch("/:id/status", validate(bookingStatusUpdateSchema), updateBookingStatus);
adminBookingRoutes.get("/:id", getBooking);
adminBookingRoutes.put("/:id", validate(bookingUpdateSchema), updateBooking);
adminBookingRoutes.delete("/:id", deleteBooking);

module.exports = {
  publicBookingRoutes,
  adminBookingRoutes
};
