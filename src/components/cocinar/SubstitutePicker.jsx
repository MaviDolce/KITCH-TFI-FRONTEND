import Button from "../ui/Button"
import Card from "../ui/Card"

function SubstitutePicker({ ingrediente, sustitutos, selected, onSelect, embedded = false }) {
  const body = (
    <>
      {embedded ? null : (
        <p className="text-sm font-semibold text-primary">Reemplazos para {ingrediente}</p>
      )}
      {sustitutos.length === 0 ? (
        <p className={`${embedded ? "" : "mt-3"} text-sm text-muted`}>
          No hay sustitutos cargados para este ingrediente.
        </p>
      ) : (
        <ul className={embedded ? "space-y-3" : "mt-3 space-y-3"}>
          {sustitutos.map((item) => {
            const active = selected?.nombre === item.nombre
            return (
              <li
                key={item.nombre}
                className={`flex flex-col gap-2 rounded-2xl px-4 py-3 sm:flex-row sm:items-center sm:justify-between ${
                  embedded ? "bg-surface" : "bg-canvas"
                }`}
              >
                <div>
                  <p className="text-sm font-semibold text-ink">{item.nombre}</p>
                  {item.notas ? <p className="mt-0.5 text-sm text-muted">{item.notas}</p> : null}
                  {item.hayMasConProfesional ? (
                    <p className="mt-1 text-xs text-muted">Hay más reemplazos en el plan Profesional.</p>
                  ) : null}
                  <p className="mt-1 text-xs font-medium text-primary">
                    {item.disponibleEnAlacena ? "Lo tenés en tu alacena" : "No está en tu alacena"}
                  </p>
                </div>
                <Button
                  type="button"
                  size="md"
                  variant={active ? "primary" : "outline"}
                  onClick={() => onSelect(active ? null : item)}
                >
                  {active ? "Usando" : "Usar"}
                </Button>
              </li>
            )
          })}
        </ul>
      )}
    </>
  )

  if (embedded) {
    return <div className="mt-3">{body}</div>
  }

  return <Card className="max-w-2xl">{body}</Card>
}

export default SubstitutePicker
