import { Check } from "lucide-react"
import Card from "../ui/Card"

function CookStep({ paso, total, done = false, onToggleDone }) {
  const progress = total > 0 ? (paso.numeroPaso / total) * 100 : 0
  const checkboxId = `paso-${paso.numeroPaso}-hecho`

  return (
    <Card className="max-w-2xl">
      <p className="text-sm font-semibold text-primary">
        Paso {paso.numeroPaso} de {total}
      </p>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-line" aria-hidden="true">
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div key={paso.numeroPaso} className="animate-step-in">
        <p
          className={`mt-3 text-xl font-bold leading-snug tracking-tight transition-colors duration-200 ${done ? "text-muted line-through" : "text-ink"}`}
        >
          {paso.descripcionPaso}
        </p>
        {onToggleDone ? (
          <label
            htmlFor={checkboxId}
            className={`mt-5 inline-flex cursor-pointer items-center gap-2.5 rounded-2xl px-3.5 py-2.5 text-sm font-medium transition-colors duration-150 ${
              done ? "bg-success/10 text-success" : "bg-canvas text-ink hover:bg-line/70"
            }`}
          >
            <input
              id={checkboxId}
              type="checkbox"
              className="sr-only"
              checked={done}
              onChange={() => onToggleDone(paso.numeroPaso)}
            />
            <span
              className={`flex size-5 items-center justify-center rounded-md border transition-colors duration-150 ${
                done
                  ? "animate-badge-pop border-success bg-success text-white"
                  : "border-muted/40 bg-surface"
              }`}
              aria-hidden="true"
            >
              {done ? <Check size={13} strokeWidth={3} /> : null}
            </span>
            {done ? "Paso completado" : "Marcar paso como completado"}
          </label>
        ) : null}
      </div>
    </Card>
  )
}

export default CookStep
