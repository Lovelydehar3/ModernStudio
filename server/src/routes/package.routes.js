const express = require("express");
const validate = require("../middleware/validate.middleware");
const {
  listPublicPackages,
  listAdminPackages,
  createPackage,
  updatePackage,
  deletePackage
} = require("../controllers/package.controller");
const { packageCreateSchema, packageUpdateSchema } = require("../validators/package.validator");

const publicPackageRoutes = express.Router();
const adminPackageRoutes = express.Router();

publicPackageRoutes.get("/", listPublicPackages);

adminPackageRoutes.get("/", listAdminPackages);
adminPackageRoutes.post("/", validate(packageCreateSchema), createPackage);
adminPackageRoutes.put("/:id", validate(packageUpdateSchema), updatePackage);
adminPackageRoutes.delete("/:id", deletePackage);

module.exports = {
  publicPackageRoutes,
  adminPackageRoutes
};
