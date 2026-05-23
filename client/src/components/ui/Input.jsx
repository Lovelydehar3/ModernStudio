import clsx from "clsx";

function Input({ label, className = "", ...props }) {
  return (
    <label className="flex w-full flex-col gap-2 text-sm text-[var(--text-secondary)]">
      {label ? <span className="font-medium">{label}</span> : null}
      <input
        className={clsx(
          "w-full rounded-xl border border-[var(--card-border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition-all duration-400 focus:border-[var(--accent-pink)] focus:shadow-[0_0_0_3px_rgba(216,167,177,0.1)] placeholder:text-[var(--text-muted)]",
          className
        )}
        {...props}
      />
    </label>
  );
}

export default Input;
