const CLOUDINARY_HOST = "res.cloudinary.com";

const insertCloudinaryTransform = (url, resourceType, transforms) => {
  if (typeof url !== "string" || !url.includes(CLOUDINARY_HOST)) return url;

  const marker = `/${resourceType}/upload/`;
  const markerIndex = url.indexOf(marker);
  if (markerIndex === -1) return url;

  const transform = transforms.filter(Boolean).join(",");
  if (!transform) return url;

  const insertAt = markerIndex + marker.length;
  const afterUpload = url.slice(insertAt);
  if (afterUpload.startsWith(`${transform}/`)) return url;

  return `${url.slice(0, insertAt)}${transform}/${afterUpload}`;
};

export const optimizeCloudinaryImage = (
  url,
  { width, height, crop = "fill", gravity = "auto", quality = "auto:good" } = {}
) => {
  const transforms = [
    "f_auto",
    `q_${quality}`,
    "dpr_auto",
    width ? `w_${width}` : "",
    height ? `h_${height}` : "",
    crop ? `c_${crop}` : "",
    gravity ? `g_${gravity}` : ""
  ];

  return insertCloudinaryTransform(url, "image", transforms);
};

export const optimizeCloudinaryVideo = (
  url,
  { width = 1080, quality = "auto:eco" } = {}
) => {
  const transforms = [
    `q_${quality}`,
    "vc_auto",
    "c_limit",
    width ? `w_${width}` : ""
  ];

  return insertCloudinaryTransform(url, "video", transforms);
};
