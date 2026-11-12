import { http } from "../api/http"

const METODO_PAGO = {
  TarjetaCredito: 1,
  TarjetaDebito: 2,
  TransferenciaBancaria: 3,
  BilleteraVirtual: 4,
  PayPal: 5,
}

function toMetodoPago(value) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value
  }
  return METODO_PAGO[value] ?? 1
}

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
      metodoPago: toMetodoPago(payload.metodoPago),
    })
    return data
  },

  async confirmarPago(paymentId) {
    const { data } = await http.post("/api/Suscripciones/confirmar-pago", { paymentId: String(paymentId) })
    return data
  },

  async listarPagos() {
    const { data } = await http.get("/api/Pagos/mios")
    return data ?? []
  },
}
