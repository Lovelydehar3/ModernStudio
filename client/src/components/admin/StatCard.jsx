const StatCard = ({ label, value }) => (
  <div className="rounded-2xl border border-[var(--accent-pink)]/10 bg-[var(--surface)] p-5 backdrop-blur-sm transition-all duration-300 hover:bg-[var(--accent-pink)]/[0.06]">
    <p className="text-sm text-text-muted">{label}</p>
    <p className="mt-3 font-display text-4xl font-bold text-text-primary">{value}</p>
  </div>
);

export default StatCard;
