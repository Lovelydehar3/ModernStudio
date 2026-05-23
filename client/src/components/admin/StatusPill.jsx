import { memo } from "react";
import clsx from "clsx";

const statusMap = {
  pending: "bg-amber-500/15 text-amber-700 border-amber-500/30",
  accepted: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
  rejected: "bg-rose-500/15 text-rose-700 border-rose-500/30",
  true: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
  false: "bg-[var(--accent-pink)]/10 text-[var(--text-muted)] border-[var(--accent-pink)]/20"
};

const StatusPill = memo(function StatusPill({ value }) {
  const label = String(value);
  const key = label.toLowerCase();
  return (
    <span
      className={clsx(
        "inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold capitalize",
        statusMap[key] || "border-[var(--accent-pink)]/20 bg-[var(--accent-pink)]/10 text-[var(--text-primary)]"
      )}
    >
      {label}
    </span>
  );
});

export default StatusPill;
