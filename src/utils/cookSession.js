export function readCookState(locationState, receta) {
  const fallback = receta?.porciones || 1
  const fromState = Number(locationState?.porciones)
  const porciones = fromState >= 1 ? fromState : fallback
  const replacements =
    locationState?.replacements && typeof locationState.replacements === "object"
      ? locationState.replacements
      : {}

  return { porciones, replacements }
}

export function buildCookState(porciones, replacements) {
  return { porciones, replacements }
}

export function buildReplacement(ingrediente, sustituto) {
  return {
    ingredienteOriginalId: ingrediente.ingredienteId,
    ingredienteSustitutoId: sustituto.ingredienteId,
    nombre: sustituto.nombre,
    reemplazaA: ingrediente.nombre,
  }
}

export function toSustituciones(replacements = {}) {
  return Object.values(replacements)
    .filter((item) => item?.ingredienteOriginalId && item?.ingredienteSustitutoId)
    .map((item) => ({
      ingredienteOriginalId: item.ingredienteOriginalId,
      ingredienteSustitutoId: item.ingredienteSustitutoId,
    }))
}

export function cantidadesIniciales(preview) {
  return Object.fromEntries(
    (preview?.ingredientes ?? []).map((item) => [item.ingredienteId, String(item.cantidadNecesaria)]),
  )
}

export function toCantidadesUtilizadas(cantidades = {}) {
  const entries = Object.entries(cantidades).filter(([, value]) => String(value).trim() !== "")
  const parsed = entries.map(([ingredienteId, value]) => ({
    ingredienteId: Number(ingredienteId),
    cantidad: Number(String(value).replace(",", ".")),
  }))
  const validas = parsed.every((item) => Number.isFinite(item.cantidad) && item.cantidad >= 0)
  return validas ? parsed : null
}

export function reemplazoPorSustituto(replacements = {}, ingredienteId) {
  return Object.values(replacements).find((item) => item?.ingredienteSustitutoId === ingredienteId) ?? null
}
