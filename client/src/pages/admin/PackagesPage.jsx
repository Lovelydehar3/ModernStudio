import { useEffect, useMemo, useState, useCallback } from "react";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Card from "../../components/ui/Card";
import DataTable from "../../components/admin/DataTable";
import CrudFormDrawer from "../../components/admin/CrudFormDrawer";
import StatusPill from "../../components/admin/StatusPill";
import { packageApi } from "../../services/packageApi";
import { addonApi } from "../../services/addonApi";
import { extractApiError } from "../../lib/formatters";
import { useToast } from "../../components/ui/ToastContext";
import { TableRowSkeleton } from "../../components/ui/Skeleton";

const defaultForm = {
  name: "",
  priceDisplay: "",
  startingPrice: 0,
  description: "",
  featuresText: "",
  coverImage: "",
  galleryImagesText: "",
  selectedAddOnIds: [],
  isActive: true,
  sortOrder: 0
};

function PackagesPage() {
  const { showToast } = useToast();
  const [rows, setRows] = useState([]);
  const [allAddons, setAllAddons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchRows = useCallback(async () => {
    try {
      const [pkgRes, addonRes] = await Promise.all([
        packageApi.getAdmin(),
        addonApi.getAdmin()
      ]);
      setRows(pkgRes.data.data);
      setAllAddons(addonRes.data.data);
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
    setForm({
      ...defaultForm,
      selectedAddOnIds: allAddons.map((a) => a._id)
    });
    setDrawerOpen(true);
  };

  const openEdit = (row) => {
    setEditingRow(row);
    setForm({
      name: row.name,
      priceDisplay: row.priceDisplay,
      startingPrice: row.startingPrice,
      description: row.description || "",
      featuresText: (row.features || []).join("\n"),
      coverImage: row.coverImage || "",
      galleryImagesText: (row.galleryImages || []).join("\n"),
      selectedAddOnIds: (row.addOns || []).map((a) =>
        typeof a === "object" ? a._id : a
      ),
      isActive: row.isActive,
      sortOrder: row.sortOrder || 0
    });
    setDrawerOpen(true);
  };

  const handleDeleteClick = useCallback((row) => {
    setDeleteTarget(row);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteTarget) return;
    try {
      await packageApi.remove(deleteTarget._id);
      showToast("Package deleted successfully", "success");
      setDeleteTarget(null);
      await fetchRows();
    } catch (error) {
      showToast(extractApiError(error), "error");
    }
  }, [deleteTarget, showToast, fetchRows]);

  const toggleAddon = (addonId) => {
    setForm((prev) => {
      const ids = new Set(prev.selectedAddOnIds);
      if (ids.has(addonId)) {
        ids.delete(addonId);
      } else {
        ids.add(addonId);
      }
      return { ...prev, selectedAddOnIds: [...ids] };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      name: form.name.trim(),
      priceDisplay: form.priceDisplay.trim(),
      startingPrice: Number(form.startingPrice),
      description: form.description.trim(),
      features: form.featuresText
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
      coverImage: form.coverImage.trim(),
      galleryImages: form.galleryImagesText
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
      addOns: form.selectedAddOnIds,
      isActive: form.isActive,
      sortOrder: Number(form.sortOrder)
    };

    try {
      setIsSubmitting(true);
      if (editingRow) {
        await packageApi.update(editingRow._id, payload);
        showToast("Package updated successfully", "success");
      } else {
        await packageApi.create(payload);
        showToast("Package created successfully", "success");
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
      { key: "name", label: "Name" },
      { key: "priceDisplay", label: "Price" },
      { key: "startingPrice", label: "Start Price" },
      {
        key: "addOns",
        label: "Add-ons",
        render: (row) => {
          const list = row.addOns || [];
          return list.length
            ? list.map((a) => (typeof a === "object" ? a.name : a)).join(", ")
            : "-";
        }
      },
      {
        key: "isActive",
        label: "Active",
        render: (row) => <StatusPill value={row.isActive} />
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
          <h2 className="font-heading text-5xl uppercase">Manage Packages</h2>
          <p className="text-sm text-[var(--text-muted)]">
            Create, edit, or delete package offerings. Add-ons are linked from the Add-ons section.
          </p>
        </div>
        <Button onClick={openCreate}>Add Package</Button>
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
        <DataTable columns={columns} rows={rows} emptyLabel="No packages found." />
      )}

      <CrudFormDrawer
        open={drawerOpen}
        title={editingRow ? "Edit Package" : "Create Package"}
        onClose={() => setDrawerOpen(false)}
      >
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            label="Name"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            required
          />
          <Input
            label="Price Display"
            value={form.priceDisplay}
            onChange={(e) => setForm((p) => ({ ...p, priceDisplay: e.target.value }))}
            required
          />
          <Input
            label="Starting Price"
            type="number"
            value={form.startingPrice}
            onChange={(e) => setForm((p) => ({ ...p, startingPrice: e.target.value }))}
            required
          />
          <Input
            label="Cover Image URL"
            value={form.coverImage}
            onChange={(e) => setForm((p) => ({ ...p, coverImage: e.target.value }))}
          />
          <Input
            label="Sort Order"
            type="number"
            value={form.sortOrder}
            onChange={(e) => setForm((p) => ({ ...p, sortOrder: e.target.value }))}
          />

          <label className="flex flex-col gap-2 text-sm text-[var(--text-muted)]">
            <span className="font-medium">Description</span>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              className="rounded-xl border border-[var(--accent-pink)]/10 bg-[var(--surface)] px-4 py-3 text-[var(--text-primary)] outline-none transition-all duration-300 focus:border-[var(--accent-purple)] focus:ring-2 focus:ring-[var(--accent-purple)]/30"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm text-[var(--text-muted)]">
            <span className="font-medium">Features (one per line)</span>
            <textarea
              rows={6}
              value={form.featuresText}
              onChange={(e) => setForm((p) => ({ ...p, featuresText: e.target.value }))}
              className="rounded-xl border border-[var(--accent-pink)]/10 bg-[var(--surface)] px-4 py-3 text-[var(--text-primary)] outline-none transition-all duration-300 focus:border-[var(--accent-purple)] focus:ring-2 focus:ring-[var(--accent-purple)]/30"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm text-[var(--text-muted)]">
            <span className="font-medium">Gallery Image URLs (one per line)</span>
            <textarea
              rows={4}
              value={form.galleryImagesText}
              onChange={(e) => setForm((p) => ({ ...p, galleryImagesText: e.target.value }))}
              className="rounded-xl border border-[var(--accent-pink)]/10 bg-[var(--surface)] px-4 py-3 text-[var(--text-primary)] outline-none transition-all duration-300 focus:border-[var(--accent-purple)] focus:ring-2 focus:ring-[var(--accent-purple)]/30"
            />
          </label>

          {/* Add-ons selection via checkboxes */}
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-[var(--text-muted)]">Link Add-ons</span>
            <div className="max-h-[200px] space-y-1.5 overflow-y-auto rounded-xl border border-[var(--accent-pink)]/10 bg-[var(--surface)] p-3">
              {allAddons.length === 0 && (
                <p className="text-xs text-[var(--text-muted)]">
                  No add-ons yet. Create them in the Add-ons section first.
                </p>
              )}
              {allAddons.map((addon) => (
                <label
                  key={addon._id}
                  className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm text-[var(--text-secondary)] transition-colors hover:bg-[var(--accent-pink)]/[0.04]"
                >
                  <input
                    type="checkbox"
                    checked={form.selectedAddOnIds.includes(addon._id)}
                    onChange={() => toggleAddon(addon._id)}
                    className="accent-[var(--accent-purple)]"
                  />
                  <span>{addon.name}</span>
                  <span className="ml-auto text-[10px] text-[var(--text-muted)]">
                    {addon.priceDisplay}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))}
            />
            Active
          </label>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Saving..." : "Save Package"}
          </Button>
        </form>
      </CrudFormDrawer>

      {/* Delete Confirmation Modal — replaces window.confirm() */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setDeleteTarget(null)} aria-hidden="true" />
          <div className="relative z-10 w-full max-w-sm rounded-2xl border border-[var(--card-border)] bg-[var(--surface)] p-6 shadow-2xl">
            <h3 className="font-heading text-xl uppercase tracking-wider text-[var(--text-primary)]">Delete Package</h3>
            <p className="mt-3 text-sm text-[var(--text-secondary)]">
              Are you sure you want to delete the package <strong className="text-[var(--text-primary)]">{deleteTarget.name}</strong>? This action cannot be undone.
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

export default PackagesPage;
