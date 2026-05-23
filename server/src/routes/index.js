const express = require("express");
const authRoutes = require("./auth.routes");
const authMiddleware = require("../middleware/auth.middleware");
const requireAdmin = require("../middleware/requireAdmin.middleware");
const requireUser = require("../middleware/requireUser.middleware");
const { publicPackageRoutes, adminPackageRoutes } = require("./package.routes");
const { publicMediaRoutes, adminMediaRoutes } = require("./media.routes");
const { publicFilmRoutes, adminFilmRoutes } = require("./film.routes");
const { publicHomeRoutes, adminHomeRoutes } = require("./home.routes");
const { publicBookingRoutes, adminBookingRoutes } = require("./booking.routes");
const { publicInquiryRoutes, adminInquiryRoutes } = require("./inquiry.routes");
const { publicAddonRoutes, adminAddonRoutes } = require("./addon.routes");
const adminDashboardRoutes = require("./dashboard.routes");

const apiRouter = express.Router();
const adminGuard = [authMiddleware, requireAdmin];
const userGuard = [authMiddleware, requireUser];

apiRouter.get("/health", (_req, res) => {
  res.status(200).json({ success: true, message: "Modern Wedding Studios API is running." });
});

apiRouter.use("/auth", authRoutes);

apiRouter.use("/home", publicHomeRoutes);
apiRouter.use("/packages", publicPackageRoutes);
apiRouter.use("/media", publicMediaRoutes);
apiRouter.use("/films", publicFilmRoutes);
apiRouter.use("/bookings", userGuard, publicBookingRoutes);
apiRouter.use("/inquiries", publicInquiryRoutes);
apiRouter.use("/addons", publicAddonRoutes);

apiRouter.use("/admin/dashboard", adminGuard, adminDashboardRoutes);
apiRouter.use("/admin/home", adminGuard, adminHomeRoutes);
apiRouter.use("/admin/packages", adminGuard, adminPackageRoutes);
apiRouter.use("/admin/media", adminGuard, adminMediaRoutes);
apiRouter.use("/admin/films", adminGuard, adminFilmRoutes);
apiRouter.use("/admin/bookings", adminGuard, adminBookingRoutes);
apiRouter.use("/admin/inquiries", adminGuard, adminInquiryRoutes);
apiRouter.use("/admin/addons", adminGuard, adminAddonRoutes);

module.exports = apiRouter;
