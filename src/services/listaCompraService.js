import { CATEGORIA_VARIOS } from "../constants/pantryCategories"
import { http } from "../api/http"

export function mapShoppingItemFromApi(dto) {
  return {
    id: dto.id,
    ingredienteId: dto.ingredienteId ?? null,
    nombreArticulo: dto.nombreArticulo,
    cantidadFaltante: Number(dto.cantidadFaltante),
    unidadMedida: dto.unidadMedida || "",
    estaComprado: Boolean(dto.estaComprado),
    categoria: CATEGORIA_VARIOS,
  }
}

export const listaCompraService = {
  async listar() {
    const { data } = await http.get("/api/ListaCompra/mias")
    return (data ?? []).map(mapShoppingItemFromApi)
  },

  async crear(payload) {
    const { data } = await http.post("/api/ListaCompra", {
      nombreArticulo: payload.nombreArticulo,
      cantidadFaltante: payload.cantidadFaltante,
      unidadMedida: payload.unidadMedida || "",
      ingredienteId: payload.ingredienteId ?? null,
    })
    return mapShoppingItemFromApi(data)
  },

  async actualizar(id, payload) {
    await http.put(`/api/ListaCompra/${id}`, {
      nombreArticulo: payload.nombreArticulo,
      cantidadFaltante: payload.cantidadFaltante,
      estaComprado: Boolean(payload.estaComprado),
      unidadMedida: payload.unidadMedida || "",
      ingredienteId: payload.ingredienteId ?? null,
    })
    return { id, ...payload }
  },

  async marcarComprado(id) {
    await http.patch(`/api/ListaCompra/${id}/comprado`)
  },

  async eliminar(id) {
    await http.delete(`/api/ListaCompra/${id}`)
  },

  async generarFaltantes() {
    const { data } = await http.get("/api/ListaCompra/faltantes")
    return (data ?? []).map(mapShoppingItemFromApi)
  },
}
