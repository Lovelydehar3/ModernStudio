function Loader({ label = "Loading..." }) {
  return (
    <div className="flex min-h-[220px] items-center justify-center">
      <div className="rounded-xl border border-[var(--accent-pink)]/[0.15] bg-[var(--surface)] px-8 py-5 text-sm text-[var(--text-secondary)] shadow-sm">
        {label}
      </div>
    </div>
  );
}

export default Loader;
