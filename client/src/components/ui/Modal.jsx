import Button from "./Button";

function Modal({ open, title, onClose, children }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl rounded-2xl border border-[var(--accent-pink)]/[0.15] bg-[var(--surface)] p-8 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="font-heading text-2xl text-[var(--text-primary)]">{title}</h3>
          <Button variant="muted" onClick={onClose}>
            Close
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default Modal;
