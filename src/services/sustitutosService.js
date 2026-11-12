import { IA_TIMEOUT_MS } from "../api/config"
import { http } from "../api/http"

export function mapSustitutoFromApi(dto) {
  return {
    id: dto.id ?? dto.ingredienteId,
    ingredienteId: dto.ingredienteId,
    nombre: dto.ingredienteSustituto || dto.nombre,
    factorEquivalencia: Number(dto.factorEquivalencia) || 1,
    notas: dto.notas,
    hayMasConProfesional: Boolean(dto.hayMasConProfesional),
    disponibleEnAlacena: Boolean(dto.disponibleEnAlacena),
  }
}

export const sustitutosService = {
  async sugeridos(ingredienteId) {
    const { data } = await http.get(`/api/Sustitutos/sugeridos/${ingredienteId}`, {
      timeout: IA_TIMEOUT_MS,
    })
    return (data ?? []).map(mapSustitutoFromApi)
  },
}
