import Badge from "../ui/Badge"
import Button from "../ui/Button"
import Card from "../ui/Card"
import { recetaDetallePath } from "../../constants/paths"
import { formatDificultad } from "../../utils/dificultad"

function FeaturedRecipeCard({ receta }) {
  if (!receta) {
    return null
  }

  return (
    <Card tone="ai" className="max-w-3xl sm:p-8">
      <Badge>Recomendación destacada</Badge>
      <h2 className="mt-2 text-2xl font-bold tracking-tight text-primary sm:text-3xl">
        {receta.titulo}
      </h2>
      <p className="mt-2 text-sm text-muted">
        {receta.tiempoPreparacionMinutos} min · {formatDificultad(receta.dificultad)}
        {typeof receta.ingredientesDisponibles === "number"
          ? ` · ${receta.ingredientesDisponibles} ingredientes disponibles`
          : ""}
      </p>
      <Button
        to={recetaDetallePath(receta.recetaId)}
        variant="soft"
        size="md"
        className="mt-5"
      >
        Ver receta →
      </Button>
    </Card>
  )
}

export default FeaturedRecipeCard
