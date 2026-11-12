import { IA_TIMEOUT_MS } from "../api/config"
import { http } from "../api/http"
import { mapDificultad, toneFromCategoria } from "../api/mappers/dificultad"
import { mapRecomendacionFromApi } from "../api/mappers/recipe"
import { mapSustitutoFromApi } from "./sustitutosService"

function mapRecetaChat(dto) {
  if (!dto) {
    return null
  }
  const recetaId = dto.recetaId ?? dto.id
  return {
    recetaId,
    titulo: dto.titulo,
    descripcion: dto.descripcion ?? "",
    tiempoPreparacionMinutos: dto.tiempoPreparacionMinutos,
    porciones: dto.porciones,
    dificultad: mapDificultad(dto.dificultad),
    caloriasEstimadas: dto.caloriasEstimadas,
    categoria: dto.categoria ?? "general",
    tone: toneFromCategoria(dto.categoria),
    ingredientes: (dto.ingredientes ?? []).map((item) => ({
      nombre: item.nombre,
      cantidad: Number(item.cantidad),
      unidad: item.unidadMedida ?? item.unidad,
      unidadMedida: item.unidadMedida ?? item.unidad,
    })),
    pasos: dto.pasos ?? [],
    preparaciones: (dto.pasos ?? []).map((texto, index) => ({
      numeroPaso: index + 1,
      descripcionPaso: texto,
    })),
  }
}

export const chatIaService = {
  async enviar({ mensaje, historial = [], recetaActual }) {
    const mensajes = [
      ...historial.map((item) => ({
        rol: item.rol === "asistente" ? "asistente" : "usuario",
        texto: item.texto ?? item.mensaje ?? "",
      })),
      { rol: "usuario", texto: mensaje },
    ]
    const { data } = await http.post("/api/ChatIa", {
      mensajes,
      recetaActual: recetaActual
        ? {
            titulo: recetaActual.titulo,
            descripcion: recetaActual.descripcion,
            tiempoPreparacionMinutos: recetaActual.tiempoPreparacionMinutos,
            porciones: recetaActual.porciones,
            dificultad: recetaActual.dificultad,
            caloriasEstimadas: recetaActual.caloriasEstimadas,
            categoria: recetaActual.categoria,
            ingredientes: recetaActual.ingredientes,
            pasos: recetaActual.pasos ?? recetaActual.preparaciones?.map((paso) => paso.descripcionPaso),
          }
        : null,
    }, { timeout: IA_TIMEOUT_MS })
    return {
      accion: data.accion,
      mensaje: data.mensaje,
      receta: mapRecetaChat(data.receta) ?? mapRecetaChat(data.recetaGuardada),
      recetaGuardada: data.recetaGuardada,
      ingredienteSustituido: data.ingredienteSustituido,
      sustitutos: (data.sustitutos ?? []).map((item) => mapSustitutoFromApi(item)),
      hayMasSustitutosPremium: Boolean(data.hayMasSustitutosPremium),
      recomendaciones: (data.recomendaciones ?? []).map(mapRecomendacionFromApi),
      recetasEliminadas: data.recetasEliminadas,
      cantidadRecetasGuardadas: data.cantidadRecetasGuardadas,
      comidaPlanificada: data.comidaPlanificada,
      ingredientesAgregadosALista: data.ingredientesAgregadosALista,
      stockDescontado: data.stockDescontado,
      stockFaltante: data.stockFaltante,
    }
  },
}
