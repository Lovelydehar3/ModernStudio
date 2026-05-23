const express = require("express");
const validate = require("../middleware/validate.middleware");
const {
  listPublicFilms,
  listAdminFilms,
  createFilm,
  updateFilm,
  deleteFilm
} = require("../controllers/film.controller");
const { filmCreateSchema, filmUpdateSchema } = require("../validators/film.validator");

const publicFilmRoutes = express.Router();
const adminFilmRoutes = express.Router();

publicFilmRoutes.get("/", listPublicFilms);

adminFilmRoutes.get("/", listAdminFilms);
adminFilmRoutes.post("/", validate(filmCreateSchema), createFilm);
adminFilmRoutes.put("/:id", validate(filmUpdateSchema), updateFilm);
adminFilmRoutes.delete("/:id", deleteFilm);

module.exports = {
  publicFilmRoutes,
  adminFilmRoutes
};
