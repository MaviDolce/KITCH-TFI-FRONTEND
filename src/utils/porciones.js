export function roundCantidad(value) {
  return Math.round(Number(value) * 100) / 100
}

export function formatCantidadAjustada(value) {
  return String(roundCantidad(value))
}

export function filasIngredientes(ingredientes = [], preview, replacements = {}) {
  const porId = new Map((preview?.ingredientes ?? []).map((item) => [item.ingredienteId, item]))

  return ingredientes.map((ingrediente) => {
    const reemplazo = replacements[ingrediente.ingredienteId] ?? null
    const efectivoId = reemplazo?.ingredienteSustitutoId ?? ingrediente.ingredienteId
    const calculado = porId.get(efectivoId)
    return {
      ...ingrediente,
      nombreMostrado: reemplazo?.nombre ?? ingrediente.nombre,
      reemplazaA: reemplazo ? ingrediente.nombre : undefined,
      cantidadAjustada: calculado ? calculado.cantidadAjustada : ingrediente.cantidad,
      unidad: calculado?.unidadMedida ?? ingrediente.unidad,
      cantidadFaltante: calculado?.cantidadFaltante ?? 0,
      enAlacena: calculado ? calculado.alcanzaStock : false,
      calculado: Boolean(calculado),
    }
  })
}
