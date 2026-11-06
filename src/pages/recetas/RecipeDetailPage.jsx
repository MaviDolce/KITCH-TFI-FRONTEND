import { useEffect, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
  ArrowLeft,
  CheckCircle2,
  ChefHat,
  Clock,
  Flame,
  Heart,
  Users,
} from "lucide-react"
import PortionStepper from "../../components/cocinar/PortionStepper"
import IngredientList from "../../components/recipes/IngredientList"
import Button from "../../components/ui/Button"
import Card from "../../components/ui/Card"
import IconButton from "../../components/ui/IconButton"
import Spinner from "../../components/ui/Spinner"
import TextLink from "../../components/ui/TextLink"
import { planificarPath, cocinarPath } from "../../constants/paths"
import { ROUTES } from "../../constants/routes"
import { ApiError } from "../../api/errors"
import { favoritosService } from "../../services/favoritosService"
import { recetasService } from "../../services/recetasService"
import { stockService } from "../../services/stockService"
import { sustitutosService } from "../../services/sustitutosService"
import { buildCookState } from "../../utils/cookSession"
import { formatDificultad } from "../../utils/dificultad"
import { ingredientesAjustados } from "../../utils/porciones"

const TONES = {
  ai: "bg-ai text-warning",
  success: "bg-success/15 text-success",
  warning: "bg-warning/20 text-warning",
  accent: "bg-accent/40 text-ink",
  primary: "bg-primary/10 text-primary",
}

function RecipeDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [receta, setReceta] = useState(null)
  const [loadedId, setLoadedId] = useState(null)
  const [favorite, setFavorite] = useState(false)
  const [porciones, setPorciones] = useState(1)
  const [replacements, setReplacements] = useState({})
  const [planError, setPlanError] = useState("")
  const [actionError, setActionError] = useState("")
  const loading = loadedId !== String(id)

  useEffect(() => {
    let active = true
    setPlanError("")
    setActionError("")

    async function load() {
      try {
        const found = await recetasService.getDetalle(id)
        if (!active) {
          return
        }
        const [stock, favoriteIds] = await Promise.all([
          stockService.listar().catch(() => []),
          favoritosService.listIds().catch(() => []),
        ])
        const ingredientes = await Promise.all(
          (found.ingredientes ?? []).map(async (ingrediente) => {
            const sustitutos = await sustitutosService
              .listarPorIngrediente(ingrediente.ingredienteId, stock)
              .catch(() => [])
            const enAlacena = stock.some(
              (item) =>
                item.ingredienteId === ingrediente.ingredienteId ||
                item.nombreIngrediente?.toLowerCase() === ingrediente.nombre?.toLowerCase(),
            )
            return { ...ingrediente, sustitutos, enAlacena }
          }),
        )
        if (!active) {
          return
        }
        setReceta({ ...found, ingredientes })
        setLoadedId(String(id))
        setPorciones(found.porciones || 1)
        setReplacements({})
        setFavorite(favoriteIds.includes(found.recetaId))
      } catch (error) {
        if (!active) {
          return
        }
        if (error instanceof ApiError && error.status === 403) {
          setPlanError(error.message)
        }
        setReceta(null)
        setLoadedId(String(id))
      }
    }

    load()
    return () => {
      active = false
    }
  }, [id])

  const ajustados = useMemo(() => {
    if (!receta) {
      return []
    }
    return ingredientesAjustados(receta.ingredientes, porciones, receta.porciones, replacements)
  }, [receta, porciones, replacements])

  async function handleToggleFavorite() {
    if (!receta) {
      return
    }
    setActionError("")
    try {
      const result = await favoritosService.toggle(receta.recetaId)
      setFavorite(result.esFavorito)
    } catch (error) {
      setActionError(error.message)
    }
  }

  function handleSelectReplacement(nombre, item) {
    setReplacements((current) => {
      const next = { ...current }
      if (!item) {
        delete next[nombre]
      } else {
        next[nombre] = item
      }
      return next
    })
  }

  function handleCocinar() {
    if (!receta) {
      return
    }
    navigate(cocinarPath(receta.recetaId), {
      state: buildCookState(porciones, replacements),
    })
  }

  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center" role="status" aria-label="Cargando receta">
        <Spinner size={24} className="text-primary" />
      </div>
    )
  }

  if (!receta) {
    return (
      <section className="max-w-xl">
        <h1 className="text-3xl font-bold tracking-tight text-ink">
          {planError ? "Plan insuficiente" : "Receta no encontrada"}
        </h1>
        <p className="mt-2 text-base text-muted">
          {planError || "Esa receta no está en el catálogo."}
        </p>
        {planError ? (
          <Button to={ROUTES.suscripcion} size="md" className="mt-6">
            Ver Kitch Premium
          </Button>
        ) : (
          <TextLink to={ROUTES.explorar} className="mt-6 inline-flex">
            Volver a Explorar
          </TextLink>
        )}
      </section>
    )
  }

  const cover = TONES[receta.tone] ?? TONES.ai
  const faltantes = receta.ingredientes.filter((item) => !item.enAlacena)

  return (
    <article className="max-w-3xl">
      <Button type="button" variant="ghost" size="md" onClick={() => navigate(-1)} className="-ml-2">
        <ArrowLeft size={18} aria-hidden="true" />
        Volver
      </Button>

      <Card padding={false} className="mt-4 overflow-hidden">
        <div className={`flex h-44 items-center justify-center ${cover}`} aria-hidden="true">
          <ChefHat size={56} strokeWidth={1.6} />
        </div>
        <div className="p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-ink">{receta.titulo}</h1>
              <p className="mt-2 text-base leading-relaxed text-muted">{receta.descripcion}</p>
            </div>
            <IconButton
              label={favorite ? "Quitar de favoritos" : "Agregar a favoritos"}
              onClick={handleToggleFavorite}
              className={favorite ? "text-primary" : undefined}
            >
              <Heart size={20} fill={favorite ? "currentColor" : "none"} />
            </IconButton>
          </div>

          <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted">
            <li className="inline-flex items-center gap-1.5">
              <Clock size={16} aria-hidden="true" />
              {receta.tiempoPreparacionMinutos} min
            </li>
            <li className="inline-flex items-center gap-1.5">
              <CheckCircle2 size={16} aria-hidden="true" />
              {formatDificultad(receta.dificultad)}
            </li>
            <li className="inline-flex items-center gap-1.5">
              <Users size={16} aria-hidden="true" />
              {porciones} porciones
            </li>
            <li className="inline-flex items-center gap-1.5">
              <Flame size={16} aria-hidden="true" />
              {receta.caloriasEstimadas} kcal
            </li>
          </ul>

          <p className="mt-4 text-sm font-medium text-primary">
            {typeof receta.porcentajeCoincidencia === "number"
              ? `${receta.porcentajeCoincidencia}% de ingredientes disponibles`
              : `${faltantes.length === 0 ? "Tenés todo" : `Faltan ${faltantes.map((item) => item.nombre).join(", ")}`}`}
            {typeof receta.porcentajeCoincidencia === "number" && faltantes.length > 0
              ? ` · Faltan ${faltantes.map((item) => item.nombre).join(", ")}`
              : typeof receta.porcentajeCoincidencia === "number"
                ? " · Tenés todo"
                : ""}
          </p>
          {actionError ? (
            <p className="mt-3 text-sm text-primary" role="alert">
              {actionError}
            </p>
          ) : null}

          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <Button type="button" size="md" className="flex-1" onClick={handleCocinar}>
              Cocinar
            </Button>
            <Button to={planificarPath(receta.recetaId)} variant="outline" size="md" className="flex-1">
              Planificar
            </Button>
          </div>
        </div>
      </Card>

      <Card className="mt-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-ink">Ingredientes</h2>
            <p className="mt-1 text-sm text-muted">
              Ajustá las porciones y los reemplazos antes de cocinar. Receta base: {receta.porciones} porciones.
            </p>
          </div>
          <PortionStepper value={porciones} onChange={setPorciones} />
        </div>
        <div className="mt-4">
          <IngredientList
            ingredientes={ajustados}
            replacements={replacements}
            onSelectReplacement={handleSelectReplacement}
          />
        </div>
      </Card>

      <Card className="mt-6">
        <h2 className="text-xl font-bold tracking-tight text-ink">Preparación</h2>
        <ol className="mt-4 grid gap-3">
          {receta.preparaciones.map((paso) => (
            <li key={paso.numeroPaso} className="flex gap-3">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                {paso.numeroPaso}
              </span>
              <p className="pt-1 text-base leading-relaxed text-ink">{paso.descripcionPaso}</p>
            </li>
          ))}
        </ol>
      </Card>
    </article>
  )
}

export default RecipeDetailPage
