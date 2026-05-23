import { useCallback, useEffect, useState } from "react";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Card from "../../components/ui/Card";
import CrudFormDrawer from "../../components/admin/CrudFormDrawer";
import { mediaApi } from "../../services/mediaApi";
import { extractApiError } from "../../lib/formatters";
import { Copy, Trash2, Edit3, Upload, Image, Film, Check, ExternalLink, CheckSquare, Square } from "lucide-react";

const CATEGORIES = [
  "all", "home", "films",
  "wedding", "pre-wedding", "engagement", "haldi", "mehndi",
  "cinematic-films", "drone", "fashion", "baby-shoot"
];
const TYPES = ["all", "photo", "video"];
const MAX_UPLOAD_BYTES = 100 * 1024 * 1024;
const ACCEPTED_UPLOAD_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/avif",
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "video/x-msvideo"
]);

const defaultForm = {
  title: "",
  type: "photo",
  category: "home",
  url: "",
  thumbnailUrl: "",
  altText: "",
  tagsText: "",
  isFeatured: false,
  sortOrder: 0
};

function MediaPage() {
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [copiedId, setCopiedId] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedIds, setSelectedIds] = useState(new Set());

  const toggleSelect = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === rows.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(rows.map((r) => r._id)));
    }
  };

  const bulkDelete = async () => {
    if (!selectedIds.size) return;
    const count = selectedIds.size;
    if (!window.confirm(`Delete ${count} item${count > 1 ? "s" : ""}? This cannot be undone.`)) return;
    try {
      await Promise.all([...selectedIds].map((id) => mediaApi.remove(id)));
      setSelectedIds(new Set());
      fetchRows();
    } catch (error) {
      window.alert(extractApiError(error));
    }
  };

  const fetchRows = useCallback(async () => {
    try {
      const params = {};
      if (filterCategory !== "all") params.category = filterCategory;
      if (filterType !== "all") params.type = filterType;
      const response = await mediaApi.getAdmin(params);
      setRows(response.data.data);
    } catch (error) {
      window.alert(extractApiError(error));
    } finally {
      setIsLoading(false);
    }
  }, [filterCategory, filterType]);

  useEffect(() => {
    setIsLoading(true);
    fetchRows();
  }, [fetchRows]);

  useEffect(() => {
    return () => {
      if (previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // ─── File handling ─────────────────────────────────────

  const handleFileSelect = (file) => {
    if (!file) return;

    if (!ACCEPTED_UPLOAD_TYPES.has(file.type)) {
      window.alert("Please choose a JPG, PNG, WEBP, AVIF, MP4, WEBM, MOV, or AVI file.");
      return;
    }

    if (file.size > MAX_UPLOAD_BYTES) {
      window.alert("File is too large. Upload files up to 100 MB.");
      return;
    }

    const inferredType = file.type.startsWith("video/") ? "video" : "photo";
    setSelectedFile(file);
    setUploadProgress(0);
    setForm((current) => ({
      ...current,
      type: inferredType,
      url: ""
    }));

    if (file.type.startsWith("image/")) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl("");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  // ─── CRUD ──────────────────────────────────────────────

  const openCreate = () => {
    setEditingRow(null);
    setForm(defaultForm);
    setSelectedFile(null);
    setPreviewUrl("");
    setUploadProgress(0);
    setDrawerOpen(true);
  };

  const openEdit = (row) => {
    setEditingRow(row);
    setForm({
      title: row.title,
      type: row.type,
      category: row.category,
      url: row.url,
      thumbnailUrl: row.thumbnailUrl || "",
      altText: row.altText || row.alt || "",
      tagsText: (row.tags || []).join(", "),
      isFeatured: row.isFeatured,
      sortOrder: row.sortOrder || 0
    });
    setSelectedFile(null);
    setPreviewUrl(row.type === "photo" ? row.url : "");
    setUploadProgress(0);
    setDrawerOpen(true);
  };

  const handleDelete = async (row) => {
    if (!window.confirm(`Delete media "${row.title}"?`)) return;
    try {
      await mediaApi.remove(row._id);
      await fetchRows();
    } catch (error) {
      window.alert(extractApiError(error));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!editingRow && !selectedFile) {
      window.alert("Please choose a photo or video file to upload.");
      return;
    }

    try {
      setIsSubmitting(true);
      setUploadProgress(0);

      let payload;
      if (selectedFile) {
        payload = new FormData();
        payload.append("file", selectedFile);
        payload.append("title", form.title.trim());
        payload.append("type", form.type);
        payload.append("category", form.category);
        payload.append("altText", form.altText.trim());
        payload.append("tags", form.tagsText.trim());
        payload.append("isFeatured", form.isFeatured);
        payload.append("sortOrder", Number(form.sortOrder));
        if (form.thumbnailUrl.trim()) {
          payload.append("thumbnailUrl", form.thumbnailUrl.trim());
        }
      } else {
        payload = {
          title: form.title.trim(),
          type: form.type,
          category: form.category,
          url: form.url.trim(),
          thumbnailUrl: form.thumbnailUrl.trim(),
          altText: form.altText.trim(),
          tags: form.tagsText.trim(),
          isFeatured: form.isFeatured,
          sortOrder: Number(form.sortOrder)
        };
      }

      if (editingRow) {
        await mediaApi.update(editingRow._id, payload, (progressEvent) => {
          if (!progressEvent.total) return;
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percent);
        });
      } else {
        await mediaApi.create(payload, (progressEvent) => {
          if (!progressEvent.total) return;
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percent);
        });
      }

      setDrawerOpen(false);
      setSelectedFile(null);
      setPreviewUrl("");
      setUploadProgress(0);
      await fetchRows();
    } catch (error) {
      window.alert(extractApiError(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyUrl = async (url, id) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(""), 2000);
    } catch {
      window.prompt("Copy this URL:", url);
    }
  };

  // ─── Render ────────────────────────────────────────────

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-5xl uppercase">Media Library</h2>
          <p className="text-sm text-[var(--text-muted)]">
            Upload to Cloudinary, preview, tag, and manage all media assets.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Upload className="mr-2 h-4 w-4" />
          Upload Media
        </Button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">
          Category
        </span>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
              filterCategory === cat
                ? "bg-gradient-to-r from-[var(--accent-pink)] to-[var(--accent-purple)] text-white shadow-lg"
                : "bg-[var(--accent-pink)]/[0.06] text-[var(--text-muted)] hover:bg-[var(--accent-pink)]/[0.1] hover:text-[var(--accent-pink)]"
            }`}
          >
            {cat}
          </button>
        ))}

        <span className="ml-4 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">
          Type
        </span>
        {TYPES.map((t) => (
          <button
            key={t}
            onClick={() => setFilterType(t)}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
              filterType === t
                ? "bg-gradient-to-r from-[var(--accent-pink)] to-[var(--accent-purple)] text-white shadow-lg"
                : "bg-[var(--accent-pink)]/[0.06] text-[var(--text-muted)] hover:bg-[var(--accent-pink)]/[0.1] hover:text-[var(--accent-pink)]"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Loading */}
      {isLoading && <Card>Loading media...</Card>}

      {/* Empty state */}
      {!isLoading && rows.length === 0 && (
        <Card>
          <div className="flex flex-col items-center gap-3 py-10 text-center">
            <Image className="h-12 w-12 text-[var(--text-muted)]" />
            <p className="text-sm text-[var(--text-muted)]">No media found. Upload your first asset.</p>
          </div>
        </Card>
      )}

      {/* Preview Grid */}
      {!isLoading && rows.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {rows.map((item) => (
            <div
              key={item._id}
              className={`group relative overflow-hidden rounded-2xl border bg-[var(--surface)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(194,109,186,0.15)] ${
                selectedIds.has(item._id) ? "border-[var(--accent-pink)] shadow-[0_0_0_2px_rgba(194,109,186,0.25)]" : "border-[var(--accent-pink)]/10 hover:border-[var(--accent-pink)]/40"
              }`}
            >
              {/* Selection checkbox */}
              <button
                onClick={() => toggleSelect(item._id)}
                className="absolute left-3 top-3 z-10 rounded-md bg-[var(--surface)]/90 p-1 backdrop-blur-sm transition-all hover:bg-[var(--surface)]"
              >
                {selectedIds.has(item._id) ? (
                  <CheckSquare className="h-4 w-4 text-[var(--accent-pink)]" />
                ) : (
                  <Square className="h-4 w-4 text-[var(--text-muted)]" />
                )}
              </button>
              {/* Thumbnail */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[var(--surface)]">
                {item.type === "photo" ? (
                  <img
                    src={item.thumbnailUrl || item.url}
                    alt={item.altText || item.alt || item.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <video
                    src={item.url}
                    preload="metadata"
                    muted
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}

                {/* Type badge */}
                <span className="absolute left-3 top-3 rounded-md bg-[var(--accent-pink)]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--accent-pink)] backdrop-blur-sm">
                  {item.type}
                </span>

                {/* Featured badge */}
                {item.isFeatured && (
                  <span className="absolute right-3 top-3 rounded-md bg-gradient-to-r from-[var(--accent-pink)] to-[var(--accent-purple)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                    Featured
                  </span>
                )}

                {/* Hover overlay */}
                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <button
                    onClick={() => openEdit(item)}
                    className="rounded-lg bg-[var(--surface)]/20 p-2.5 backdrop-blur-sm transition-all hover:bg-[var(--surface)]/30"
                    title="Edit"
                  >
                    <Edit3 className="h-4 w-4 text-white" />
                  </button>
                  <button
                    onClick={() => copyUrl(item.url, item._id)}
                    className="rounded-lg bg-[var(--surface)]/20 p-2.5 backdrop-blur-sm transition-all hover:bg-[var(--surface)]/30"
                    title="Copy URL"
                  >
                    {copiedId === item._id ? (
                      <Check className="h-4 w-4 text-green-400" />
                    ) : (
                      <Copy className="h-4 w-4 text-white" />
                    )}
                  </button>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-lg bg-[var(--surface)]/20 p-2.5 backdrop-blur-sm transition-all hover:bg-[var(--surface)]/30"
                    title="Open"
                  >
                    <ExternalLink className="h-4 w-4 text-white" />
                  </a>
                  <button
                    onClick={() => handleDelete(item)}
                    className="rounded-lg bg-red-500/30 p-2.5 backdrop-blur-sm transition-all hover:bg-red-500/50"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4 text-red-300" />
                  </button>
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="truncate text-sm font-semibold text-[var(--text-primary)]">{item.title}</h3>
                <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                  <span className="rounded bg-[var(--accent-pink)]/[0.06] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                    {item.category}
                  </span>
                  {(item.tags || []).map((tag) => (
                    <span
                      key={tag}
                      className="rounded bg-[var(--accent-purple)]/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--accent-purple)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Select All & Bulk Actions */}
      {!isLoading && rows.length > 0 && (
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSelectAll}
            className="flex items-center gap-2 rounded-lg border border-[var(--accent-pink)]/10 bg-[var(--surface)] px-3 py-2 text-xs font-medium text-[var(--text-secondary)] transition-all hover:border-[var(--accent-pink)]/30 hover:text-[var(--accent-pink)]"
          >
            {selectedIds.size === rows.length ? (
              <CheckSquare className="h-3.5 w-3.5 text-[var(--accent-pink)]" />
            ) : (
              <Square className="h-3.5 w-3.5" />
            )}
            {selectedIds.size === rows.length ? "Deselect All" : "Select All"}
          </button>
          <span className="text-xs text-[var(--text-muted)]">
            {rows.length} item{rows.length !== 1 ? "s" : ""}
          </span>
        </div>
      )}

      {/* Floating Bulk Delete Bar */}
      {selectedIds.size > 0 && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 flex items-center gap-4 rounded-2xl border border-[var(--accent-pink)]/20 bg-[var(--surface)] px-6 py-3.5 shadow-[0_8px_30px_rgba(194,109,186,0.2)]">
          <span className="text-sm font-medium text-[var(--text-primary)]">
            {selectedIds.size} selected
          </span>
          <button
            onClick={bulkDelete}
            className="flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-red-600"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete
          </button>
          <button
            onClick={() => setSelectedIds(new Set())}
            className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          >
            Cancel
          </button>
        </div>
      )}

      {/* ─── Create / Edit Drawer ─────────────────────────── */}
      <CrudFormDrawer
        open={drawerOpen}
        title={editingRow ? "Edit Media" : "Upload Media"}
        onClose={() => {
          setDrawerOpen(false);
          setSelectedFile(null);
          setPreviewUrl("");
          setUploadProgress(0);
        }}
      >
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Drag & Drop Zone */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`flex min-h-[140px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all duration-300 ${
              isDragging
                ? "border-[var(--accent-purple)] bg-[var(--accent-purple)]/10"
                : "border-[var(--accent-pink)]/20 bg-[var(--surface)] hover:border-[var(--accent-pink)]/40"
            }`}
            onClick={() => document.getElementById("media-file-input")?.click()}
          >
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Preview"
                className="max-h-[120px] rounded-lg object-contain"
              />
            ) : selectedFile ? (
              <div className="flex flex-col items-center gap-2">
                <Film className="h-8 w-8 text-[var(--text-muted)]" />
                <p className="text-xs text-[var(--text-muted)]">{selectedFile.name}</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 px-4 text-center">
                <Upload className="h-8 w-8 text-[var(--text-muted)]" />
                <p className="text-xs text-[var(--text-muted)]">
                  Drag & drop or click to upload
                </p>
                <p className="text-[10px] text-[var(--text-muted)]">
                  JPG, PNG, WEBP, AVIF, MP4, WEBM, MOV, AVI - Max 100MB
                </p>
              </div>
            )}
            <input
              id="media-file-input"
              type="file"
              accept="image/*,video/*"
              className="hidden"
              onChange={(e) => handleFileSelect(e.target.files?.[0])}
            />
          </div>

          {selectedFile && (
            <p className="text-[10px] font-medium text-green-400">
              File selected: {selectedFile.name} - will upload to Cloudinary
            </p>
          )}

          <Input
            label="Title"
            value={form.title}
            onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-2 text-sm text-[var(--text-muted)]">
              <span className="font-medium">Type</span>
              <select
                value={form.type}
                onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}
                disabled={Boolean(selectedFile)}
                className="rounded-xl border border-[var(--accent-pink)]/10 bg-[var(--surface)] px-4 py-3 text-[var(--text-primary)] outline-none transition-all duration-300 focus:border-[var(--accent-purple)] focus:ring-2 focus:ring-[var(--accent-purple)]/30 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <option value="photo" className="bg-[var(--surface)]">Photo</option>
                <option value="video" className="bg-[var(--surface)]">Video</option>
              </select>
            </label>

            <label className="flex flex-col gap-2 text-sm text-[var(--text-muted)]">
              <span className="font-medium">Category</span>
              <select
                value={form.category}
                onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                className="rounded-xl border border-[var(--accent-pink)]/10 bg-[var(--surface)] px-4 py-3 text-[var(--text-primary)] outline-none transition-all duration-300 focus:border-[var(--accent-purple)] focus:ring-2 focus:ring-[var(--accent-purple)]/30"
              >
                <option value="home" className="bg-[var(--surface)]">Home</option>
                <option value="films" className="bg-[var(--surface)]">Films</option>
                <option value="wedding" className="bg-[var(--surface)]">Wedding</option>
                <option value="pre-wedding" className="bg-[var(--surface)]">Pre-Wedding</option>
                <option value="engagement" className="bg-[var(--surface)]">Engagement</option>
                <option value="haldi" className="bg-[var(--surface)]">Haldi</option>
                <option value="mehndi" className="bg-[var(--surface)]">Mehndi</option>
                <option value="cinematic-films" className="bg-[var(--surface)]">Cinematic Films</option>
                <option value="drone" className="bg-[var(--surface)]">Drone</option>
                <option value="fashion" className="bg-[var(--surface)]">Fashion</option>
                <option value="baby-shoot" className="bg-[var(--surface)]">Baby Shoot</option>
              </select>
            </label>
          </div>

          {editingRow && !selectedFile && form.url && (
            <Input
              label="Saved Cloudinary URL"
              value={form.url}
              readOnly
              onFocus={(e) => e.target.select()}
            />
          )}

          {(form.type === "video" || editingRow) && (
            <Input
              label="Thumbnail URL (optional)"
              value={form.thumbnailUrl}
              onChange={(e) => setForm((p) => ({ ...p, thumbnailUrl: e.target.value }))}
            />
          )}

          <Input
            label="Alt Text"
            value={form.altText}
            onChange={(e) => setForm((p) => ({ ...p, altText: e.target.value }))}
          />

          <Input
            label="Tags (comma-separated: wedding, fashion, film)"
            value={form.tagsText}
            onChange={(e) => setForm((p) => ({ ...p, tagsText: e.target.value }))}
          />

          <Input
            label="Sort Order"
            type="number"
            value={form.sortOrder}
            onChange={(e) => setForm((p) => ({ ...p, sortOrder: e.target.value }))}
          />

          <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
            <input
              type="checkbox"
              checked={form.isFeatured}
              onChange={(e) => setForm((p) => ({ ...p, isFeatured: e.target.checked }))}
            />
            Featured
          </label>

          {/* Upload Progress */}
          {isSubmitting && uploadProgress > 0 && (
            <div className="space-y-1">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--accent-pink)]/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[var(--accent-pink)] to-[var(--accent-purple)] transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-right text-[10px] text-[var(--text-muted)]">{uploadProgress}%</p>
            </div>
          )}

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Uploading..." : "Save Media"}
          </Button>
        </form>
      </CrudFormDrawer>
    </div>
  );
}

export default MediaPage;
