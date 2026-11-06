import { http } from "../api/http"
import { mapRecipeFromApi, mapRecomendacionFromApi, mergeMatch } from "../api/mappers/recipe"
import { ApiError } from "../api/errors"

export function filterRecipes(recetas, { query = "", filtro = "todas" } = {}) {
  const needle = query.trim().toLowerCase()
  let list = recetas

  if (needle) {
    list = list.filter(
      (receta) =>
        receta.titulo.toLowerCase().includes(needle) ||
        receta.descripcion.toLowerCase().includes(needle) ||
        receta.categoria?.toLowerCase().includes(needle),
    )
  }

  if (filtro === "rapidas") {
    list = list.filter((receta) => receta.tiempoPreparacionMinutos <= 25)
  } else if (filtro === "faciles") {
    list = list.filter((receta) => receta.dificultad === "Facil")
  } else if (filtro === "ingredientes") {
    list = list.filter((receta) => receta.porcentajeCoincidencia === 100)
  }

  return list
}

export const recetasService = {
  async listar() {
    const { data } = await http.get("/api/Recetas")
    return (data ?? []).map(mapRecipeFromApi)
  },

  async listarConMatch() {
    const recetas = await this.listar()
    let recomendaciones = []
    try {
      const { data } = await http.get("/api/Recomendacion")
      recomendaciones = (data ?? []).map(mapRecomendacionFromApi)
    } catch {
      recomendaciones = []
    }
    const byId = new Map(recomendaciones.map((item) => [item.recetaId, item]))
    return recetas.map((receta) => mergeMatch(receta, byId.get(receta.recetaId)))
  },

  async getDetalle(id) {
    try {
      const { data } = await http.get(`/api/Recetas/${id}`)
      return mapRecipeFromApi(data)
    } catch (error) {
      if (error instanceof ApiError && error.status === 403) {
        error.planRestriction = true
      }
      throw error
    }
  },
}
