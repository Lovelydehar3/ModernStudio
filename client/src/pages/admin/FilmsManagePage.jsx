import { useEffect, useMemo, useState, useCallback } from "react";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import DataTable from "../../components/admin/DataTable";
import CrudFormDrawer from "../../components/admin/CrudFormDrawer";
import StatusPill from "../../components/admin/StatusPill";
import Card from "../../components/ui/Card";
import { filmApi } from "../../services/filmApi";
import { slugify, extractApiError } from "../../lib/formatters";
import { useToast } from "../../components/ui/ToastContext";
import { TableRowSkeleton } from "../../components/ui/Skeleton";

const defaultForm = {
  title: "",
  slug: "",
  summary: "",
  coverImage: "",
  videoUrl: "",
  tagsText: "",
  isPublished: true
};

function FilmsManagePage() {
  const { showToast } = useToast();
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchRows = useCallback(async () => {
    try {
      const response = await filmApi.getAdmin();
      setRows(response.data.data);
    } catch (error) {
      showToast(extractApiError(error), "error");
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchRows();
  }, [fetchRows]);

  const openCreate = () => {
    setEditingRow(null);
    setForm(defaultForm);
    setDrawerOpen(true);
  };

  const openEdit = (row) => {
    setEditingRow(row);
    setForm({
      title: row.title,
      slug: row.slug,
      summary: row.summary || "",
      coverImage: row.coverImage || "",
      videoUrl: row.videoUrl || "",
      tagsText: (row.tags || []).join(", "),
      isPublished: row.isPublished
    });
    setDrawerOpen(true);
  };

  const handleDeleteClick = useCallback((row) => {
    setDeleteTarget(row);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteTarget) return;
    try {
      await filmApi.remove(deleteTarget._id);
      showToast("Film deleted successfully", "success");
      setDeleteTarget(null);
      await fetchRows();
    } catch (error) {
      showToast(extractApiError(error), "error");
    }
  }, [deleteTarget, showToast, fetchRows]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setIsSubmitting(true);

      const payload = {
        title: form.title.trim(),
        slug: form.slug.trim() || slugify(form.title),
        summary: form.summary.trim(),
        coverImage: form.coverImage.trim(),
        videoUrl: form.videoUrl.trim(),
        tags: form.tagsText
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        isPublished: form.isPublished
      };

      if (editingRow) {
        await filmApi.update(editingRow._id, payload);
        showToast("Film updated successfully", "success");
      } else {
        await filmApi.create(payload);
        showToast("Film created successfully", "success");
      }

      setDrawerOpen(false);
      await fetchRows();
    } catch (error) {
      showToast(extractApiError(error), "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = useMemo(
    () => [
      { key: "title", label: "Title" },
      { key: "slug", label: "Slug" },
      {
        key: "isPublished",
        label: "Published",
        render: (row) => <StatusPill value={row.isPublished} />
      },
      {
        key: "actions",
        label: "Actions",
        render: (row) => (
          <div className="flex gap-2">
            <Button variant="muted" onClick={() => openEdit(row)}>
              Edit
            </Button>
            <Button variant="outline" onClick={() => handleDeleteClick(row)}>
              Delete
            </Button>
          </div>
        )
      }
    ],
    [handleDeleteClick]
  );

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-5xl uppercase">Manage Films</h2>
          <p className="text-sm text-[var(--text-muted)]">Film entries for the public films section.</p>
        </div>
        <Button onClick={openCreate}>Add Film</Button>
      </div>

      {isLoading ? (
        <div className="overflow-hidden rounded-2xl border border-[var(--accent-pink)]/10 bg-[var(--surface)]">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-[var(--surface)] text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--text-muted)]">
                <tr>
                  {columns.map(col => <th key={col.key} className="px-5 py-4 font-medium">{col.label}</th>)}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 5 }).map((_, i) => (
                  <TableRowSkeleton key={i} columns={columns.length} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <DataTable columns={columns} rows={rows} emptyLabel="No films found. Click Add Film to create one." />
      )}

      <CrudFormDrawer
        open={drawerOpen}
        title={editingRow ? "Edit Film" : "Add Film"}
        onClose={() => setDrawerOpen(false)}
      >
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            label="Title"
            value={form.title}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                title: event.target.value,
                slug: slugify(event.target.value)
              }))
            }
            required
          />
          <Input
            label="Slug"
            value={form.slug}
            onChange={(event) => setForm((prev) => ({ ...prev, slug: event.target.value }))}
          />
          <Input
            label="Cover Image URL"
            value={form.coverImage}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, coverImage: event.target.value }))
            }
          />
          <Input
            label="Video URL"
            value={form.videoUrl}
            onChange={(event) => setForm((prev) => ({ ...prev, videoUrl: event.target.value }))}
          />

          <label className="flex flex-col gap-2 text-sm text-[var(--text-muted)]">
            <span className="font-medium">Summary</span>
            <textarea
              rows={4}
              value={form.summary}
              onChange={(event) => setForm((prev) => ({ ...prev, summary: event.target.value }))}
              className="rounded-xl border border-[var(--accent-pink)]/10 bg-[var(--surface)] px-4 py-3 text-[var(--text-primary)] outline-none transition-all duration-300 focus:border-[var(--accent-purple)] focus:ring-2 focus:ring-[var(--accent-purple)]/30"
            />
          </label>

          <Input
            label="Tags (comma-separated)"
            value={form.tagsText}
            onChange={(event) => setForm((prev) => ({ ...prev, tagsText: event.target.value }))}
          />

          <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
            <input
              type="checkbox"
              checked={form.isPublished}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, isPublished: event.target.checked }))
              }
            />
            Published
          </label>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Saving..." : "Save Film"}
          </Button>
        </form>
      </CrudFormDrawer>

      {/* Delete Confirmation Modal — replaces window.confirm() */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setDeleteTarget(null)} aria-hidden="true" />
          <div className="relative z-10 w-full max-w-sm rounded-2xl border border-[var(--card-border)] bg-[var(--surface)] p-6 shadow-2xl">
            <h3 className="font-heading text-xl uppercase tracking-wider text-[var(--text-primary)]">Delete Film</h3>
            <p className="mt-3 text-sm text-[var(--text-secondary)]">
              Are you sure you want to delete the film <strong className="text-[var(--text-primary)]">{deleteTarget.title}</strong>? This action cannot be undone.
            </p>
            <div className="mt-5 flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 rounded-xl border border-[var(--card-border)] px-4 py-2.5 text-sm font-medium text-[var(--text-secondary)] transition-all duration-300 hover:bg-[var(--card-border)]"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm font-bold uppercase tracking-wider text-red-400 transition-all duration-300 hover:bg-red-500/20"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FilmsManagePage;
