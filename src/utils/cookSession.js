const DRAFT_PREFIX = "kitch:receta-ajustes:"

function draftKey(userId, recetaId) {
  if (!recetaId) {
    return null
  }
  return `${DRAFT_PREFIX}${userId ?? "anon"}:${recetaId}`
}

export function loadRecipeDraft(userId, recetaId, ingredientesReceta = null) {
  const key = draftKey(userId, recetaId)
  if (!key) {
    return null
  }
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) {
      return null
    }
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== "object") {
      return null
    }
    const porciones = Number(parsed.porciones)
    const rawReplacements =
      parsed.replacements && typeof parsed.replacements === "object" ? parsed.replacements : {}

    const validIds = Array.isArray(ingredientesReceta)
      ? new Set(ingredientesReceta.map((item) => item.ingredienteId))
      : null

    const replacements = Object.fromEntries(
      Object.entries(rawReplacements).filter(([, item]) => {
        if (!item?.ingredienteOriginalId || !item?.ingredienteSustitutoId) {
          return false
        }
        return !validIds || validIds.has(item.ingredienteOriginalId)
      }),
    )

    const tieneReemplazos = Object.keys(replacements).length > 0
    const adaptacion =
      tieneReemplazos && parsed.adaptacion && typeof parsed.adaptacion === "object"
        ? parsed.adaptacion
        : null

    return {
      porciones: Number.isFinite(porciones) && porciones >= 1 ? porciones : null,
      replacements,
      adaptacion,
    }
  } catch {
    return null
  }
}

export function saveRecipeDraft(userId, recetaId, { porciones, basePorciones, replacements, adaptacion }) {
  const key = draftKey(userId, recetaId)
  if (!key) {
    return
  }
  const tieneReemplazos = replacements && Object.keys(replacements).length > 0
  const cambioPorciones = Number.isFinite(Number(porciones)) && Number(porciones) !== Number(basePorciones)
  try {
    if (!tieneReemplazos && !cambioPorciones) {
      window.localStorage.removeItem(key)
      return
    }
    window.localStorage.setItem(
      key,
      JSON.stringify({
        porciones,
        replacements: tieneReemplazos ? replacements : {},
        adaptacion: tieneReemplazos ? adaptacion ?? null : null,
      }),
    )
  } catch {
    return
  }
}

export function clearRecipeDraft(userId, recetaId) {
  const key = draftKey(userId, recetaId)
  if (!key) {
    return
  }
  try {
    window.localStorage.removeItem(key)
  } catch {
    return
  }
}

export function readCookState(locationState, receta, userId = null) {
  const fallback = receta?.porciones || 1
  const draft = receta ? loadRecipeDraft(userId, receta.recetaId, receta.ingredientes) : null
  const fromState = Number(locationState?.porciones)
  const porciones =
    fromState >= 1 ? fromState : draft?.porciones >= 1 ? draft.porciones : fallback
  const hasStateReplacements =
    locationState?.replacements &&
    typeof locationState.replacements === "object" &&
    Object.keys(locationState.replacements).length > 0
  const replacements = hasStateReplacements
    ? locationState.replacements
    : draft?.replacements ?? {}
  const adaptacion =
    locationState?.adaptacion && typeof locationState.adaptacion === "object"
      ? locationState.adaptacion
      : draft?.adaptacion ?? null

  return { porciones, replacements, adaptacion }
}

export function buildCookState(porciones, replacements, adaptacion = null) {
  return { porciones, replacements, adaptacion }
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

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

export function adaptarPasoConReemplazos(texto, replacements = {}) {
  const original = String(texto ?? "")
  const items = Object.values(replacements).filter((item) => item?.reemplazaA && item?.nombre)
  if (!original || items.length === 0) {
    return original
  }

  return items.reduce((resultado, item) => {
    const patron = new RegExp(`(^|[^\\p{L}\\p{N}])(${escapeRegExp(item.reemplazaA)}(?:s|es)?)(?=$|[^\\p{L}\\p{N}])`, "giu")
    return resultado.replace(patron, (_, prefijo, coincidencia) => {
      const capitalizado =
        coincidencia[0] === coincidencia[0].toUpperCase() &&
        coincidencia[0] !== coincidencia[0].toLowerCase()
      const reemplazo = capitalizado
        ? item.nombre.charAt(0).toUpperCase() + item.nombre.slice(1)
        : item.nombre
      return `${prefijo}${reemplazo}`
    })
  }, original)
}

export function resolverPasosAdaptados(pasosOriginales = [], adaptacion = null, replacements = {}) {
  if (
    adaptacion?.preparaciones?.length === pasosOriginales.length &&
    pasosOriginales.length > 0
  ) {
    const porNumero = new Map(
      adaptacion.preparaciones.map((paso) => [paso.numeroPaso, paso.descripcionPaso]),
    )
    return pasosOriginales.map((paso) => ({
      ...paso,
      descripcionPaso: porNumero.get(paso.numeroPaso) || paso.descripcionPaso,
    }))
  }

  return pasosOriginales.map((paso) => ({
    ...paso,
    descripcionPaso: adaptarPasoConReemplazos(paso.descripcionPaso, replacements),
  }))
}
