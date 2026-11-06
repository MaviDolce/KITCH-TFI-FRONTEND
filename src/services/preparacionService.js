import { http } from "../api/http"

export const preparacionService = {
  async previsualizarPorciones({ recetaId, nuevasPorciones }) {
    const { data } = await http.post("/api/Preparacion/previsualizar-porciones", {
      recetaId,
      nuevasPorciones,
    })
    return data
  },

  async previsualizarDescuento({ recetaId, porcionesCocinadas }) {
    const { data } = await http.post("/api/Preparacion/previsualizar-descuento-stock", {
      recetaId,
      porcionesCocinadas,
    })
    return data
  },

  async descontarStock({ recetaId, porcionesCocinadas }) {
    const { data } = await http.post("/api/Preparacion/descontar-stock", {
      recetaId,
      porcionesCocinadas,
    })
    return { mensaje: data.mensaje, descontados: [] }
  },
}
