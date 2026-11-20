export const PREMIUM_PLAN = {
  tipo: "Profesional",
  periodo: "mes",
}

const METODO_PAGO_BY_NAME = {
  NoEspecificado: "Mercado Pago",
  TarjetaCredito: "Tarjeta de crédito",
  TarjetaDebito: "Tarjeta de débito",
  TransferenciaBancaria: "Transferencia bancaria",
  BilleteraVirtual: "Dinero en cuenta de Mercado Pago",
  PayPal: "PayPal",
}

export const PLAN_BASICO_FEATURES = [
  "Recetas fáciles e intermedias",
  "Hasta 5 recetas guardadas",
  "Hasta 3 comidas en el planificador",
  "Agenda a 7 días y 1 reemplazo por ingrediente",
]

export const PLAN_PREMIUM_FEATURES = [
  "Recetas difíciles desbloqueadas",
  "Favoritos y comidas sin tope de plan",
  "Agenda a 30 días",
  "Todos los reemplazos de ingredientes",
]

const METODO_PAGO_BY_NUMBER = {
  0: METODO_PAGO_BY_NAME.NoEspecificado,
  1: METODO_PAGO_BY_NAME.TarjetaCredito,
  2: METODO_PAGO_BY_NAME.TarjetaDebito,
  3: METODO_PAGO_BY_NAME.TransferenciaBancaria,
  4: METODO_PAGO_BY_NAME.BilleteraVirtual,
  5: METODO_PAGO_BY_NAME.PayPal,
}

const ESTADO_PAGO_BY_NUMBER = {
  0: "Pendiente",
  1: "Aprobado",
  2: "Rechazado",
  3: "Cancelado",
  4: "Reembolsado",
}

export function metodoPagoLabel(value) {
  if (typeof value === "number") {
    return METODO_PAGO_BY_NUMBER[value] ?? String(value)
  }
  return METODO_PAGO_BY_NAME[value] ?? value
}

export function estadoPagoLabel(value) {
  if (typeof value === "number") {
    return ESTADO_PAGO_BY_NUMBER[value] ?? String(value)
  }
  return value || ""
}

export function formatMoney(amount, currency = "ARS") {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: currency || "ARS",
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(value) {
  if (!value) return ""
  return new Intl.DateTimeFormat("es-AR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value))
}
