import { useEffect, useMemo, useState, useCallback } from "react";
import Button from "../../components/ui/Button";
import DataTable from "../../components/admin/DataTable";
import StatusPill from "../../components/admin/StatusPill";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import CrudFormDrawer from "../../components/admin/CrudFormDrawer";
import StatusNoteModal from "../../components/admin/StatusNoteModal";
import { bookingApi } from "../../services/bookingApi";
import { packageApi } from "../../services/packageApi";
import { packageDefaults } from "../../constants/packageDefaults";
import { formatDateTime, extractApiError } from "../../lib/formatters";
import { useToast } from "../../components/ui/ToastContext";
import { StatCardSkeleton, TableRowSkeleton } from "../../components/ui/Skeleton";

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
  const [searchQuery, setSearchQuery] = useState("");
  
  // Pagination state
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });

  // Drawer & Edit states
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [editForm, setEditForm] = useState(INITIAL_FORM);
  const [editingId, setEditingId] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Status modal state — replaces window.prompt()
  const [statusModal, setStatusModal] = useState({ open: false, row: null, status: "" });

  // Delete confirmation state — replaces window.confirm()
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchRows = useCallback(async (page = 1) => {
    setIsLoading(true);
    try {
      const params = { page, limit: 20 };
      if (statusFilter) params.status = statusFilter;
      if (searchQuery.trim()) params.search = searchQuery.trim();
      const response = await bookingApi.getAdmin(params);
      const data = response.data.data;
      // Support both paginated and non-paginated response shapes
      if (data?.bookings) {
        setRows(data.bookings);
        setPagination({
          page: data.pagination?.page || 1,
          totalPages: data.pagination?.totalPages || 1,
          total: data.pagination?.total || data.bookings.length
        });
      } else {
        // Fallback for non-paginated API response
        setRows(Array.isArray(data) ? data : []);
        setPagination({ page: 1, totalPages: 1, total: Array.isArray(data) ? data.length : 0 });
      }
    } catch (error) {
      showToast(extractApiError(error), "error");
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, searchQuery, showToast]);

  const fetchPackages = useCallback(async () => {
    try {
      const response = await packageApi.getPublic();
      const data = response.data.data?.length ? response.data.data : packageDefaults;
      setPackages(data);
    } catch {
      setPackages(packageDefaults);
    }
  }, []);

  useEffect(() => {
    fetchRows(1);
  }, [fetchRows]);

  useEffect(() => {
    fetchPackages();
  }, [fetchPackages]);

  // Status update via modal instead of window.prompt
  const openStatusModal = useCallback((row, status) => {
    setStatusModal({ open: true, row, status });
  }, []);

  const handleStatusConfirm = useCallback(async (note) => {
    const { row, status } = statusModal;
    try {
      await bookingApi.updateStatus(row._id, { status, note });
      showToast(`Booking ${status} successfully`, "success");
      setStatusModal({ open: false, row: null, status: "" });
      await fetchRows(pagination.page);
    } catch (error) {
      showToast(extractApiError(error), "error");
    }
  }, [statusModal, showToast, fetchRows, pagination.page]);

  const handleStatusCancel = useCallback(() => {
    setStatusModal({ open: false, row: null, status: "" });
  }, []);

  const handleEditClick = useCallback((row) => {
    setEditingId(row._id);
    let rawDate = "";
    if (row.eventDate) {
      try {
        rawDate = new Date(row.eventDate).toISOString().split("T")[0];
      } catch {
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
  }, []);

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
      await fetchRows(pagination.page);
    } catch (error) {
      showToast(extractApiError(error), "error");
    } finally {
      setIsUpdating(false);
    }
  };

  // Delete via confirmation modal instead of window.confirm
  const handleDeleteClick = useCallback((row) => {
    setDeleteTarget(row);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteTarget) return;
    try {
      await bookingApi.remove(deleteTarget._id);
      showToast("Booking deleted successfully", "success");
      setDeleteTarget(null);
      await fetchRows(pagination.page);
    } catch (error) {
      showToast(extractApiError(error), "error");
    }
  }, [deleteTarget, showToast, fetchRows, pagination.page]);

  const columns = useMemo(
    () => [
      { key: "name", label: "Client" },
      { key: "email", label: "Email" },
      { key: "phone", label: "Phone" },
      {
        key: "selectedPackage",
        label: "Package",
        render: (row) => row.selectedPackage?.name || "-"
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
                <Button variant="muted" size="sm" onClick={() => openStatusModal(row, "accepted")} className="px-2.5 py-1 text-xs">
                  Accept
                </Button>
                <Button variant="outline" size="sm" onClick={() => openStatusModal(row, "rejected")} className="px-2.5 py-1 text-xs">
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
    [openStatusModal, handleEditClick, handleDeleteClick]
  );

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-5xl uppercase">Manage Bookings</h2>
          <p className="text-sm text-[var(--text-muted)]">View, accept, reject, edit, or delete bookings and track updates.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="rounded-xl border border-[var(--accent-pink)]/10 bg-[var(--surface)] px-4 py-2 text-sm text-[var(--text-primary)] outline-none transition-all duration-300 focus:border-[var(--accent-purple)] focus:ring-2 focus:ring-[var(--accent-purple)]/30 placeholder:text-[var(--text-muted)] w-64"
          />

          {/* Status filter */}
          <label className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">
            Status
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="ml-2 rounded-xl border border-[var(--accent-pink)]/10 bg-[var(--surface)] px-4 py-2 text-sm text-[var(--text-primary)] outline-none transition-all duration-300 focus:border-[var(--accent-purple)] focus:ring-2 focus:ring-[var(--accent-purple)]/30"
            >
              <option value="" className="bg-[var(--surface)]">All</option>
              <option value="pending" className="bg-[var(--surface)]">Pending</option>
              <option value="accepted" className="bg-[var(--surface)]">Accepted</option>
              <option value="rejected" className="bg-[var(--surface)]">Rejected</option>
            </select>
          </label>
        </div>
      </div>

      {/* Loading skeleton */}
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
        <DataTable columns={columns} rows={rows} emptyLabel="No bookings found. When clients submit booking requests, they'll appear here." />
      )}

      {/* Pagination controls */}
      {!isLoading && pagination.totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-xs text-[var(--text-muted)]">
            Showing page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page <= 1}
              onClick={() => fetchRows(pagination.page - 1)}
              className="px-3 py-1.5 text-xs"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => fetchRows(pagination.page + 1)}
              className="px-3 py-1.5 text-xs"
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Status Note Modal — replaces window.prompt() */}
      <StatusNoteModal
        isOpen={statusModal.open}
        status={statusModal.status}
        clientName={statusModal.row?.name}
        onConfirm={handleStatusConfirm}
        onCancel={handleStatusCancel}
      />

      {/* Delete Confirmation Modal — replaces window.confirm() */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setDeleteTarget(null)} aria-hidden="true" />
          <div className="relative z-10 w-full max-w-sm rounded-2xl border border-[var(--card-border)] bg-[var(--surface)] p-6 shadow-2xl">
            <h3 className="font-heading text-xl uppercase tracking-wider text-[var(--text-primary)]">Delete Booking</h3>
            <p className="mt-3 text-sm text-[var(--text-secondary)]">
              Are you sure you want to delete the booking for <strong className="text-[var(--text-primary)]">{deleteTarget.name}</strong>? This action cannot be undone.
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
