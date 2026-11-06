import { mapDificultad, toneFromCategoria } from "./dificultad"

export function mapIngredientFromApi(dto) {
  return {
    id: dto.id,
    ingredienteId: dto.ingredienteId,
    nombre: dto.nombre,
    cantidad: Number(dto.cantidad),
    unidad: dto.unidadMedida,
    unidadMedida: dto.unidadMedida,
  }
}

export function mapPasoFromApi(dto) {
  return {
    id: dto.id,
    numeroPaso: dto.numeroPaso,
    descripcionPaso: dto.descripcionPaso,
  }
}

export function mapRecipeFromApi(dto) {
  if (!dto) {
    return null
  }
  const recetaId = dto.id ?? dto.recetaId
  return {
    recetaId,
    titulo: dto.titulo,
    descripcion: dto.descripcion ?? "",
    caloriasEstimadas: dto.caloriasEstimadas,
    tiempoPreparacionMinutos: dto.tiempoPreparacionMinutos,
    porciones: dto.porciones,
    dificultad: mapDificultad(dto.dificultad),
    categoria: dto.categoria ?? "general",
    tone: toneFromCategoria(dto.categoria),
    ingredientes: (dto.ingredientes ?? []).map(mapIngredientFromApi),
    preparaciones: (dto.preparaciones ?? []).map(mapPasoFromApi),
    porcentajeCoincidencia: dto.porcentajeCoincidencia,
    ingredientesDisponibles: dto.ingredientesDisponibles,
    totalIngredientes: dto.totalIngredientes,
    ingredientesFaltantes: dto.ingredientesFaltantes ?? [],
  }
}

export function mapRecomendacionFromApi(dto) {
  if (!dto) {
    return null
  }
  return {
    recetaId: dto.recetaId,
    titulo: dto.titulo,
    dificultad: mapDificultad(dto.dificultad),
    tiempoPreparacionMinutos: dto.tiempoPreparacionMinutos,
    caloriasEstimadas: dto.caloriasEstimadas,
    porciones: dto.porciones,
    categoria: dto.categoria ?? "general",
    tone: toneFromCategoria(dto.categoria),
    totalIngredientes: dto.totalIngredientes,
    ingredientesDisponibles: dto.ingredientesDisponibles,
    porcentajeCoincidencia: dto.porcentajeCoincidencia,
    ingredientesFaltantes: dto.ingredientesFaltantes ?? [],
    descripcion: "",
    ingredientes: [],
    preparaciones: [],
  }
}

export function mergeMatch(receta, recomendacion) {
  if (!recomendacion) {
    return receta
  }
  return {
    ...receta,
    porcentajeCoincidencia: recomendacion.porcentajeCoincidencia,
    ingredientesDisponibles: recomendacion.ingredientesDisponibles,
    totalIngredientes: recomendacion.totalIngredientes,
    ingredientesFaltantes: recomendacion.ingredientesFaltantes,
  }
}
