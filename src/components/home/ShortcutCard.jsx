import { Link } from "react-router-dom"

const ACCENTS = {
  primary: "bg-primary",
  success: "bg-success",
  accent: "bg-accent",
  warning: "bg-warning",
}

function ShortcutCard({ to, title, description, accent = "primary" }) {
  return (
    <Link
      to={to}
      className="flex flex-col overflow-hidden rounded-3xl bg-surface shadow-sm transition-transform duration-150 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      <span className={`block h-1 ${ACCENTS[accent]}`} aria-hidden="true" />
      <span className="flex flex-1 flex-col p-5">
        <span className="text-lg font-bold tracking-tight text-ink">{title}</span>
        <span className="mt-1 text-sm leading-relaxed text-muted">{description}</span>
        <span className="mt-4 text-sm font-semibold text-primary">Abrir →</span>
      </span>
    </Link>
  )
}

export default ShortcutCard
