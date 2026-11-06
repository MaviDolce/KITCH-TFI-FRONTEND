import { MoreVertical, Plus } from "lucide-react"
import { Link } from "react-router-dom"
import IconButton from "../ui/IconButton"
import { recetaDetallePath } from "../../constants/paths"

function MealCell({ meal, fecha, turno, menuOpen, onToggleMenu, onAdd, onChange, onRemove }) {
  if (!meal) {
    return (
      <div className="flex min-h-[5.5rem] items-center justify-center rounded-2xl bg-surface/70 p-2">
        <button
          type="button"
          onClick={() => onAdd(fecha, turno)}
          aria-label={`Agregar comida el ${fecha}, ${turno}`}
          className="inline-flex size-11 items-center justify-center rounded-full bg-primary text-white transition-colors duration-150 hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <Plus size={16} strokeWidth={2.5} />
        </button>
      </div>
    )
  }

  return (
    <div
      data-meal-menu
      className="relative flex min-h-[5.5rem] flex-col rounded-2xl bg-surface p-2.5 shadow-sm"
    >
      <div className="flex items-start justify-between gap-1">
        <p className="line-clamp-2 text-sm font-semibold text-ink">{meal.titulo}</p>
        <IconButton
          label={`Opciones de ${meal.titulo}`}
          aria-expanded={menuOpen}
          aria-haspopup="menu"
          onClick={() => onToggleMenu()}
          className="shrink-0 text-muted"
        >
          <MoreVertical size={16} />
        </IconButton>
      </div>
      <p className="mt-auto pt-1 text-xs text-muted">{meal.tiempoPreparacionMinutos} min</p>

      {menuOpen ? (
        <div
          role="menu"
          className="absolute top-9 right-1 z-10 min-w-36 rounded-xl border border-line bg-surface py-1 shadow-md"
        >
          <Link
            role="menuitem"
            to={recetaDetallePath(meal.recetaId)}
            className="block min-h-11 px-3 py-2.5 text-sm text-ink hover:bg-canvas focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary"
          >
            Ver receta
          </Link>
          <button
            type="button"
            role="menuitem"
            className="block min-h-11 w-full px-3 py-2.5 text-left text-sm text-ink hover:bg-canvas focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary"
            onClick={() => onChange(meal)}
          >
            Cambiar receta
          </button>
          <button
            type="button"
            role="menuitem"
            className="block min-h-11 w-full px-3 py-2.5 text-left text-sm text-primary hover:bg-canvas focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary"
            onClick={() => onRemove(meal)}
          >
            Quitar
          </button>
        </div>
      ) : null}
    </div>
  )
}

export default MealCell
