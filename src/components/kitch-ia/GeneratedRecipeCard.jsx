import { useState } from "react"
import { CheckCircle2, ChefHat, Clock } from "lucide-react"
import MissingIngredientsChecklist from "../recipes/MissingIngredientsChecklist"
import Button from "../ui/Button"
import Card from "../ui/Card"
import StatusBanner from "../ui/StatusBanner"
import { recetaDetallePath } from "../../constants/paths"
import { preparacionService } from "../../services/preparacionService"
import { recetaIaService } from "../../services/recetaIaService"
import { formatDificultad } from "../../utils/dificultad"

const TONES = {
  ai: "bg-ai text-warning",
  success: "bg-success/15 text-success",
  warning: "bg-warning/20 text-warning",
  accent: "bg-accent/40 text-ink",
  primary: "bg-primary/10 text-primary",
}

function GeneratedRecipeCard({ receta, onSaved }) {
  const [expanded, setExpanded] = useState(false)
  const [saving, setSaving] = useState(false)
  const [savedId, setSavedId] = useState(receta.recetaId ?? null)
  const [faltantes, setFaltantes] = useState(null)
  const [marcandoId, setMarcandoId] = useState(null)
  const [notice, setNotice] = useState("")
  const [error, setError] = useState("")
  const cover = TONES[receta.tone] ?? TONES.ai
  const porciones = receta.porciones > 0 ? receta.porciones : 1

  async function handleSave() {
    setError("")
    setSaving(true)
    try {
      const guardada = await recetaIaService.guardar(receta)
      setSavedId(guardada.recetaId)
      onSaved?.()
      const preview = await preparacionService.previsualizarPorciones({
        recetaId: guardada.recetaId,
        nuevasPorciones: porciones,
      })
      setFaltantes(preview.ingredientesFaltantes)
    } catch (err) {
      setError(err.message || "No pudimos guardar la receta.")
    } finally {
      setSaving(false)
    }
  }

  async function handleMarcarDisponible(item) {
    setError("")
    setNotice("")
    setMarcandoId(item.ingredienteId)
    try {
      const preview = await preparacionService.marcarFaltanteDisponible({
        recetaId: savedId,
        ingredienteId: item.ingredienteId,
        nuevasPorciones: porciones,
      })
      setFaltantes(preview.ingredientesFaltantes)
      setNotice(`Sumamos ${item.nombre} a tu alacena.`)
    } catch (err) {
      setError(err.message || "No pudimos actualizar tu alacena.")
    } finally {
      setMarcandoId(null)
    }
  }

  return (
    <Card padding={false} className="flex flex-col overflow-hidden">
      <div className={`flex h-40 items-center justify-center ${cover}`} aria-hidden="true">
        <ChefHat size={40} strokeWidth={1.75} />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-bold tracking-tight text-ink">{receta.titulo}</h3>
        {receta.descripcion ? (
          <p className="mt-1 text-sm text-muted">{receta.descripcion}</p>
        ) : null}

        <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
          <span className="inline-flex items-center gap-1.5">
            <Clock size={15} aria-hidden="true" />
            {receta.tiempoPreparacionMinutos} min
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CheckCircle2 size={15} aria-hidden="true" />
            {formatDificultad(receta.dificultad)}
          </span>
          {receta.porciones ? <span>{receta.porciones} porciones</span> : null}
        </p>

        {expanded ? (
          <div className="animate-fade-up mt-4 grid gap-4 border-t border-line pt-4">
            <section>
              <h4 className="text-sm font-semibold text-ink">Ingredientes</h4>
              <ul className="mt-2 space-y-1 text-sm text-ink">
                {receta.ingredientes.map((item, index) => (
                  <li key={`${item.nombre}-${index}`}>
                    {item.cantidad} {item.unidadMedida} de {item.nombre}
                  </li>
                ))}
              </ul>
            </section>
            <section>
              <h4 className="text-sm font-semibold text-ink">Preparación</h4>
              <ol className="mt-2 list-decimal space-y-2 pl-5 text-sm text-ink">
                {receta.pasos.map((paso, index) => (
                  <li key={index}>{paso}</li>
                ))}
              </ol>
            </section>
          </div>
        ) : null}

        {faltantes ? (
          faltantes.length > 0 ? (
            <div className="mt-4 grid gap-3 rounded-2xl bg-ai p-4">
              <div>
                <p className="text-sm font-semibold text-ink">Te falta:</p>
                <p className="mt-1 text-sm text-muted">
                  Tildá lo que ya conseguiste y lo sumamos a tu alacena.
                </p>
              </div>
              <MissingIngredientsChecklist
                faltantes={faltantes}
                marcandoId={marcandoId}
                onMarcar={handleMarcarDisponible}
              />
            </div>
          ) : (
            <p className="mt-4 text-sm font-medium text-success" role="status">
              Tenés todo en tu alacena para cocinarla.
            </p>
          )
        ) : null}

        {savedId ? (
          <StatusBanner message="Receta guardada en Mis recetas." className="mt-4 w-full" />
        ) : null}

        {notice ? <StatusBanner message={notice} className="mt-3 w-full" /> : null}

        {error ? (
          <p className="mt-3 text-sm text-primary" role="alert">
            {error}
          </p>
        ) : null}

        <div className="mt-5 flex flex-col items-center gap-3">
          <Button
            size="md"
            className="w-full"
            aria-expanded={expanded}
            onClick={() => setExpanded((current) => !current)}
          >
            {expanded ? "Ocultar receta" : "Ver receta →"}
          </Button>
          {savedId ? (
            <Button to={recetaDetallePath(savedId)} variant="outline" size="md" className="w-full">
              Abrir en mis recetas
            </Button>
          ) : (
            <>
              <Button variant="outline" size="md" className="w-full" loading={saving} onClick={handleSave}>
                Guardar receta
              </Button>
              <p className="text-center text-xs text-muted">
                La guarda en Recetas. Favoritos es aparte: se marca con el corazón.
              </p>
            </>
          )}
        </div>
      </div>
    </Card>
  )
}

export default GeneratedRecipeCard
