import { http } from "../api/http"

function mapMovimiento(dto) {
  return {
    nombre: dto.nombre,
    cantidad: Number(dto.cantidad),
    unidadMedida: dto.unidadMedida,
  }
}

function mapResultadoDescuento(data) {
  return {
    receta: data?.receta ?? "",
    mensaje: data?.mensaje ?? "",
    descontados: (data?.descontados ?? []).map(mapMovimiento),
    faltantes: (data?.faltantes ?? []).map(mapMovimiento),
    noDescontados: (data?.noDescontados ?? []).map(mapMovimiento),
  }
}

function mapIngredienteAjustado(dto) {
  return {
    ingredienteId: dto.ingredienteId,
    nombre: dto.nombre,
    cantidadOriginal: Number(dto.cantidadOriginal),
    cantidadAjustada: Number(dto.cantidadAjustada),
    unidadMedida: dto.unidadMedida,
    cantidadEnAlacena: Number(dto.cantidadEnAlacena),
    cantidadFaltante: Number(dto.cantidadFaltante),
    alcanzaStock: Boolean(dto.alcanzaStock),
    unidadEnAlacena: dto.unidadEnAlacena ?? null,
    unidadCompatible: dto.unidadCompatible !== false,
  }
}

function mapIngredienteDescuento(dto) {
  return {
    ingredienteId: dto.ingredienteId,
    nombre: dto.nombre,
    cantidadDisponible: Number(dto.cantidadDisponible),
    cantidadNecesaria: Number(dto.cantidadNecesaria),
    cantidadPosterior: Number(dto.cantidadPosterior),
    cantidadFaltante: Number(dto.cantidadFaltante),
    unidadMedida: dto.unidadMedida,
    unidadEnAlacena: dto.unidadEnAlacena ?? null,
    unidadCompatible: dto.unidadCompatible !== false,
  }
}

export const preparacionService = {
  async previsualizarPorciones({ recetaId, nuevasPorciones, sustituciones = [] }) {
    const { data } = await http.post("/api/Preparacion/previsualizar-porciones", {
      recetaId,
      nuevasPorciones,
      sustituciones,
    })
    return {
      receta: data.receta,
      porcionesOriginales: data.porcionesOriginales,
      nuevasPorciones: data.nuevasPorciones,
      alcanzaStock: Boolean(data.alcanzaStock),
      hayFaltantes: Boolean(data.hayFaltantes),
      ingredientes: (data.ingredientes ?? []).map(mapIngredienteAjustado),
      ingredientesFaltantes: (data.ingredientesFaltantes ?? []).map(mapIngredienteAjustado),
    }
  },

  async agregarFaltantes({ recetaId, nuevasPorciones, sustituciones = [] }) {
    const { data } = await http.post("/api/Preparacion/agregar-faltantes", {
      recetaId,
      nuevasPorciones,
      sustituciones,
    })
    return data ?? []
  },

  async aplicarSustituto({ recetaId, ingredienteOriginalId, ingredienteSustitutoId }) {
    const { data } = await http.post("/api/Preparacion/aplicar-sustituto", {
      recetaId,
      ingredienteOriginalId,
      ingredienteSustitutoId,
    })
    return { mensaje: data.mensaje }
  },

  async previsualizarDescuento({ recetaId, porcionesCocinadas, sustituciones = [] }) {
    const { data } = await http.post("/api/Preparacion/previsualizar-descuento-stock", {
      recetaId,
      porcionesCocinadas,
      sustituciones,
    })
    return {
      receta: data.receta,
      porcionesCocinadas: data.porcionesCocinadas,
      ingredientes: (data.ingredientes ?? []).map(mapIngredienteDescuento),
    }
  },

  async descontarStock({ recetaId, porcionesCocinadas, cantidadesUtilizadas = [], sustituciones = [] }) {
    const { data } = await http.post("/api/Preparacion/descontar-stock", {
      recetaId,
      porcionesCocinadas,
      cantidadesUtilizadas,
      sustituciones,
    })
    return mapResultadoDescuento(data)
  },

  async descontarStockParcial({ recetaId, porcionesCocinadas, sustituciones = [] }) {
    const { data } = await http.post("/api/Preparacion/descontar-stock-parcial", {
      recetaId,
      porcionesCocinadas,
      sustituciones,
    })
    return mapResultadoDescuento(data)
  },
}
