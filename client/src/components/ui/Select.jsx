import clsx from "clsx";

function Select({ label, options = [], className = "", ...props }) {
  return (
    <label className="flex w-full flex-col gap-2 text-sm text-[var(--text-secondary)]">
      {label ? <span className="font-medium">{label}</span> : null}
      <select
        className={clsx(
          "w-full rounded-xl border border-[var(--card-border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition-all duration-400 focus:border-[var(--accent-pink)] focus:ring-2 focus:ring-[var(--accent-pink)]/10",
          className
        )}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-[var(--surface)] text-[var(--text-primary)]">
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export default Select;
