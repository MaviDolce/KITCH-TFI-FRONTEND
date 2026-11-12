import Card from "../ui/Card"
import { formatCantidad } from "../../utils/stock"

function StockPreview({ preview, cantidades, onChangeCantidad, embedded = false }) {
  if (!preview) {
    return null
  }

  const editable = Boolean(cantidades && onChangeCantidad)

  const body = (
    <>
      <h2 className="text-xl font-bold tracking-tight text-ink">Descuento de alacena</h2>
      <p className="mt-1 text-sm text-muted">
        Previsualización para {preview.porcionesCocinadas} porciones de {preview.receta}.
        {editable ? " Podés ajustar lo que realmente usaste." : ""}
      </p>
      <ul className="mt-4 grid gap-2">
        {preview.ingredientes.map((item) => {
          const inputId = `cantidad-usada-${item.ingredienteId}`
          return (
            <li
              key={`${item.ingredienteId}-${item.reemplazaA ?? ""}`}
              className="flex flex-col gap-2 rounded-2xl bg-canvas px-4 py-3 sm:flex-row sm:items-start sm:justify-between"
            >
              <div className="min-w-0">
                <p className="font-medium text-ink">{item.nombre}</p>
                {item.reemplazaA ? (
                  <p className="text-xs text-muted">Reemplaza {item.reemplazaA}</p>
                ) : null}
                {!item.unidadCompatible ? (
                  <p className="text-xs text-muted">
                    En tu alacena está en {item.unidadEnAlacena}; no se descuenta automáticamente.
                  </p>
                ) : null}
              </div>
              <div className="shrink-0 text-sm text-muted sm:text-right">
                {editable ? (
                  <label htmlFor={inputId} className="inline-flex items-center gap-2">
                    <span className="sr-only">Cantidad usada de {item.nombre}</span>
                    <input
                      id={inputId}
                      type="number"
                      min="0"
                      step="any"
                      inputMode="decimal"
                      className="h-10 w-24 rounded-xl border border-line bg-surface px-3 text-right text-ink focus-visible:outline-2 focus-visible:outline-primary"
                      value={cantidades[item.ingredienteId] ?? ""}
                      onChange={(event) => onChangeCantidad(item.ingredienteId, event.target.value)}
                    />
                    <span>{item.unidadMedida}</span>
                  </label>
                ) : (
                  <span>
                    {formatCantidad(item.cantidadNecesaria)} {item.unidadMedida}
                  </span>
                )}
                {item.cantidadFaltante > 0 ? (
                  <span className="mt-1 block text-xs font-medium text-primary">
                    Faltan {formatCantidad(item.cantidadFaltante)}
                  </span>
                ) : item.unidadCompatible ? (
                  <span className="mt-1 block text-xs font-medium text-success">
                    Quedan {formatCantidad(item.cantidadPosterior)}
                  </span>
                ) : null}
              </div>
            </li>
          )
        })}
      </ul>
    </>
  )

  if (embedded) {
    return body
  }

  return <Card className="max-w-2xl">{body}</Card>
}

export default StockPreview
