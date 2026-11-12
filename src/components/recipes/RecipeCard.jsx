import { CheckCircle2, ChefHat, Clock, Heart } from "lucide-react"
import Button from "../ui/Button"
import Card from "../ui/Card"
import IconButton from "../ui/IconButton"
import TextLink from "../ui/TextLink"
import { planificarPath, recetaDetallePath } from "../../constants/paths"
import { formatDificultad } from "../../utils/dificultad"

const TONES = {
  ai: "bg-ai text-warning",
  success: "bg-success/15 text-success",
  warning: "bg-warning/20 text-warning",
  accent: "bg-accent/40 text-ink",
  primary: "bg-primary/10 text-primary",
}

function RecipeCard({ receta, favorite, onToggleFavorite }) {
  const cover = TONES[receta.tone] ?? TONES.ai

  return (
    <Card padding={false} className="flex flex-col overflow-hidden">
      <div className={`flex h-40 items-center justify-center ${cover}`} aria-hidden="true">
        <ChefHat size={40} strokeWidth={1.75} />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-bold tracking-tight text-ink">{receta.titulo}</h3>
          <IconButton
            label={favorite ? "Quitar de favoritos" : "Agregar a favoritos"}
            onClick={() => onToggleFavorite(receta.recetaId)}
            className={favorite ? "text-primary" : undefined}
          >
            <Heart size={18} fill={favorite ? "currentColor" : "none"} />
          </IconButton>
        </div>

        <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
          <span className="inline-flex items-center gap-1.5">
            <Clock size={15} aria-hidden="true" />
            {receta.tiempoPreparacionMinutos} min
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CheckCircle2 size={15} aria-hidden="true" />
            {formatDificultad(receta.dificultad)}
          </span>
        </p>
        {typeof receta.porcentajeCoincidencia === "number" ? (
          <p className="mt-2 text-sm font-medium text-primary">
            {receta.porcentajeCoincidencia}% de ingredientes disponibles
          </p>
        ) : null}
        {receta.ingredientesFaltantes?.length > 0 && receta.porcentajeCoincidencia > 0 ? (
          <p className="mt-1 text-sm text-muted">
            Te falta: {receta.ingredientesFaltantes.join(", ")}
          </p>
        ) : null}

        <div className="mt-5 flex flex-col items-center gap-3">
          <Button to={recetaDetallePath(receta.recetaId)} size="md" className="w-full">
            Ver receta →
          </Button>
          <TextLink to={planificarPath(receta.recetaId)}>Planificar</TextLink>
        </div>
      </div>
    </Card>
  )
}

export default RecipeCard
