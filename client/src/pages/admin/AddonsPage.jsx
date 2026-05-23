import { useEffect, useMemo, useState, useCallback } from "react";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import DataTable from "../../components/admin/DataTable";
import CrudFormDrawer from "../../components/admin/CrudFormDrawer";
import StatusPill from "../../components/admin/StatusPill";
import Card from "../../components/ui/Card";
import { addonApi } from "../../services/addonApi";
import { extractApiError } from "../../lib/formatters";
import { useToast } from "../../components/ui/ToastContext";
import { TableRowSkeleton } from "../../components/ui/Skeleton";

const defaultForm = {
  name: "",
  priceDisplay: "",
  startingPrice: 0,
  isActive: true,
  sortOrder: 0
};

function AddonsPage() {
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
      const response = await addonApi.getAdmin();
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
      name: row.name,
      priceDisplay: row.priceDisplay,
      startingPrice: row.startingPrice,
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
      await addonApi.remove(deleteTarget._id);
      showToast("Add-on deleted successfully", "success");
      setDeleteTarget(null);
      await fetchRows();
    } catch (error) {
      showToast(extractApiError(error), "error");
    }
  }, [deleteTarget, showToast, fetchRows]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      name: form.name.trim(),
      priceDisplay: form.priceDisplay.trim(),
      startingPrice: Number(form.startingPrice),
      isActive: form.isActive,
      sortOrder: Number(form.sortOrder)
    };

    try {
      setIsSubmitting(true);
      if (editingRow) {
        await addonApi.update(editingRow._id, payload);
        showToast("Add-on updated successfully", "success");
      } else {
        await addonApi.create(payload);
        showToast("Add-on created successfully", "success");
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
      { key: "startingPrice", label: "Starting ₹" },
      {
        key: "isActive",
        label: "Active",
        render: (row) => <StatusPill value={row.isActive} />
      },
      { key: "sortOrder", label: "Order" },
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
          <h2 className="font-heading text-5xl uppercase">Manage Add-ons</h2>
          <p className="text-sm text-[var(--text-muted)]">
            Create, edit, or delete add-on services and upgrades.
          </p>
        </div>
        <Button onClick={openCreate}>Add Add-on</Button>
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
        <DataTable columns={columns} rows={rows} emptyLabel="No add-ons found." />
      )}

      <CrudFormDrawer
        open={drawerOpen}
        title={editingRow ? "Edit Add-on" : "Create Add-on"}
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
            label="Price Display (e.g. ₹20,000+)"
            value={form.priceDisplay}
            onChange={(e) => setForm((p) => ({ ...p, priceDisplay: e.target.value }))}
            required
          />
          <Input
            label="Starting Price (number)"
            type="number"
            value={form.startingPrice}
            onChange={(e) => setForm((p) => ({ ...p, startingPrice: e.target.value }))}
            required
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
              checked={form.isActive}
              onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))}
            />
            Active
          </label>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Saving..." : "Save Add-on"}
          </Button>
        </form>
      </CrudFormDrawer>

      {/* Delete Confirmation Modal — replaces window.confirm() */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setDeleteTarget(null)} aria-hidden="true" />
          <div className="relative z-10 w-full max-w-sm rounded-2xl border border-[var(--card-border)] bg-[var(--surface)] p-6 shadow-2xl">
            <h3 className="font-heading text-xl uppercase tracking-wider text-[var(--text-primary)]">Delete Add-on</h3>
            <p className="mt-3 text-sm text-[var(--text-secondary)]">
              Are you sure you want to delete the add-on <strong className="text-[var(--text-primary)]">{deleteTarget.name}</strong>? This action cannot be undone.
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

export default AddonsPage;
