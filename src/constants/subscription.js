export const PREMIUM_PLAN = {
  tipo: "Profesional",
  monto: 5000,
  periodo: "mes",
}

export const METODOS_PAGO = [
  { value: "TarjetaCredito", label: "Tarjeta de crédito" },
  { value: "TarjetaDebito", label: "Tarjeta de débito" },
  { value: "TransferenciaBancaria", label: "Transferencia bancaria" },
  { value: "BilleteraVirtual", label: "Billetera virtual" },
  { value: "PayPal", label: "PayPal" },
]

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
  0: "No especificado",
  1: "Tarjeta de crédito",
  2: "Tarjeta de débito",
  3: "Transferencia bancaria",
  4: "Billetera virtual",
  5: "PayPal",
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
  return METODOS_PAGO.find((item) => item.value === value)?.label ?? value
}

export function estadoPagoLabel(value) {
  if (typeof value === "number") {
    return ESTADO_PAGO_BY_NUMBER[value] ?? String(value)
  }
  return value || ""
}

export function formatMoney(amount) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
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
