import { mapUserFromApi } from "../api/mappers/user"
import { http } from "../api/http"
import {
  clearSessionToken,
  getPendingTwoFactor as readPendingTwoFactor,
  setPendingTwoFactor as writePendingTwoFactor,
  setSessionToken,
} from "../api/session"

async function loadPerfil() {
  const { data } = await http.get("/api/Auth/perfil")
  return mapUserFromApi(data)
}

export const authService = {
  async login(payload) {
    const { data } = await http.post("/api/Auth/login", {
      usuarioOMail: payload.usuarioOMail,
      password: payload.password,
    })
    const pending = {
      email: data.email,
      emailEnmascarado: data.emailEnmascarado,
      mensaje: data.mensaje,
      requiresTwoFactor: data.requiresTwoFactor !== false,
    }
    writePendingTwoFactor(pending)
    return pending
  },

  async verifyTwoFactor(codigo) {
    const pending = readPendingTwoFactor()
    if (!pending?.email) {
      throw new Error("No hay un código de verificación pendiente.")
    }
    const { data } = await http.post("/api/Auth/verify-2fa", {
      email: pending.email,
      codigo: String(codigo).trim(),
    })
    setSessionToken(data.token, data.expiresAt)
    writePendingTwoFactor(null)
    return loadPerfil()
  },

  async register(payload) {
    const { data } = await http.post("/api/Auth/register", {
      nombre: payload.nombre,
      apellido: payload.apellido,
      nombreUsuario: payload.nombreUsuario,
      email: payload.email,
      password: payload.password,
      preferenciaDietetica: payload.preferenciaDietetica,
    })
    setSessionToken(data.token, data.expiresAt)
    writePendingTwoFactor(null)
    return loadPerfil()
  },

  async emailExiste(email) {
    const { data } = await http.get("/api/Auth/email-existe", {
      params: { email },
    })
    return Boolean(data)
  },

  async forgotPassword(email) {
    const { data } = await http.post("/api/Auth/forgot-password", { email })
    return { message: data.message }
  },

  async resetPassword({ token, nuevaPassword }) {
    const { data } = await http.post("/api/Auth/reset-password", { token, nuevaPassword })
    return { message: data.message }
  },

  getPendingTwoFactor: readPendingTwoFactor,

  logout() {
    clearSessionToken()
    writePendingTwoFactor(null)
  },

  getMe: loadPerfil,

  async updateMe(payload) {
    await http.put("/api/Perfil/me", {
      nombre: payload.nombre,
      apellido: payload.apellido,
      email: payload.email,
    })
    const { data } = await http.put("/api/Auth/perfil", {
      nombreUsuario: payload.nombreUsuario,
      preferenciaDietetica: payload.preferenciaDietetica,
    })
    return mapUserFromApi(data)
  },
}
