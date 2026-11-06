import Card from "../ui/Card"

function CookStep({ paso, total }) {
  const progress = total > 0 ? (paso.numeroPaso / total) * 100 : 0

  return (
    <Card className="max-w-2xl">
      <p className="text-sm font-semibold text-primary">
        Paso {paso.numeroPaso} de {total}
      </p>
      <div className="mt-3 h-1.5 rounded-full bg-line" aria-hidden="true">
        <div className="h-full rounded-full bg-primary" style={{ width: `${progress}%` }} />
      </div>
      <p className="mt-3 text-xl font-bold leading-snug tracking-tight text-ink">
        {paso.descripcionPaso}
      </p>
    </Card>
  )
}

export default CookStep
