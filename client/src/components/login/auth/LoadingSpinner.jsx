import { memo } from "react";
import clsx from "clsx";

const LoadingSpinner = memo(function LoadingSpinner({ size = "md", className = "" }) {
  const sizes = {
    sm: "h-4 w-4 border-[1.5px]",
    md: "h-5 w-5 border-2",
    lg: "h-8 w-8 border-2"
  };

  return (
    <div
      className={clsx(
        "animate-spin rounded-full border-[var(--text-muted)] border-t-[var(--accent-pink)]",
        sizes[size] || sizes.md,
        className
      )}
    />
  );
});

export default LoadingSpinner;
