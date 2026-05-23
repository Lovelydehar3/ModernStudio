import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

/**
 * A modal dialog to confirm a booking status change and optionally add a note.
 * Replaces window.prompt() and window.confirm() for accessible, styled UX.
 */
export default function StatusNoteModal({ isOpen, status, clientName, onConfirm, onCancel }) {
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef(null);
  const cancelRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setNote("");
      setIsSubmitting(false);
      // Focus the textarea after open animation
      const t = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  // Trap focus inside modal and handle Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await onConfirm(note.trim());
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusLabels = {
    accepted: { label: "Accept", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/20" },
    rejected: { label: "Reject", color: "text-red-400", bg: "bg-red-500/10 border-red-500/20 hover:bg-red-500/20" }
  };
  const cfg = statusLabels[status] || { label: "Confirm", color: "text-[var(--accent-pink)]", bg: "bg-[var(--accent-pink)]/10 border-[var(--accent-pink)]/20" };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="status-modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-[var(--card-border)] bg-[var(--surface)] p-6 shadow-2xl">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 id="status-modal-title" className="font-heading text-xl uppercase tracking-wider text-[var(--text-primary)]">
              {cfg.label} Booking
            </h2>
            {clientName && (
              <p className="mt-1 text-sm text-[var(--text-muted)]">
                Client: <span className="text-[var(--text-primary)]">{clientName}</span>
              </p>
            )}
          </div>
          <button
            onClick={onCancel}
            aria-label="Cancel"
            className="rounded-lg p-1.5 text-[var(--text-muted)] transition-colors hover:bg-[var(--card-border)] hover:text-[var(--text-primary)]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-[var(--text-secondary)]">
            Note <span className="text-[var(--text-muted)] font-normal">(optional)</span>
          </span>
          <textarea
            ref={inputRef}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={`Add a note for the ${status} status...`}
            rows={3}
            maxLength={500}
            className="w-full resize-none rounded-xl border border-[var(--card-border)] bg-[var(--bg-primary)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition-all duration-300 placeholder:text-[var(--text-muted)] focus:border-[var(--accent-pink)] focus:ring-2 focus:ring-[var(--accent-pink)]/10"
          />
          <span className="text-right text-xs text-[var(--text-muted)]">{note.length}/500</span>
        </label>

        <div className="mt-5 flex gap-3">
          <button
            ref={cancelRef}
            onClick={onCancel}
            className="flex-1 rounded-xl border border-[var(--card-border)] bg-transparent px-4 py-2.5 text-sm font-medium text-[var(--text-secondary)] transition-all duration-300 hover:bg-[var(--card-border)]"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isSubmitting}
            className={`flex-1 rounded-xl border px-4 py-2.5 text-sm font-bold uppercase tracking-wider transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${cfg.color} ${cfg.bg}`}
          >
            {isSubmitting ? "Processing..." : `Confirm ${cfg.label}`}
          </button>
        </div>
      </div>
    </div>
  );
}
