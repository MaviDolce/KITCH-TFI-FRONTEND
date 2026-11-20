import { http } from "../api/http"

const METODO_PAGO_NO_ESPECIFICADO = 0

export const suscripcionService = {
  async getMine() {
    const { data } = await http.get("/api/Suscripciones/mias")
    const list = data ?? []
    return list.find((item) => item.activa) ?? list[0] ?? null
  },

  async getPlan() {
    const { data } = await http.get("/api/Suscripciones/plan")
    return {
      tipo: data?.tipo ?? "",
      monto: Number(data?.monto ?? 0),
      moneda: data?.moneda || "ARS",
    }
  },

  async contratar(payload) {
    const { data } = await http.post("/api/Suscripciones/contratar", {
      tipo: payload.tipo,
      metodoPago: METODO_PAGO_NO_ESPECIFICADO,
    })
    return data
  },

  async confirmarPago(paymentId) {
    const { data } = await http.post("/api/Suscripciones/confirmar-pago", { paymentId: String(paymentId) })
    return data
  },

  async verificarPagos() {
    const { data } = await http.post("/api/Suscripciones/verificar-pagos")
    return {
      pagosAplicados: Number(data?.pagosAplicados ?? 0),
      rolActual: data?.rolActual ?? "",
      requiereRefrescarSesion: Boolean(data?.requiereRefrescarSesion),
      profesionalHasta: data?.profesionalHasta ?? null,
      mensaje: data?.mensaje ?? "",
    }
  },

  async listarPagos() {
    const { data } = await http.get("/api/Pagos/mios")
    return data ?? []
  },
}
