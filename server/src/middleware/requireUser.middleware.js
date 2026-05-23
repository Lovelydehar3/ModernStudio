const ApiError = require("../utils/ApiError");

const requireUser = (req, _res, next) => {
  if (!req.user || !["user", "admin"].includes(req.user.role)) {
    return next(new ApiError(403, "User access required."));
  }
  return next();
};

module.exports = requireUser;
