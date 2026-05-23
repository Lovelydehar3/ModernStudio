import { memo } from "react";

const InlineError = memo(function InlineError({ message }) {
  if (!message) return null;
  return (
    <div className="mt-2 flex items-center gap-2 text-xs text-red-400 animate-fade-in-up" style={{ animationDuration: "0.3s" }}>
      <span className="inline-block w-1 h-1 rounded-full bg-red-400" />
      {message}
    </div>
  );
});

export default InlineError;
