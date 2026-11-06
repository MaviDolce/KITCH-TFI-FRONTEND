const MS_DAY = 1000 * 60 * 60 * 24
const EXPIRING_DAYS = 7

export function formatCantidad(cantidad) {
  const value = Number(cantidad)
  if (Number.isInteger(value)) {
    return String(value)
  }
  return String(value)
}

export function stepForUnidad(unidad) {
  const key = unidad.trim().toLowerCase()
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
