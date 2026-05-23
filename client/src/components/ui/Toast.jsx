import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import clsx from "clsx";

const ICONS = {
  success: (
    <svg className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  error: (
    <svg className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  warning: (
    <svg className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
    </svg>
  ),
  info: (
    <svg className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
};

const STYLES = {
  success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  error: "border-red-500/30 bg-red-500/10 text-red-300",
  warning: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  info: "border-blue-500/30 bg-blue-500/10 text-blue-300"
};

export default function Toast({ id, message, type = "info", onDismiss }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Slide in
    requestAnimationFrame(() => {
      el.style.transform = "translateX(0)";
      el.style.opacity = "1";
    });
    // Auto dismiss
    const timer = setTimeout(() => onDismiss(id), 4000);
    return () => clearTimeout(timer);
  }, [id, onDismiss]);

  const handleDismiss = () => {
    const el = ref.current;
    if (el) {
      el.style.transform = "translateX(120%)";
      el.style.opacity = "0";
      setTimeout(() => onDismiss(id), 300);
    } else {
      onDismiss(id);
    }
  };

  return (
    <div
      ref={ref}
      role="alert"
      style={{ transform: "translateX(120%)", opacity: 0, transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)" }}
      className={clsx(
        "pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border px-4 py-3 shadow-2xl backdrop-blur-xl",
        STYLES[type] || STYLES.info
      )}
    >
      {ICONS[type] || ICONS.info}
      <p className="flex-1 text-sm font-medium leading-snug">{message}</p>
      <button
        onClick={handleDismiss}
        className="flex-shrink-0 rounded-lg p-0.5 opacity-60 transition-opacity hover:opacity-100"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
