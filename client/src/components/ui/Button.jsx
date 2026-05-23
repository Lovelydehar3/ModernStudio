import { memo } from "react";
import clsx from "clsx";

const Button = memo(function Button({
  type = "button",
  children,
  className = "",
  variant = "primary",
  disabled = false,
  ...props
}) {
  const variants = {
    primary:
      "bg-gradient-to-r from-[var(--accent-pink)] to-[var(--accent-purple)] text-white shadow-[0_4px_20px_rgba(216,167,177,0.25)] hover:shadow-[0_6px_28px_rgba(216,167,177,0.35)] hover:brightness-110",
    outline: "border border-[var(--card-border)] bg-[var(--surface)] text-[var(--text-primary)] hover:border-[var(--accent-pink)]/40 hover:bg-[var(--surface-hover)] hover:shadow-[0_0_20px_rgba(216,167,177,0.1)]",
    muted: "bg-[var(--text-primary)]/5 text-[var(--text-primary)] hover:bg-[var(--text-primary)]/10"
  };

  return (
    <button
      type={type}
      disabled={disabled}
      className={clsx(
        "inline-flex items-center justify-center rounded-xl px-6 py-3 text-xs font-bold tracking-[0.1em] uppercase transition-all duration-400 hover:scale-[1.04] active:scale-95 disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
});

export default Button;
