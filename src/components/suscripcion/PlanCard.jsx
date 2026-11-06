import { Check } from "lucide-react"
import Card from "../ui/Card"

function PlanCard({ title, price, hint, features, featured = false, current = false }) {
  return (
    <Card
      tone={featured ? "ai" : "surface"}
      className={`flex flex-col ${featured ? "ring-2 ring-accent" : ""}`}
    >
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold tracking-tight text-ink">{title}</h2>
        {current ? (
          <span className="rounded-full bg-line px-3 py-1 text-xs font-semibold text-muted">
            Actual
          </span>
        ) : null}
      </div>
      <p className="mt-2 text-2xl font-bold tracking-tight text-ink">{price}</p>
      {hint ? <p className="mt-1 text-sm text-muted">{hint}</p> : null}
      <ul className="mt-5 flex flex-col gap-2">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm text-ink">
            <Check size={16} className="mt-0.5 shrink-0 text-success" aria-hidden="true" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </Card>
  )
}

export default PlanCard
