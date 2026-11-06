import { ApiError } from "../api/errors"
import { http } from "../api/http"

export class PlanificadorConflictError extends Error {
  constructor(message = "Ya existe una comida planificada para ese usuario, fecha y turno.") {
    super(message)
    this.name = "PlanificadorConflictError"
    this.code = "CONFLICT"
  }
}

function toDateKey(value) {
  if (!value) {
    return ""
  }
  return String(value).slice(0, 10)
}

export function mapComidaFromApi(dto) {
  return {
    id: dto.id,
    recetaId: dto.recetaId,
    titulo: dto.recetaTitulo,
    fechaAsignada: toDateKey(dto.fechaAsignada),
    turno: dto.turno,
  }
}

function toApiFecha(dateKey) {
  return `${dateKey}T12:00:00.000Z`
}

export const planificadorService = {
  async listar() {
    const { data } = await http.get("/api/Planificador/mias")
    return (data ?? []).map(mapComidaFromApi)
  },

  async crear({ recetaId, fechaAsignada, turno }) {
    try {
      const { data } = await http.post("/api/Planificador", {
        recetaId: Number(recetaId),
        fechaAsignada: toApiFecha(fechaAsignada),
        turno,
      })
      return mapComidaFromApi(data)
    } catch (error) {
      if (error instanceof ApiError && error.status === 409) {
        throw new PlanificadorConflictError(error.message)
      }
      throw error
    }
  },

  async actualizar(id, { recetaId, fechaAsignada, turno }) {
    try {
      await http.put(`/api/Planificador/${id}`, {
        recetaId: Number(recetaId),
        fechaAsignada: toApiFecha(fechaAsignada),
        turno,
      })
      return {
        id,
        recetaId: Number(recetaId),
        fechaAsignada,
        turno,
      }
    } catch (error) {
      if (error instanceof ApiError && error.status === 409) {
        throw new PlanificadorConflictError(error.message)
      }
      throw error
    }
  },

  async eliminar(id) {
    await http.delete(`/api/Planificador/${id}`)
  },
}
