export const cn = (...classes) => classes.filter(Boolean).join(" ");

export const formatDate = (value) =>
  new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export const getYouTubeThumbnail = (embedUrl) => {
  const videoId = embedUrl?.split("/embed/")[1]?.split("?")[0];
  return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : "";
};

export const slugify = (value = "") =>
  String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const calculateInclusiveDays = (startDate, endDate) => {
  if (!startDate || !endDate) return 0;

  const start = new Date(startDate);
  const end = new Date(endDate);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end < start) {
    return 0;
  }

  const diff = end.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
};
