import { useEffect, useMemo, useState } from "react";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import DataTable from "../../components/admin/DataTable";
import CrudFormDrawer from "../../components/admin/CrudFormDrawer";
import StatusPill from "../../components/admin/StatusPill";
import Card from "../../components/ui/Card";
import { filmApi } from "../../services/filmApi";
import { slugify, extractApiError } from "../../lib/formatters";

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
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchRows = async () => {
    try {
      const response = await filmApi.getAdmin();
      setRows(response.data.data);
    } catch (error) {
      window.alert(extractApiError(error));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRows();
  }, []);

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

  const handleDelete = async (row) => {
    if (!window.confirm(`Delete film "${row.title}"?`)) return;
    try {
      await filmApi.remove(row._id);
      await fetchRows();
    } catch (error) {
      window.alert(extractApiError(error));
    }
  };

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
      } else {
        await filmApi.create(payload);
      }

      setDrawerOpen(false);
      await fetchRows();
    } catch (error) {
      window.alert(extractApiError(error));
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
            <Button variant="outline" onClick={() => handleDelete(row)}>
              Delete
            </Button>
          </div>
        )
      }
    ],
    []
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

      {isLoading ? <Card>Loading films...</Card> : <DataTable columns={columns} rows={rows} />}

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
    </div>
  );
}

export default FilmsManagePage;
