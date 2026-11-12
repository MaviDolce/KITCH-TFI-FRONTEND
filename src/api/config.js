const IA_TIMEOUT_POR_DEFECTO_MS = 120000

const iaTimeout = Number(import.meta.env.VITE_IA_TIMEOUT_MS)

export const IA_TIMEOUT_MS = Number.isFinite(iaTimeout) && iaTimeout > 0 ? iaTimeout : IA_TIMEOUT_POR_DEFECTO_MS
