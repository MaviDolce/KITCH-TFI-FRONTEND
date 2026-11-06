import { useState } from "react"
import { Check, Minus } from "lucide-react"
import SubstitutePicker from "../cocinar/SubstitutePicker"
import TextLink from "../ui/TextLink"
import { formatCantidadAjustada } from "../../utils/porciones"

function formatCantidad(ingrediente) {
  const cantidad = ingrediente.cantidadAjustada ?? ingrediente.cantidad
  return `${formatCantidadAjustada(cantidad)} ${ingrediente.unidad}`
}

function IngredientRow({ ingrediente, selected, onSelect }) {
  const [open, setOpen] = useState(Boolean(selected))
  const sustitutos = ingrediente.sustitutos ?? []
  const hasSustitutos = sustitutos.length > 0
  const nombre = ingrediente.nombreMostrado ?? ingrediente.nombre

  return (
    <li className="rounded-2xl bg-canvas px-4 py-3">
      <div className="flex items-center justify-between gap-3">
        <span className="flex min-w-0 items-center gap-3">
          <span
            className={`flex size-8 shrink-0 items-center justify-center rounded-full ${
              ingrediente.enAlacena ? "bg-success/15 text-success" : "bg-primary/10 text-primary"
            }`}
            aria-hidden="true"
          >
            {ingrediente.enAlacena ? <Check size={16} /> : <Minus size={16} />}
          </span>
          <span className="min-w-0">
            <span className="block truncate font-medium text-ink">{nombre}</span>
            {ingrediente.reemplazaA ? (
              <span className="block text-xs text-muted">en lugar de {ingrediente.reemplazaA}</span>
            ) : null}
          </span>
        </span>
        <span className="shrink-0 text-sm text-muted">{formatCantidad(ingrediente)}</span>
      </div>

      {hasSustitutos && onSelect ? (
        <div className="mt-2 pl-11">
          <TextLink
            type="button"
            aria-expanded={open}
            onClick={() => setOpen((current) => !current)}
          >
            {open ? "Ocultar reemplazos" : selected ? `Usando ${selected.nombre}` : "Ver reemplazos"}
          </TextLink>
          {open ? (
            <SubstitutePicker
              embedded
              ingrediente={ingrediente.nombre}
              sustitutos={sustitutos}
              selected={selected}
              onSelect={(item) => onSelect(ingrediente.nombre, item)}
            />
          ) : null}
        </div>
      ) : null}
    </li>
  )
}

function IngredientList({ ingredientes, replacements = {}, onSelectReplacement }) {
  return (
    <ul className="grid gap-2">
      {ingredientes.map((ingrediente) => (
        <IngredientRow
          key={ingrediente.ingredienteId ?? ingrediente.nombre}
          ingrediente={ingrediente}
          selected={replacements[ingrediente.nombre]}
          onSelect={onSelectReplacement}
        />
      ))}
    </ul>
  )
}

export default IngredientList
