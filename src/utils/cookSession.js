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
