import { http } from "../api/http"

export function mapSustitutoFromApi(dto, stockItems = []) {
  const nombre = dto.ingredienteSustituto || dto.nombre
  const disponibleEnAlacena =
    typeof dto.disponibleEnAlacena === "boolean"
      ? dto.disponibleEnAlacena
      : stockItems.some(
          (item) => item.nombreIngrediente?.toLowerCase() === String(nombre).toLowerCase(),
        )
  return {
    id: dto.id ?? dto.ingredienteId,
    ingredienteId: dto.ingredienteId,
    nombre,
    factorEquivalencia: Number(dto.factorEquivalencia) || 1,
    notas: dto.notas,
    hayMasConProfesional: Boolean(dto.hayMasConProfesional),
    disponibleEnAlacena,
  }
}

export const sustitutosService = {
  async listarPorIngrediente(ingredienteId, stockItems = []) {
    if (!ingredienteId) {
      return []
    }
    const { data } = await http.get(`/api/Sustitutos/ingrediente/${ingredienteId}`)
    return (data ?? []).map((item) => mapSustitutoFromApi(item, stockItems))
  },
}
