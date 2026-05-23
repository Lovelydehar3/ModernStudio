import clsx from "clsx";
import Button from "../ui/Button";

function CrudFormDrawer({ open, title, onClose, children }) {
  return (
    <div
      className={clsx(
        "fixed inset-0 z-[80] transition-all duration-300",
        open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
      )}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[var(--bg-primary)]/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer panel */}
      <div
        className={clsx(
          "absolute right-0 top-0 h-full w-full max-w-xl transform border-l border-[var(--accent-pink)]/10 bg-[var(--surface)] p-8 shadow-2xl transition-all duration-300",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="mb-7 flex items-center justify-between">
          <div>
            <h3 className="font-heading text-4xl uppercase text-[var(--text-primary)]">{title}</h3>
            <span className="mt-1 block h-[2px] w-12 rounded-full bg-gradient-to-r from-[var(--accent-pink)] to-[var(--accent-purple)]" />
          </div>
          <Button variant="muted" onClick={onClose} className="text-xs">
            ✕ Close
          </Button>
        </div>
        <div className="h-[calc(100%-6rem)] overflow-y-auto pr-1">{children}</div>
      </div>
    </div>
  );
}

export default CrudFormDrawer;
