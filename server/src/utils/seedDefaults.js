const Package = require("../models/Package");
const Addon = require("../models/Addon");
const HomeContent = require("../models/HomeContent");
const User = require("../models/User");
const ADDONS_SEED = require("../constants/addons.seed");
const PACKAGES_SEED = require("../constants/packages.seed");

const ensureAddons = async () => {
  const count = await Addon.countDocuments();
  if (count === 0) {
    const created = await Addon.insertMany(
      ADDONS_SEED.map((addon, i) => ({
        ...addon,
        sortOrder: i + 1
      }))
    );
    console.log(`Seeded ${created.length} default add-ons.`);
    return created;
  }
  return Addon.find().lean();
};

const ensurePackages = async (addonDocs) => {
  const count = await Package.countDocuments();
  if (count === 0) {
    // All packages reference all add-ons by default
    const addonIds = addonDocs.map((a) => a._id);
    const packagesWithRefs = PACKAGES_SEED.map((pkg) => ({
      ...pkg,
      addOns: addonIds
    }));
    await Package.insertMany(packagesWithRefs);
    console.log("Seeded default packages with add-on references.");
  }
};

const ensureHomeContent = async () => {
  const existing = await HomeContent.findOne({ singletonKey: "main" });
  if (!existing) {
    await HomeContent.create({ singletonKey: "main" });
    console.log("Seeded default home content.");
  }
};

const ensureAdmin = async () => {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.warn("ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env. Skipping admin seed.");
    return;
  }

  const normalizedEmail = email.toLowerCase();

  let admin = await User.findOne({ email: normalizedEmail });
  if (!admin) {
    admin = new User({
      name: "Modern Wedding Studios Admin",
      email: normalizedEmail,
      role: "admin",
      isActive: true,
      isEmailVerified: true,
      authProvider: "local",
      passwordHash: "temp"
    });
    await admin.setPassword(password);
    await admin.save();
    console.log(`Seeded default admin: ${normalizedEmail}`);
  } else if (process.env.ADMIN_PASSWORD) {
    admin.isEmailVerified = true;
    admin.authProvider = admin.authProvider || "local";
    await admin.setPassword(password);
    await admin.save();
    console.log(`Synced admin password from env: ${normalizedEmail}`);
  }
};

const seedDefaults = async () => {
  const addonDocs = await ensureAddons();
  await ensurePackages(addonDocs);
  await ensureHomeContent();
  await ensureAdmin();
};

module.exports = seedDefaults;
