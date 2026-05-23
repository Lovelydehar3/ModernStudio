const app = require("./app");
const env = require("./config/env");
const connectDB = require("./config/db");
const seedDefaults = require("./utils/seedDefaults");

const start = async () => {
  try {
    await connectDB();
    await seedDefaults();

    app.listen(env.port, () => {
      console.log(`Modern Wedding Studios API listening on port ${env.port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

start();
