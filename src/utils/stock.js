import { CATEGORIA_VARIOS, PANTRY_CATEGORIES } from "../constants/pantryCategories"

const MS_DAY = 1000 * 60 * 60 * 24
const EXPIRING_DAYS = 7

export function toDateOnly(value) {
  if (!value) {
    return null
  }
  return String(value).slice(0, 10)
}

export function agruparPorCategoria(items) {
  const groups = new Map()
  for (const item of items) {
    const key = item.categoria || CATEGORIA_VARIOS
    if (!groups.has(key)) {
      groups.set(key, [])
    }
    groups.get(key).push(item)
  }

  const conocidas = PANTRY_CATEGORIES.map((categoria) => categoria.id)
  const otras = [...groups.keys()]
    .filter((key) => !conocidas.includes(key) && key !== CATEGORIA_VARIOS)
    .sort((a, b) => a.localeCompare(b, "es"))

  return [...conocidas, ...otras, CATEGORIA_VARIOS]
    .filter((key) => groups.has(key))
    .map((key) => ({ categoria: key, items: groups.get(key) }))
}

export function proximaCantidad(item, direccion) {
  const next = item.cantidad + direccion * stepForUnidad(item.unidadMedida)
  return Math.max(0, Math.round(next * 100) / 100)
}

export function formatCantidad(cantidad) {
  const value = Number(cantidad)
  if (Number.isInteger(value)) {
    return String(value)
  }
  return String(value)
}

export function stepForUnidad(unidad) {
  const key = (unidad ?? "").trim().toLowerCase()
  if (key === "gr" || key === "g") {
    return 50
  }
  if (key === "ml") {
    return 100
  }
  return 1
}

export function isExpiringSoon(fechaCaducidad) {
  if (!fechaCaducidad) {
    return false
  }
  const date = new Date(`${fechaCaducidad}T00:00:00`)
  if (Number.isNaN(date.getTime())) {
    return false
  }
  return date.getTime() - Date.now() <= EXPIRING_DAYS * MS_DAY
}

export function formatCaducidad(fechaCaducidad) {
  if (!fechaCaducidad) {
    return ""
  }
  const [year, month, day] = fechaCaducidad.split("-")
  if (!year || !month || !day) {
    return fechaCaducidad
  }
  return `${day}/${month}`
}
