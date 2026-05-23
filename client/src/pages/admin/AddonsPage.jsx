import { useEffect, useMemo, useState } from "react";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import DataTable from "../../components/admin/DataTable";
import CrudFormDrawer from "../../components/admin/CrudFormDrawer";
import StatusPill from "../../components/admin/StatusPill";
import Card from "../../components/ui/Card";
import { addonApi } from "../../services/addonApi";
import { extractApiError } from "../../lib/formatters";

const defaultForm = {
  name: "",
  priceDisplay: "",
  startingPrice: 0,
  isActive: true,
  sortOrder: 0
};

function AddonsPage() {
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchRows = async () => {
    try {
      const response = await addonApi.getAdmin();
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
      name: row.name,
      priceDisplay: row.priceDisplay,
      startingPrice: row.startingPrice,
      isActive: row.isActive,
      sortOrder: row.sortOrder || 0
    });
    setDrawerOpen(true);
  };

  const handleDelete = async (row) => {
    if (!window.confirm(`Delete add-on "${row.name}"?`)) return;
    try {
      await addonApi.remove(row._id);
      await fetchRows();
    } catch (error) {
      window.alert(extractApiError(error));
    }
  };

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
      } else {
        await addonApi.create(payload);
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
          <h2 className="font-heading text-5xl uppercase">Manage Add-ons</h2>
          <p className="text-sm text-[var(--text-muted)]">
            Create, edit, or delete add-on services and upgrades.
          </p>
        </div>
        <Button onClick={openCreate}>Add Add-on</Button>
      </div>

      {isLoading ? (
        <Card>Loading add-ons...</Card>
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
    </div>
  );
}

export default AddonsPage;
