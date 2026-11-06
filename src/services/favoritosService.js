import { http } from "../api/http"
import { mapRecipeFromApi } from "../api/mappers/recipe"
import { recetasService } from "./recetasService"

async function hydrateFavorito(item) {
  try {
    const receta = await recetasService.getDetalle(item.recetaId)
    return receta
  } catch {
    return mapRecipeFromApi({
      id: item.recetaId,
      titulo: item.recetaTitulo,
      descripcion: "",
      tiempoPreparacionMinutos: 0,
      caloriasEstimadas: 0,
      porciones: 1,
      dificultad: "Medio",
      categoria: "general",
      ingredientes: [],
      preparaciones: [],
    })
  }
}

export const favoritosService = {
  async listar() {
    const { data } = await http.get("/api/Favoritos/mias")
    const items = data ?? []
    const recetas = await Promise.all(items.map(hydrateFavorito))
    return recetas.filter(Boolean)
  },

  async listIds() {
    const { data } = await http.get("/api/Favoritos/mias")
    return (data ?? []).map((item) => item.recetaId)
  },

  async toggle(recetaId) {
    const { data } = await http.post("/api/Favoritos/toggle", null, {
      params: { recetaId },
    })
    return { esFavorito: Boolean(data.esFavorito), message: data.message }
  },
}
