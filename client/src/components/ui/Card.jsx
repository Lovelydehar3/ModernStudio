import { memo } from "react";
import clsx from "clsx";

const Card = memo(function Card({ className = "", isActive = false, children, ...props }) {
  return (
    <div
      className={clsx(
        "relative rounded-2xl border border-[var(--card-border)] bg-[var(--surface)] p-8 transition-all duration-500",
        "hover:-translate-y-[8px] hover:border-[var(--accent-pink)]/20",
        "hover:shadow-[0_16px_40px_rgba(31,31,31,0.06),_0_0_24px_rgba(216,167,177,0.08)]",
        isActive && "border-[var(--accent-pink)]/15 bg-[var(--surface-hover)] before:absolute before:inset-0 before:bg-gradient-to-r before:from-[var(--accent-pink)]/[0.04] before:to-transparent before:pointer-events-none before:rounded-2xl",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

export default Card;
