import { Minus, Plus, Square, SquareCheck } from "lucide-react"
import { formatCantidad } from "../../utils/stock"

function ShoppingItemCard({ item, onToggle, onIncrement, onDecrement }) {
  const bought = item.estaComprado

  return (
    <div className="flex items-center justify-between gap-3 rounded-full bg-surface px-4 py-2.5 shadow-sm">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          aria-pressed={bought}
          aria-label={bought ? `Desmarcar ${item.nombreArticulo}` : `Marcar ${item.nombreArticulo} como comprado`}
          onClick={() => onToggle(item)}
          className="inline-flex size-10 shrink-0 items-center justify-center rounded-full text-primary transition-colors duration-150 hover:bg-primary/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {bought ? <SquareCheck size={20} /> : <Square size={20} />}
        </button>
        <p
          className={`truncate font-medium ${bought ? "text-muted line-through" : "text-ink"}`}
        >
          {item.nombreArticulo}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          aria-label={`Restar ${item.nombreArticulo}`}
          onClick={() => onDecrement(item)}
          className="inline-flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors duration-150 hover:bg-primary/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <Minus size={14} strokeWidth={2.5} />
        </button>
        <span className="min-w-14 text-center text-sm font-medium text-ink">
          {formatCantidad(item.cantidadFaltante)} {item.unidadMedida}
        </span>
        <button
          type="button"
          aria-label={`Sumar ${item.nombreArticulo}`}
          onClick={() => onIncrement(item)}
          className="inline-flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors duration-150 hover:bg-primary/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <Plus size={14} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  )
}

export default ShoppingItemCard
