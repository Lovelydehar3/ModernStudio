function SectionHeading({ eyebrow, title, description, large }) {
  return (
    <div className="mb-10 max-w-3xl">
      {eyebrow ? (
        <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.4em] text-[var(--accent-pink)]">{eyebrow}</p>
      ) : null}
      <h2 className={`font-heading leading-tight text-[var(--text-primary)] ${large ? "text-5xl md:text-7xl" : "text-4xl md:text-5xl"}`}>{title}</h2>
      {description ? <p className={`mt-5 text-[var(--text-muted)] ${large ? "text-lg" : ""}`}>{description}</p> : null}
    </div>
  );
}

export default SectionHeading;
