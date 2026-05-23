const mongoose = require("mongoose");
const env = require("./env");

const connectDB = async () => {
  if (!env.mongoUri) {
    throw new Error("MONGO_URI is missing. Set it in your environment variables.");
  }

  await mongoose.connect(env.mongoUri);
  console.log("MongoDB connected successfully.");
};

module.exports = connectDB;
