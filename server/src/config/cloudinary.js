const cloudinary = require("cloudinary").v2;
const env = require("./env");

cloudinary.config({
  cloud_name: env.cloudinaryCloudName,
  api_key: env.cloudinaryApiKey,
  api_secret: env.cloudinaryApiSecret
});

/**
 * Returns true only when all three Cloudinary credentials are present
 * and are not placeholder values.
 */
const isCloudinaryConfigured = () => {
  const values = [
    env.cloudinaryCloudName,
    env.cloudinaryApiKey,
    env.cloudinaryApiSecret
  ];

  if (values.some((v) => !v)) return false;

  const joined = values.join(" ").toLowerCase();
  return (
    !joined.includes("your-cloud-name") &&
    !joined.includes("your-api-key") &&
    !joined.includes("your-api-secret")
  );
};

module.exports = { cloudinary, isCloudinaryConfigured };
