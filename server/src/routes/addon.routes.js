const express = require("express");
const validate = require("../middleware/validate.middleware");
const { addonCreateSchema, addonUpdateSchema } = require("../validators/addon.validator");
const {
  listPublicAddons,
  listAdminAddons,
  createAddon,
  updateAddon,
  deleteAddon
} = require("../controllers/addon.controller");

const publicAddonRoutes = express.Router();
const adminAddonRoutes = express.Router();

// Public
publicAddonRoutes.get("/", listPublicAddons);

// Admin CRUD
adminAddonRoutes.get("/", listAdminAddons);
adminAddonRoutes.post("/", validate(addonCreateSchema), createAddon);
adminAddonRoutes.put("/:id", validate(addonUpdateSchema), updateAddon);
adminAddonRoutes.delete("/:id", deleteAddon);

module.exports = { publicAddonRoutes, adminAddonRoutes };
