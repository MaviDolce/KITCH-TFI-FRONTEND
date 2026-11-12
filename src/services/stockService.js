import { CATEGORIA_VARIOS } from "../constants/pantryCategories"
import { http } from "../api/http"
import { toDateOnly } from "../utils/stock"

export function mapStockFromApi(dto) {
  return {
    id: dto.id,
    ingredienteId: dto.ingredienteId,
    nombreIngrediente: dto.nombreIngrediente,
    cantidad: Number(dto.cantidad),
    unidadMedida: dto.unidadMedida,
    fechaCaducidad: toDateOnly(dto.fechaCaducidad),
    categoria: dto.categoria || CATEGORIA_VARIOS,
  }
}

export const stockService = {
  async listar() {
    const { data } = await http.get("/api/StockUsuarios/mias")
    return (data ?? []).map(mapStockFromApi)
  },

  async crear(payload) {
    const { data } = await http.post("/api/StockUsuarios", {
      ingredienteId: payload.ingredienteId || 0,
      nombreIngrediente: payload.nombreIngrediente,
      cantidad: payload.cantidad,
      unidadMedida: payload.unidadMedida,
      fechaCaducidad: payload.fechaCaducidad || null,
      categoria: payload.categoria || CATEGORIA_VARIOS,
    })
    return mapStockFromApi(data)
  },

  async actualizar(id, payload) {
    await http.put(`/api/StockUsuarios/${id}`, {
      cantidad: payload.cantidad,
      unidadMedida: payload.unidadMedida,
      fechaCaducidad: payload.fechaCaducidad || null,
    })
    return {
      id,
      cantidad: payload.cantidad,
      unidadMedida: payload.unidadMedida,
      fechaCaducidad: toDateOnly(payload.fechaCaducidad),
    }
  },

  async eliminar(id) {
    await http.delete(`/api/StockUsuarios/${id}`)
  },
}
