import { http } from "../api/http"

function mapUsuario(dto) {
  return {
    id: dto.id,
    nombre: dto.nombre ?? "",
    apellido: dto.apellido ?? "",
    nombreUsuario: dto.nombreUsuario ?? "",
    email: dto.email ?? "",
    preferenciaDietetica: dto.preferenciaDietetica ?? "",
    activo: Boolean(dto.activo),
    rol: dto.rol ?? "",
  }
}

export const adminService = {
  async getMetricas() {
    const { data } = await http.get("/api/Admin/metricas")
    return data
  },

  async getUsuarios() {
    const { data } = await http.get("/api/Admin/usuarios")
    return (data ?? []).map(mapUsuario)
  },

  async bloquear(id) {
    const { data } = await http.post(`/api/Admin/usuarios/${id}/bloquear`)
    return mapUsuario(data)
  },

  async desbloquear(id) {
    const { data } = await http.post(`/api/Admin/usuarios/${id}/desbloquear`)
    return mapUsuario(data)
  },

  async enviarRecuperacion(id) {
    const { data } = await http.post(`/api/Admin/usuarios/${id}/recuperar-password`)
    return { message: data.message }
  },
}
