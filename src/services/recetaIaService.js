import { http } from "../api/http"

export const recetaIaService = {
  async guardar(receta) {
    const { data } = await http.post("/api/RecetaIa/guardar", {
      titulo: receta.titulo,
      descripcion: receta.descripcion ?? "",
      tiempoPreparacionMinutos: receta.tiempoPreparacionMinutos,
      porciones: receta.porciones,
      dificultad: receta.dificultad,
      caloriasEstimadas: receta.caloriasEstimadas,
      categoria: receta.categoria,
      ingredientes: (receta.ingredientes ?? []).map((item) => ({
        nombre: item.nombre,
        cantidad: item.cantidad,
        unidadMedida: item.unidadMedida ?? item.unidad,
      })),
      pasos: receta.pasos ?? [],
    })
    return {
      recetaId: data.recetaId,
      titulo: data.titulo,
      mensaje: data.mensaje,
    }
  },
}
