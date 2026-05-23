export const formatDateTime = (value) => {
  if (!value) return "-";
  return new Date(value).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short"
  });
};

export const slugify = (value = "") =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const extractApiError = (error) =>
  error?.response?.data?.message || "Something went wrong. Please try again.";
