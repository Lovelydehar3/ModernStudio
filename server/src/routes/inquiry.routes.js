const express = require("express");
const rateLimit = require("express-rate-limit");
const validate = require("../middleware/validate.middleware");
const {
  createInquiry,
  listInquiries,
  resolveInquiry,
  deleteInquiry
} = require("../controllers/inquiry.controller");
const { inquiryCreateSchema, inquiryResolveSchema } = require("../validators/inquiry.validator");

const publicInquiryRoutes = express.Router();
const adminInquiryRoutes = express.Router();

const inquiryLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: { success: false, message: "Too many inquiry requests. Try again later." }
});

publicInquiryRoutes.post("/", inquiryLimiter, validate(inquiryCreateSchema), createInquiry);

adminInquiryRoutes.get("/", listInquiries);
adminInquiryRoutes.patch("/:id/resolve", validate(inquiryResolveSchema), resolveInquiry);
adminInquiryRoutes.delete("/:id", deleteInquiry);

module.exports = {
  publicInquiryRoutes,
  adminInquiryRoutes
};
