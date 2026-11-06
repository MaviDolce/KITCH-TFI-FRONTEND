function FilterChip({ label, dot, selected, onClick }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`inline-flex h-11 shrink-0 items-center gap-2 rounded-full border px-3.5 text-sm font-semibold transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
        selected
          ? "border-primary bg-primary/10 text-primary"
          : "border-line bg-surface text-ink hover:bg-canvas"
      }`}
    >
      <span className={`size-2.5 rounded-full ${dot}`} aria-hidden="true" />
      {label}
    </button>
  )
}

export default FilterChip
