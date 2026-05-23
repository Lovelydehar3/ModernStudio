import { useEffect, useMemo, useState } from "react";
import Button from "../../components/ui/Button";
import DataTable from "../../components/admin/DataTable";
import StatusPill from "../../components/admin/StatusPill";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import CrudFormDrawer from "../../components/admin/CrudFormDrawer";
import { bookingApi } from "../../services/bookingApi";
import { packageApi } from "../../services/packageApi";
import { packageDefaults } from "../../constants/packageDefaults";
import { formatDateTime, extractApiError } from "../../lib/formatters";
import { useToast } from "../../components/ui/ToastContext";

const EVENT_TYPES = [
  { label: "Wedding", value: "wedding" },
  { label: "Pre-Wedding / Engagement", value: "pre-wedding" },
  { label: "Reception", value: "reception" },
  { label: "Model Portfolio", value: "portfolio" },
  { label: "Other", value: "other" }
];

const INITIAL_FORM = {
  name: "",
  email: "",
  phone: "",
  eventType: "wedding",
  eventDate: "",
  eventLocation: "",
  days: "1",
  selectedPackageName: "Essential",
  message: ""
};

function BookingsPage() {
  const { showToast } = useToast();
  const [rows, setRows] = useState([]);
  const [packages, setPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  
  // Drawer & Edit states
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [editForm, setEditForm] = useState(INITIAL_FORM);
  const [editingId, setEditingId] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchRows = async () => {
    try {
      const response = await bookingApi.getAdmin(statusFilter ? { status: statusFilter } : {});
      setRows(response.data.data);
    } catch (error) {
      showToast(extractApiError(error), "error");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPackages = async () => {
    try {
      const response = await packageApi.getPublic();
      const data = response.data.data?.length ? response.data.data : packageDefaults;
      setPackages(data);
    } catch (_err) {
      setPackages(packageDefaults);
    }
  };

  useEffect(() => {
    fetchRows();
  }, [statusFilter]);

  useEffect(() => {
    fetchPackages();
  }, []);

  const updateStatus = async (row, status) => {
    const note = window.prompt(`Add note for ${status} status (optional):`) || "";
    try {
      await bookingApi.updateStatus(row._id, { status, note });
      showToast(`Booking ${status} successfully`, "success");
      await fetchRows();
    } catch (error) {
      showToast(extractApiError(error), "error");
    }
  };

  const handleEditClick = (row) => {
    setEditingId(row._id);
    let rawDate = "";
    if (row.eventDate) {
      try {
        rawDate = new Date(row.eventDate).toISOString().split("T")[0];
      } catch (_) {
        rawDate = row.eventDate;
      }
    }
    setEditForm({
      name: row.name || "",
      email: row.email || "",
      phone: row.phone || "",
      eventType: row.eventType || "wedding",
      eventDate: rawDate,
      eventLocation: row.eventLocation || "",
      days: String(row.days || 1),
      selectedPackageName: row.selectedPackage?.name || "Essential",
      message: row.message || ""
    });
    setEditDrawerOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editForm.name.trim() || !editForm.email.trim() || !editForm.phone.trim()) {
      showToast("Name, Email, and Phone are required", "error");
      return;
    }
    setIsUpdating(true);
    try {
      const selectedPkg = packages.find(p => p.name === editForm.selectedPackageName) || packageDefaults[0];
      const payload = {
        name: editForm.name.trim(),
        email: editForm.email.trim(),
        phone: editForm.phone.trim(),
        eventType: editForm.eventType,
        eventDate: editForm.eventDate,
        eventLocation: editForm.eventLocation.trim(),
        days: Number(editForm.days),
        selectedPackage: {
          packageId: selectedPkg._id,
          name: selectedPkg.name,
          priceDisplay: selectedPkg.priceDisplay,
          startingPrice: selectedPkg.startingPrice
        },
        message: editForm.message.trim()
      };
      await bookingApi.update(editingId, payload);
      showToast("Booking updated successfully", "success");
      setEditDrawerOpen(false);
      await fetchRows();
    } catch (error) {
      showToast(extractApiError(error), "error");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteClick = async (row) => {
    if (window.confirm(`Are you sure you want to delete the booking for ${row.name}?`)) {
      try {
        await bookingApi.remove(row._id);
        showToast("Booking deleted successfully", "success");
        await fetchRows();
      } catch (error) {
        showToast(extractApiError(error), "error");
      }
    }
  };

  const columns = useMemo(
    () => [
      { key: "name", label: "Client" },
      { key: "email", label: "Email" },
      { key: "phone", label: "Phone" },
      {
        key: "selectedPackage",
        label: "Package",
        render: (row) => row.selectedPackage?.name
      },
      {
        key: "addOns",
        label: "Add-ons",
        render: (row) => (row.addOns?.length ? row.addOns.map((item) => item.name).join(", ") : "-")
      },
      {
        key: "status",
        label: "Status",
        render: (row) => <StatusPill value={row.status} />
      },
      {
        key: "history",
        label: "History",
        render: (row) => `${row.statusHistory?.length || 0} updates`
      },
      {
        key: "createdAt",
        label: "Created",
        render: (row) => formatDateTime(row.createdAt)
      },
      {
        key: "actions",
        label: "Actions",
        render: (row) => (
          <div className="flex flex-col gap-1.5 md:flex-row">
            {row.status === "pending" && (
              <>
                <Button variant="muted" size="sm" onClick={() => updateStatus(row, "accepted")} className="px-2.5 py-1 text-xs">
                  Accept
                </Button>
                <Button variant="outline" size="sm" onClick={() => updateStatus(row, "rejected")} className="px-2.5 py-1 text-xs">
                  Reject
                </Button>
              </>
            )}
            <Button variant="muted" size="sm" onClick={() => handleEditClick(row)} className="px-2.5 py-1 text-xs bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 border border-indigo-500/20">
              Edit
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleDeleteClick(row)} className="px-2.5 py-1 text-xs bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20">
              Delete
            </Button>
          </div>
        )
      }
    ],
    [packages]
  );

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-5xl uppercase">Manage Bookings</h2>
          <p className="text-sm text-[var(--text-muted)]">View, accept, reject, edit, or delete bookings and track updates.</p>
        </div>

        <label className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">
          Filter by Status
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="ml-3 rounded-xl border border-[var(--accent-pink)]/10 bg-[var(--surface)] px-4 py-2 text-sm text-[var(--text-primary)] outline-none transition-all duration-300 focus:border-[var(--accent-purple)] focus:ring-2 focus:ring-[var(--accent-purple)]/30"
          >
            <option value="" className="bg-[var(--surface)]">All</option>
            <option value="pending" className="bg-[var(--surface)]">Pending</option>
            <option value="accepted" className="bg-[var(--surface)]">Accepted</option>
            <option value="rejected" className="bg-[var(--surface)]">Rejected</option>
          </select>
        </label>
      </div>

      {isLoading ? <Card>Loading bookings...</Card> : <DataTable columns={columns} rows={rows} />}

      {/* Edit Drawer */}
      <CrudFormDrawer
        open={editDrawerOpen}
        title="Edit Booking"
        onClose={() => setEditDrawerOpen(false)}
      >
        <form onSubmit={handleEditSubmit} className="space-y-5">
          <Input
            label="Client Name"
            value={editForm.name}
            onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
            required
          />
          <Input
            label="Email Address"
            type="email"
            value={editForm.email}
            onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
            required
          />
          <Input
            label="Phone Number"
            value={editForm.phone}
            onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
            required
          />
          <Select
            label="Event Type"
            value={editForm.eventType}
            onChange={(e) => setEditForm(prev => ({ ...prev, eventType: e.target.value }))}
            options={EVENT_TYPES}
          />
          <Input
            label="Event Date"
            type="date"
            value={editForm.eventDate}
            onChange={(e) => setEditForm(prev => ({ ...prev, eventDate: e.target.value }))}
            required
          />
          <Input
            label="Venue / Location"
            value={editForm.eventLocation}
            onChange={(e) => setEditForm(prev => ({ ...prev, eventLocation: e.target.value }))}
            required
          />
          <Input
            label="Number of Days"
            type="number"
            min="1"
            value={editForm.days}
            onChange={(e) => setEditForm(prev => ({ ...prev, days: e.target.value }))}
            required
          />
          <Select
            label="Selected Package"
            value={editForm.selectedPackageName}
            onChange={(e) => setEditForm(prev => ({ ...prev, selectedPackageName: e.target.value }))}
            options={packages.map(p => ({ label: p.name, value: p.name }))}
          />
          <label className="flex w-full flex-col gap-2 text-sm text-[var(--text-secondary)]">
            <span className="font-medium">Additional Message</span>
            <textarea
              rows="3"
              value={editForm.message}
              onChange={(e) => setEditForm(prev => ({ ...prev, message: e.target.value }))}
              className="w-full rounded-xl border border-[var(--card-border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition-all duration-400 focus:border-[var(--accent-pink)] focus:ring-2 focus:ring-[var(--accent-pink)]/10 resize-none"
            />
          </label>

          <Button type="submit" disabled={isUpdating} className="w-full mt-4">
            {isUpdating ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </CrudFormDrawer>
    </div>
  );
}

export default BookingsPage;
