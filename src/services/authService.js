import { mapUserFromApi } from "../api/mappers/user"
import { http } from "../api/http"
import {
  clearAllSessionData,
  getPendingTwoFactor as readPendingTwoFactor,
  setPendingTwoFactor as writePendingTwoFactor,
  setSessionToken,
} from "../api/session"

async function loadPerfil() {
  const { data } = await http.get("/api/Auth/perfil")
  return mapUserFromApi(data)
}

function storePendingTwoFactor(data) {
  const pending = {
    email: data.email,
    emailEnmascarado: data.emailEnmascarado,
    mensaje: data.mensaje,
    requiresTwoFactor: data.requiresTwoFactor !== false,
  }
  writePendingTwoFactor(pending)
  return pending
}

export const authService = {
  async login(payload) {
    const { data } = await http.post("/api/Auth/login", {
      usuarioOMail: payload.usuarioOMail,
      password: payload.password,
    })
    return storePendingTwoFactor(data)
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

  async resendTwoFactor() {
    const pending = readPendingTwoFactor()
    if (!pending?.email) {
      throw new Error("No hay un código de verificación pendiente.")
    }
    const { data } = await http.post("/api/Auth/resend-2fa", { email: pending.email })
    return storePendingTwoFactor({ ...data, email: pending.email })
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
    return storePendingTwoFactor(data)
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

  async changePassword({ actual, nueva }) {
    const { data } = await http.put("/api/Auth/cambiar-password", {
      passwordActual: actual,
      nuevaPassword: nueva,
    })
    return { message: data.message }
  },

  async refreshSession() {
    const { data } = await http.post("/api/Auth/refresh")
    setSessionToken(data.token, data.expiresAt)
    return loadPerfil()
  },

  getPendingTwoFactor: readPendingTwoFactor,

  logout() {
    clearAllSessionData()
  },

  getMe: loadPerfil,

  async updateMe(payload) {
    const { data } = await http.put("/api/Auth/perfil", {
      nombre: payload.nombre,
      apellido: payload.apellido,
      nombreUsuario: payload.nombreUsuario,
      preferenciaDietetica: payload.preferenciaDietetica,
    })
    return mapUserFromApi(data)
  },
}
