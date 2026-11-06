const ROL_BY_NUMBER = {
  0: "Basico",
  1: "Profesional",
  2: "Admin",
}

function mapRol(value) {
  if (typeof value === "number") {
    return ROL_BY_NUMBER[value] ?? "Basico"
  }
  if (typeof value === "string" && value.trim() !== "") {
    return ROL_BY_NUMBER[Number(value)] && String(Number(value)) === value
      ? ROL_BY_NUMBER[Number(value)]
      : value
  }
  return "Basico"
}

export function mapUserFromApi(dto) {
  if (!dto) {
    return null
  }
  return {
    id: dto.id,
    email: dto.email,
    nombreUsuario: dto.nombreUsuario,
    nombre: dto.nombre,
    apellido: dto.apellido,
    rol: mapRol(dto.rol),
    preferenciaDietetica: dto.preferenciaDietetica,
    activo: dto.activo,
    suscripcionActivaHasta: dto.suscripcionActivaHasta ?? null,
  }
}
