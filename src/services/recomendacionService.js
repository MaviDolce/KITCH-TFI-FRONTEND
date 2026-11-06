import { http } from "../api/http"
import { mapRecomendacionFromApi } from "../api/mappers/recipe"

export const recomendacionService = {
  async listar() {
    const { data } = await http.get("/api/Recomendacion")
    return (data ?? []).map(mapRecomendacionFromApi)
  },

  async getDestacada() {
    const recetas = await this.listar()
    return recetas[0] ?? null
  },
}
