function Badge({ children, className = "" }) {
  return (
    <span
      className={`inline-flex text-[11px] font-semibold tracking-[0.08em] text-primary uppercase ${className}`}
    >
      {children}
    </span>
  )
}

export default Badge
