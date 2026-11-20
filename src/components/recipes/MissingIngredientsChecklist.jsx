import Spinner from "../ui/Spinner"
import { formatCantidadAjustada } from "../../utils/porciones"

function MissingIngredientsChecklist({ faltantes, marcandoId, onMarcar, exiting = false }) {
  return (
    <ul className="grid gap-2">
      {faltantes.map((item, index) => {
        const marcando = marcandoId === item.ingredienteId
        return (
          <li
            key={item.ingredienteId}
            className={exiting ? "animate-checklist-exit" : undefined}
            style={exiting ? { animationDelay: `${index * 45}ms` } : undefined}
          >
            <label
              className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors duration-200 ${
                exiting
                  ? "cursor-default bg-success/15 text-success line-through"
                  : "cursor-pointer bg-surface text-ink"
              }`}
            >
              <input
                type="checkbox"
                className={`size-4 ${exiting ? "accent-success" : "accent-primary"}`}
                checked={exiting}
                disabled={exiting || marcandoId != null}
                onChange={() => onMarcar(item)}
              />
              <span className="flex-1">
                <span className="font-semibold">{item.nombre}</span>
                {": "}
                {formatCantidadAjustada(item.cantidadFaltante)} {item.unidadMedida}
              </span>
              {marcando ? <Spinner size={14} className="text-primary" /> : null}
            </label>
          </li>
        )
      })}
    </ul>
  )
}

export default MissingIngredientsChecklist
