export function recetaDetallePath(id) {
  return `/recetas/${id}`
}

export function cocinarPath(id) {
  return `/recetas/${id}/cocinar`
}

export function planificarPath(id) {
  return `/planificador?receta=${id}`
}
