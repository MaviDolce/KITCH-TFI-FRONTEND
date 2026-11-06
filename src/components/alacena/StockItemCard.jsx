import { Minus, Plus } from "lucide-react"
import { formatCaducidad, formatCantidad, isExpiringSoon } from "../../utils/stock"

function StockItemCard({ item, onIncrement, onDecrement }) {
  const expiring = isExpiringSoon(item.fechaCaducidad)

  return (
    <div
      className={`flex items-center justify-between gap-3 rounded-full px-4 py-2.5 shadow-sm ${
        expiring ? "bg-ai" : "bg-surface"
      }`}
    >
      <div className="min-w-0">
        <p className="truncate font-medium text-ink">
          {item.nombreIngrediente} - {formatCantidad(item.cantidad)} {item.unidadMedida}
        </p>
        {item.fechaCaducidad ? (
          <p className={`text-xs ${expiring ? "font-medium text-warning" : "text-muted"}`}>
            Vence {formatCaducidad(item.fechaCaducidad)}
          </p>
        ) : null}
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          aria-label={`Restar ${item.nombreIngrediente}`}
          onClick={() => onDecrement(item)}
          className="inline-flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors duration-150 hover:bg-primary/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <Minus size={14} strokeWidth={2.5} />
        </button>
        <button
          type="button"
          aria-label={`Sumar ${item.nombreIngrediente}`}
          onClick={() => onIncrement(item)}
          className="inline-flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors duration-150 hover:bg-primary/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <Plus size={14} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  )
}

export default StockItemCard
