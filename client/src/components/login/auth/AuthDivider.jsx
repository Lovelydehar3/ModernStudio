import { memo } from "react";

const AuthDivider = memo(function AuthDivider({ text = "or" }) {
  return (
    <div className="flex items-center gap-4 my-6">
      <div className="flex-1 h-px bg-[var(--accent-pink)]/10" />
      <span className="text-xs uppercase tracking-widest text-[var(--text-muted)]">{text}</span>
      <div className="flex-1 h-px bg-[var(--accent-pink)]/10" />
    </div>
  );
});

export default AuthDivider;
