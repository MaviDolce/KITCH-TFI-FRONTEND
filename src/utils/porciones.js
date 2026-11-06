export function roundCantidad(value) {
  return Math.round(Number(value) * 100) / 100
}

export function factorPorciones(seleccionadas, originales) {
  const base = Number(originales)
  const next = Number(seleccionadas)
  if (!base || base <= 0) {
    return 1
  }
  if (!next || next <= 0) {
    return 1
  }
  return next / base
}

export function ajustarCantidad(
  cantidadOriginal,
  seleccionadas,
  originales,
  factorEquivalencia = 1,
) {
  const equivalencia = Number(factorEquivalencia) || 1
  return roundCantidad(
    Number(cantidadOriginal) * factorPorciones(seleccionadas, originales) * equivalencia,
  )
}

export function formatCantidadAjustada(value) {
  const cantidad = roundCantidad(value)
  if (Number.isInteger(cantidad)) {
    return String(cantidad)
  }
  return String(cantidad)
}

export function ingredientesAjustados(
  ingredientes,
  porcionesSeleccionadas,
  porcionesOriginales,
  replacements = {},
) {
  return ingredientes.map((ingrediente) => {
    const sustituto = replacements[ingrediente.nombre]
    const factorEquivalencia = sustituto ? Number(sustituto.factorEquivalencia) || 1 : 1
    return {
      ...ingrediente,
      nombreMostrado: sustituto?.nombre ?? ingrediente.nombre,
      reemplazaA: sustituto ? ingrediente.nombre : undefined,
      cantidadAjustada: ajustarCantidad(
        ingrediente.cantidad,
        porcionesSeleccionadas,
        porcionesOriginales,
        factorEquivalencia,
      ),
      sustituto: sustituto ?? null,
    }
  })
}
