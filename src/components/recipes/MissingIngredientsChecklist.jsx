import Spinner from "../ui/Spinner"
import { formatCantidadAjustada } from "../../utils/porciones"

function MissingIngredientsChecklist({ faltantes, marcandoId, onMarcar }) {
  return (
    <ul className="grid gap-2">
      {faltantes.map((item) => {
        const marcando = marcandoId === item.ingredienteId
        return (
          <li key={item.ingredienteId}>
            <label className="flex cursor-pointer items-center gap-3 rounded-xl bg-surface px-3 py-2 text-sm text-ink">
              <input
                type="checkbox"
                className="size-4 accent-primary"
                checked={false}
                disabled={marcandoId != null}
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
