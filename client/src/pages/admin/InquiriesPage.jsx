import { useEffect, useState } from "react";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import CrudFormDrawer from "../../components/admin/CrudFormDrawer";
import StatusPill from "../../components/admin/StatusPill";
import { inquiryApi } from "../../services/inquiryApi";
import { formatDateTime, extractApiError } from "../../lib/formatters";
import { Trash2, Eye, MessageSquare } from "lucide-react";

const STATUS_FILTERS = ["all", "unresolved", "resolved"];

function InquiriesPage() {
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");

  const fetchRows = async () => {
    try {
      const params = {};
      if (filterStatus !== "all") params.status = filterStatus;
      const response = await inquiryApi.getAdmin(params);
      setRows(response.data.data);
    } catch (error) {
      window.alert(extractApiError(error));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRows();
  }, [filterStatus]);

  const toggleResolve = async (row) => {
    try {
      await inquiryApi.resolve(row._id, { isResolved: !row.isResolved });
      await fetchRows();
    } catch (error) {
      window.alert(extractApiError(error));
    }
  };

  const openDetail = (row) => {
    setSelectedInquiry(row);
    setAdminNotes(row.adminNotes || "");
    setDrawerOpen(true);
  };

  const saveNotes = async () => {
    if (!selectedInquiry) return;
    try {
      await inquiryApi.resolve(selectedInquiry._id, {
        isResolved: selectedInquiry.isResolved,
        adminNotes
      });
      setDrawerOpen(false);
      await fetchRows();
    } catch (error) {
      window.alert(extractApiError(error));
    }
  };

  const handleDelete = async (row) => {
    if (!window.confirm(`Delete inquiry from ${row.name}?`)) return;
    try {
      await inquiryApi.remove(row._id);
      await fetchRows();
    } catch (error) {
      window.alert(extractApiError(error));
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="font-heading text-5xl uppercase">Manage Inquiries</h2>
        <p className="mt-2 text-sm text-[var(--text-muted)]">Track customer inquiries and manage follow-up status.</p>
      </div>

      {/* Status Filter Tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        {STATUS_FILTERS.map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
              filterStatus === status
                ? "bg-gradient-to-r from-[var(--accent-pink)] to-[var(--accent-purple)] text-white shadow-btn-glow"
                : "bg-[var(--accent-pink)]/[0.06] text-[var(--text-muted)] hover:bg-[var(--accent-pink)]/[0.1] hover:text-[var(--accent-pink)]"
            }`}
          >
            {status}
          </button>
        ))}
        <span className="self-center text-xs text-[var(--text-muted)] ml-2">
          {rows.length} result{rows.length !== 1 ? "s" : ""}
        </span>
      </div>

      {isLoading ? (
        <Card>Loading inquiries...</Card>
      ) : rows.length === 0 ? (
        <Card>
          <div className="flex flex-col items-center gap-3 py-10 text-center">
            <MessageSquare className="h-12 w-12 text-[var(--text-muted)]" />
            <p className="text-sm text-[var(--text-muted)]">No inquiries found.</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {rows.map((row) => (
            <div
              key={row._id}
              className="group flex items-center gap-4 rounded-xl border border-[var(--accent-pink)]/10 bg-[var(--surface)] p-4 transition-all duration-300 hover:border-[var(--accent-pink)]/30 hover:shadow-[0_4px_20px_rgba(194,109,186,0.08)]"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <h3 className="text-sm font-semibold text-[var(--text-primary)]">{row.name}</h3>
                  <StatusPill value={row.isResolved} />
                </div>
                <p className="mt-1 truncate text-xs text-[var(--text-muted)]">{row.email} {row.phone ? `• ${row.phone}` : ""}</p>
                <p className="mt-1 truncate text-sm text-[var(--text-secondary)]">{row.message}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] text-[var(--text-muted)] hidden sm:block">{formatDateTime(row.createdAt)}</span>
                <button
                  onClick={() => openDetail(row)}
                  className="rounded-lg border border-[var(--accent-pink)]/10 p-2 text-[var(--text-muted)] transition-all hover:border-[var(--accent-pink)]/30 hover:text-[var(--accent-pink)]"
                  title="View Details"
                >
                  <Eye className="h-4 w-4" />
                </button>
                <button
                  onClick={() => toggleResolve(row)}
                  className="rounded-lg border border-[var(--accent-pink)]/10 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] transition-all hover:border-[var(--accent-pink)]/30 hover:text-[var(--accent-pink)]"
                >
                  {row.isResolved ? "Reopen" : "Resolve"}
                </button>
                <button
                  onClick={() => handleDelete(row)}
                  className="rounded-lg border border-red-200 p-2 text-red-300 transition-all hover:border-red-300 hover:text-red-500"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Drawer */}
      <CrudFormDrawer
        open={drawerOpen}
        title="Inquiry Details"
        onClose={() => setDrawerOpen(false)}
      >
        {selectedInquiry && (
          <div className="space-y-6">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Name</label>
              <p className="mt-1 text-sm text-[var(--text-primary)]">{selectedInquiry.name}</p>
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Email</label>
              <p className="mt-1 text-sm text-[var(--text-primary)]">{selectedInquiry.email}</p>
            </div>
            {selectedInquiry.phone && (
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Phone</label>
                <p className="mt-1 text-sm text-[var(--text-primary)]">{selectedInquiry.phone}</p>
              </div>
            )}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Source</label>
              <p className="mt-1 text-sm text-[var(--text-primary)]">{selectedInquiry.sourcePage}</p>
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Message</label>
              <p className="mt-1 whitespace-pre-wrap text-sm text-[var(--text-secondary)] leading-relaxed">{selectedInquiry.message}</p>
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Received</label>
              <p className="mt-1 text-sm text-[var(--text-primary)]">{formatDateTime(selectedInquiry.createdAt)}</p>
            </div>

            <div className="border-t border-[var(--accent-pink)]/10 pt-6">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Admin Notes</label>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Add follow-up notes..."
                rows={4}
                className="mt-2 w-full rounded-xl border border-[var(--accent-pink)]/15 bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition-all duration-300 focus:border-[var(--accent-pink)] focus:shadow-[0_0_0_3px_rgba(194,109,186,0.12)] placeholder:text-[var(--text-muted)]"
              />
              <Button onClick={saveNotes} className="mt-3 w-full">
                Save Notes
              </Button>
            </div>
          </div>
        )}
      </CrudFormDrawer>
    </div>
  );
}

export default InquiriesPage;
