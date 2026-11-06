export class ApiError extends Error {
  constructor({ status = 0, title = "", message = "No pudimos completar la acción.", data = null } = {}) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.title = title
    this.data = data
  }
}

function readProblem(data) {
  if (!data || typeof data !== "object") {
    return { title: "", message: "" }
  }
  const fromErrors =
    data.errors && typeof data.errors === "object"
      ? Object.values(data.errors)
          .flat()
          .find((item) => typeof item === "string" && item.trim())
      : ""
  const message = data.detail || data.message || data.error || fromErrors || data.title || ""
  return { title: data.title || "", message: String(message) }
}

export function toApiError(error) {
  if (error instanceof ApiError) {
    return error
  }

  if (error?.code === "ECONNABORTED") {
    return new ApiError({
      status: 0,
      title: "Tiempo agotado",
      message: "La conexión tardó demasiado. Intentá de nuevo.",
    })
  }

  if (!error?.response) {
    return new ApiError({
      status: 0,
      title: "Sin conexión",
      message: "No pudimos conectar con Kitch. Revisá tu conexión e intentá de nuevo.",
    })
  }

  const status = error.response.status
  const data = error.response.data
  const parsed = readProblem(data)
  const fallback = {
    400: "El pedido no es válido.",
    401: "Tenés que iniciar sesión.",
    403: "No tenés permiso para esta acción.",
    404: "No encontramos lo que buscabas.",
    409: "Esa acción entra en conflicto con datos existentes.",
    422: "Revisá los datos e intentá de nuevo.",
    500: "Ocurrió un error inesperado. Intentá más tarde.",
  }

  return new ApiError({
    status,
    title: parsed.title,
    message: parsed.message || fallback[status] || "No pudimos completar la acción.",
    data,
  })
}
