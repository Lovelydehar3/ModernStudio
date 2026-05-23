const HomeContent = require("../models/HomeContent");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");

const getHomeContent = asyncHandler(async (_req, res) => {
  let content = await HomeContent.findOne({ singletonKey: "main" }).lean();

  if (!content) {
    content = await HomeContent.create({ singletonKey: "main" });
    content = content.toObject();
  }

  return ApiResponse.success(res, "Home content fetched.", content, 200);
});

const updateHomeContent = asyncHandler(async (req, res) => {
  const updated = await HomeContent.findOneAndUpdate(
    { singletonKey: "main" },
    { $set: req.body },
    { new: true, upsert: true, runValidators: true }
  ).lean();

  return ApiResponse.success(res, "Home content updated.", updated, 200);
});

module.exports = {
  getHomeContent,
  updateHomeContent
};
