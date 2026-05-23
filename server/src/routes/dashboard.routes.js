const express = require("express");
const { getDashboardStats } = require("../controllers/dashboard.controller");

const adminDashboardRoutes = express.Router();

adminDashboardRoutes.get("/stats", getDashboardStats);

module.exports = adminDashboardRoutes;
