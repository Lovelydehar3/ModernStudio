const express = require("express");
const upload = require("../middleware/upload.middleware");
const validate = require("../middleware/validate.middleware");
const { mediaCreateSchema, mediaUpdateSchema } = require("../validators/media.validator");
const {
  listPublicMedia,
  listAdminMedia,
  createMedia,
  updateMedia,
  deleteMedia
} = require("../controllers/media.controller");

const publicMediaRoutes = express.Router();
const adminMediaRoutes = express.Router();

// Public
publicMediaRoutes.get("/", listPublicMedia);

// Admin CRUD — file upload via multer memoryStorage, then Zod validation
adminMediaRoutes.get("/", listAdminMedia);
adminMediaRoutes.post("/", upload.single("file"), validate(mediaCreateSchema), createMedia);
adminMediaRoutes.put("/:id", upload.single("file"), validate(mediaUpdateSchema), updateMedia);
adminMediaRoutes.delete("/:id", deleteMedia);

module.exports = { publicMediaRoutes, adminMediaRoutes };
