import { Sparkles } from "lucide-react"
import RecipeCard from "../recipes/RecipeCard"
import SubstitutionList from "./SubstitutionList"
function AssistantMessage({ message, favorites, onToggleFavorite }) {
  const receta = message.receta ?? null
  const recomendaciones = message.recomendaciones ?? []

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start gap-2">
        <Sparkles size={18} className="mt-0.5 shrink-0 text-primary" aria-hidden="true" />
        <div>
          <p className="text-sm font-semibold text-primary">Kitch</p>
          <p className="mt-1 text-sm leading-relaxed text-ink">{message.mensaje}</p>
        </div>
      </div>

      {receta ? (
        <div className="max-w-md">
          <RecipeCard
            receta={receta}
            favorite={favorites.includes(receta.recetaId)}
            onToggleFavorite={onToggleFavorite}
          />
        </div>
      ) : null}

      {recomendaciones.length > 0 ? (
        <ul className="grid gap-4 sm:grid-cols-2">
          {recomendaciones.map((recetaItem) => (
            <li key={recetaItem.recetaId}>
              <RecipeCard
                receta={recetaItem}
                favorite={favorites.includes(recetaItem.recetaId)}
                onToggleFavorite={onToggleFavorite}
              />
            </li>
          ))}
        </ul>
      ) : null}

      {message.sustitutos?.length ? (
        <SubstitutionList
          ingrediente={message.ingredienteSustituido}
          sustitutos={message.sustitutos}
        />
      ) : null}
    </div>
  )
}

export default AssistantMessage
