const express = require("express");
const validate = require("../middleware/validate.middleware");
const { getHomeContent, updateHomeContent } = require("../controllers/home.controller");
const { homeUpdateSchema } = require("../validators/home.validator");

const publicHomeRoutes = express.Router();
const adminHomeRoutes = express.Router();

publicHomeRoutes.get("/", getHomeContent);

adminHomeRoutes.get("/", getHomeContent);
adminHomeRoutes.put("/", validate(homeUpdateSchema), updateHomeContent);

module.exports = {
  publicHomeRoutes,
  adminHomeRoutes
};
