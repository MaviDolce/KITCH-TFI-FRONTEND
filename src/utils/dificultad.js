const LABELS = {
  Facil: "Fácil",
  Medio: "Medio",
  Dificil: "Difícil",
}

export function formatDificultad(dificultad) {
  return LABELS[dificultad] ?? dificultad
}
