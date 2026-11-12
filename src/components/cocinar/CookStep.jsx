import Card from "../ui/Card"

function CookStep({ paso, total, done = false, onToggleDone }) {
  const progress = total > 0 ? (paso.numeroPaso / total) * 100 : 0
  const checkboxId = `paso-${paso.numeroPaso}-hecho`

  return (
    <Card className="max-w-2xl">
      <p className="text-sm font-semibold text-primary">
        Paso {paso.numeroPaso} de {total}
      </p>
      <div className="mt-3 h-1.5 rounded-full bg-line" aria-hidden="true">
        <div className="h-full rounded-full bg-primary" style={{ width: `${progress}%` }} />
      </div>
      <p
        className={`mt-3 text-xl font-bold leading-snug tracking-tight ${done ? "text-muted line-through" : "text-ink"}`}
      >
        {paso.descripcionPaso}
      </p>
      {onToggleDone ? (
        <label htmlFor={checkboxId} className="mt-4 inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-ink">
          <input
            id={checkboxId}
            type="checkbox"
            className="size-5 accent-primary"
            checked={done}
            onChange={() => onToggleDone(paso.numeroPaso)}
          />
          Paso completado
        </label>
      ) : null}
    </Card>
  )
}

export default CookStep
