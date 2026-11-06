const BY_NUMBER = {
  0: "Facil",
  1: "Medio",
  2: "Dificil",
}

export function mapDificultad(value) {
  if (typeof value === "number") {
    return BY_NUMBER[value] ?? "Medio"
  }
  if (typeof value === "string" && value.trim() !== "") {
    if (Object.hasOwn(BY_NUMBER, Number(value)) && String(Number(value)) === value) {
      return BY_NUMBER[Number(value)]
    }
    return value
  }
  return "Medio"
}

const TONE_BY_CATEGORIA = {
  pastas: "ai",
  carnes: "primary",
  pollo: "warning",
  ensaladas: "success",
  sopas: "accent",
  pescados: "success",
  pizzas: "warning",
  postres: "accent",
  tartas: "ai",
  guisos: "warning",
  general: "ai",
}

export function toneFromCategoria(categoria) {
  const key = String(categoria ?? "general").toLowerCase()
  return TONE_BY_CATEGORIA[key] ?? "ai"
}
