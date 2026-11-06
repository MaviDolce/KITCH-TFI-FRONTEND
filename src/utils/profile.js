import { ROLES } from "../constants/roles"

export function isPremiumUser(user) {
  return user?.rol === ROLES.profesional || user?.rol === ROLES.admin
}

export function planLabel(rol) {
  if (rol === ROLES.profesional) {
    return "Kitch Premium"
  }
  if (rol === ROLES.admin) {
    return "Admin"
  }
  return "Plan básico"
}

export function userInitial(user) {
  const letter = user?.nombre?.trim()?.[0] || user?.nombreUsuario?.trim()?.[0] || "K"
  return letter.toUpperCase()
}
