import Card from "../ui/Card"
import { formatCantidad } from "../../utils/stock"

function StockPreview({ preview }) {
  if (!preview) {
    return null
  }

  return (
    <Card className="max-w-2xl">
      <h2 className="text-xl font-bold tracking-tight text-ink">Descuento de alacena</h2>
      <p className="mt-1 text-sm text-muted">
        Previsualización para {preview.porcionesCocinadas} porciones de {preview.receta}.
      </p>
      <ul className="mt-4 grid gap-2">
        {preview.ingredientes.map((item) => (
          <li
            key={`${item.nombre}-${item.reemplazaA ?? ""}`}
            className="flex items-start justify-between gap-3 rounded-2xl bg-canvas px-4 py-3"
          >
            <div className="min-w-0">
              <p className="font-medium text-ink">{item.nombre}</p>
              {item.reemplazaA ? (
                <p className="text-xs text-muted">Reemplaza {item.reemplazaA}</p>
              ) : null}
            </div>
            <p className="shrink-0 text-right text-sm text-muted">
              {formatCantidad(item.cantidadNecesaria)} {item.unidadMedida}
              {item.cantidadFaltante > 0 ? (
                <span className="mt-1 block text-xs font-medium text-primary">
                  Faltan {formatCantidad(item.cantidadFaltante)}
                </span>
              ) : (
                <span className="mt-1 block text-xs font-medium text-success">
                  Quedan {formatCantidad(item.cantidadPosterior)}
                </span>
              )}
            </p>
          </li>
        ))}
      </ul>
    </Card>
  )
}

export default StockPreview
