const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const User = require("../models/User");
const connectDB = require("../config/db");

const resetAdminPassword = async () => {
  try {
    // Connect to database
    await connectDB();
    console.log("✓ Connected to MongoDB");

    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
      console.error("❌ ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env");
      process.exit(1);
    }

    const normalizedEmail = email.toLowerCase();

    // Find or create admin user
    let admin = await User.findOne({ email: normalizedEmail });

    if (!admin) {
      console.log("📝 Admin user not found. Creating new admin...");
      admin = new User({
        name: "Modern Wedding Studios Admin",
        email: normalizedEmail,
        role: "admin",
        isActive: true,
        isEmailVerified: true,
        authProvider: "local",
        passwordHash: "temp"
      });
    } else {
      console.log("🔄 Admin user found. Updating password...");
    }

    // Set the password (this hashes it with bcrypt)
    await admin.setPassword(password);
    await admin.save();

    console.log("✓ Admin password reset successfully!");
    console.log(`Email: ${normalizedEmail}`);
    console.log(`Password: ${password}`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error resetting admin password:", error.message);
    process.exit(1);
  }
};

resetAdminPassword();
