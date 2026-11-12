import { useState } from "react"
import { Check, Minus } from "lucide-react"
import SubstitutePicker from "../cocinar/SubstitutePicker"
import Spinner from "../ui/Spinner"
import TextLink from "../ui/TextLink"
import { formatCantidadAjustada } from "../../utils/porciones"

function formatCantidad(ingrediente) {
  const cantidad = ingrediente.cantidadAjustada ?? ingrediente.cantidad
  return `${formatCantidadAjustada(cantidad)} ${ingrediente.unidad}`
}

function IngredientRow({ ingrediente, selected, sugerencias, onBuscar, onSelect }) {
  const [open, setOpen] = useState(Boolean(selected))
  const nombre = ingrediente.nombreMostrado ?? ingrediente.nombre
  const cargando = sugerencias?.loading
  const items = sugerencias?.items

  function handleToggle() {
    const next = !open
    setOpen(next)
    if (next && !items && !cargando) {
      onBuscar(ingrediente)
    }
  }

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
            {ingrediente.cantidadFaltante > 0 ? (
              <span className="block text-xs font-medium text-primary">
                Te faltan {formatCantidadAjustada(ingrediente.cantidadFaltante)} {ingrediente.unidad}
              </span>
            ) : null}
          </span>
        </span>
        <span className="shrink-0 text-sm text-muted">{formatCantidad(ingrediente)}</span>
      </div>

      {onBuscar && onSelect ? (
        <div className="mt-2 pl-11">
          <TextLink type="button" aria-expanded={open} onClick={handleToggle}>
            {open ? "Ocultar reemplazos" : selected ? `Usando ${selected.nombre}` : "Buscar reemplazos"}
          </TextLink>
          {open ? (
            cargando ? (
              <p className="mt-3 inline-flex items-center gap-2 text-sm text-muted" role="status">
                <Spinner size={16} className="text-primary" />
                Buscando reemplazos…
              </p>
            ) : sugerencias?.error ? (
              <p className="mt-3 text-sm text-primary" role="alert">
                {sugerencias.error}{" "}
                <TextLink type="button" className="inline" onClick={() => onBuscar(ingrediente)}>
                  Reintentar
                </TextLink>
              </p>
            ) : items ? (
              <SubstitutePicker
                embedded
                ingrediente={ingrediente.nombre}
                sustitutos={items}
                selected={selected}
                busyId={sugerencias?.aplicando ?? null}
                onSelect={(item) => onSelect(ingrediente, item)}
              />
            ) : null
          ) : null}
        </div>
      ) : null}
    </li>
  )
}

function IngredientList({ ingredientes, replacements = {}, sugerencias = {}, onBuscar, onSelectReplacement }) {
  return (
    <ul className="grid gap-2">
      {ingredientes.map((ingrediente) => (
        <IngredientRow
          key={ingrediente.ingredienteId ?? ingrediente.nombre}
          ingrediente={ingrediente}
          selected={replacements[ingrediente.ingredienteId]}
          sugerencias={sugerencias[ingrediente.ingredienteId]}
          onBuscar={onBuscar}
          onSelect={onSelectReplacement}
        />
      ))}
    </ul>
  )
}

export default IngredientList
