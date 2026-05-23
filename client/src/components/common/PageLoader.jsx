function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg-primary)]">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-[var(--accent-purple)] border-t-transparent" />
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--text-muted)]">Loading</p>
      </div>
    </div>
  );
}

export default PageLoader;
