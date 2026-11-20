import { useEffect, useMemo, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
  ArrowLeft,
  CheckCircle2,
  ChefHat,
  Clock,
  Flame,
  Heart,
  RotateCcw,
  Save,
  ShoppingCart,
  Trash2,
  Users,
} from "lucide-react"
import PortionStepper from "../../components/cocinar/PortionStepper"
import IngredientList from "../../components/recipes/IngredientList"
import MissingIngredientsChecklist from "../../components/recipes/MissingIngredientsChecklist"
import Button from "../../components/ui/Button"
import Card from "../../components/ui/Card"
import ConfirmModal from "../../components/ui/ConfirmModal"
import IconButton from "../../components/ui/IconButton"
import Spinner from "../../components/ui/Spinner"
import StatusBanner from "../../components/ui/StatusBanner"
import TextLink from "../../components/ui/TextLink"
import { cocinarPath, planificarPath, recetaDetallePath } from "../../constants/paths"
import { ROUTES } from "../../constants/routes"
import { ApiError } from "../../api/errors"
import { useAuth } from "../../hooks/useAuth"
import { useTransientNotice } from "../../hooks/useTransientNotice"
import { favoritosService } from "../../services/favoritosService"
import { preparacionService } from "../../services/preparacionService"
import { recetasService } from "../../services/recetasService"
import { sustitutosService } from "../../services/sustitutosService"
import {
  buildCookState,
  buildReplacement,
  clearRecipeDraft,
  loadRecipeDraft,
  resolverPasosAdaptados,
  saveRecipeDraft,
  toSustituciones,
} from "../../utils/cookSession"
import { formatDificultad } from "../../utils/dificultad"
import { filasIngredientes, roundCantidad } from "../../utils/porciones"

const PREVIEW_DEBOUNCE_MS = 350

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
  const { user } = useAuth()
  const [receta, setReceta] = useState(null)
  const [loadedId, setLoadedId] = useState(null)
  const [favorite, setFavorite] = useState(false)
  const [porciones, setPorciones] = useState(1)
  const [replacements, setReplacements] = useState({})
  const [adaptacion, setAdaptacion] = useState(null)
  const [guardandoAdaptacion, setGuardandoAdaptacion] = useState(false)
  const [sugerencias, setSugerencias] = useState({})
  const [preview, setPreview] = useState(null)
  const [previewError, setPreviewError] = useState("")
  const [agregando, setAgregando] = useState(false)
  const [estadoAgregados, setEstadoAgregados] = useState({ key: "", phase: "idle" })
  const [marcandoId, setMarcandoId] = useState(null)
  const exitTimerRef = useRef(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [eliminando, setEliminando] = useState(false)
  const [deleteError, setDeleteError] = useState("")
  const [planError, setPlanError] = useState("")
  const [actionError, setActionError] = useState("")
  const [notice, showNotice] = useTransientNotice()
  const loading = loadedId !== String(id)
  const esPropia = Boolean(receta?.usuarioId && user?.id && receta.usuarioId === user.id)
  const userId = user?.id ?? null

  useEffect(() => {
    let active = true
    setPlanError("")
    setActionError("")

    async function load() {
      try {
        const [found, favoriteIds] = await Promise.all([
          recetasService.getDetalle(id),
          favoritosService.listIds().catch(() => []),
        ])
        if (!active) {
          return
        }
        const draft = loadRecipeDraft(userId, found.recetaId, found.ingredientes)
        setReceta(found)
        setLoadedId(String(id))
        setPorciones(draft?.porciones ?? (found.porciones || 1))
        setReplacements(draft?.replacements ?? {})
        setAdaptacion(draft?.adaptacion ?? null)
        setSugerencias({})
        setPreview(null)
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
  }, [id, userId])

  const recetaId = receta?.recetaId
  const sustituciones = useMemo(() => toSustituciones(replacements), [replacements])
  const sustitucionesKey = JSON.stringify(sustituciones)

  useEffect(() => {
    if (!receta || loadedId !== String(id)) {
      return
    }
    saveRecipeDraft(userId, receta.recetaId, {
      porciones,
      basePorciones: receta.porciones || 1,
      replacements,
      adaptacion,
    })
  }, [receta, loadedId, id, userId, porciones, replacements, adaptacion])

  useEffect(() => {
    if (!recetaId) {
      return undefined
    }
    let active = true
    const timer = window.setTimeout(() => {
      preparacionService
        .previsualizarPorciones({
          recetaId,
          nuevasPorciones: porciones,
          sustituciones: JSON.parse(sustitucionesKey),
        })
        .then((result) => {
          if (active) {
            setPreview(result)
            setPreviewError("")
          }
        })
        .catch((error) => {
          if (active) {
            setPreviewError(error.message)
          }
        })
    }, PREVIEW_DEBOUNCE_MS)

    return () => {
      active = false
      window.clearTimeout(timer)
    }
  }, [recetaId, porciones, sustitucionesKey])

  const filas = useMemo(
    () => (receta ? filasIngredientes(receta.ingredientes, preview, replacements) : []),
    [receta, preview, replacements],
  )
  const faltantes = useMemo(() => preview?.ingredientesFaltantes ?? [], [preview])
  const faltantesKey = useMemo(
    () =>
      `${recetaId ?? ""}:${porciones}:${sustitucionesKey}:${faltantes
        .map((item) => `${item.ingredienteId}:${item.cantidadFaltante}`)
        .join(",")}`,
    [recetaId, porciones, sustitucionesKey, faltantes],
  )
  const mismoLoteAgregado = estadoAgregados.key === faltantesKey && faltantes.length > 0
  const checklistSaliendo = mismoLoteAgregado && estadoAgregados.phase === "exiting"
  const faltantesAgregados = mismoLoteAgregado && estadoAgregados.phase === "added"

  useEffect(() => {
    return () => {
      window.clearTimeout(exitTimerRef.current)
    }
  }, [])

  async function handleToggleFavorite() {
    if (!receta) {
      return
    }
    setActionError("")
    try {
      const result = await favoritosService.toggle(receta.recetaId)
      setFavorite(result.esFavorito)
      showNotice(result.message)
    } catch (error) {
      setActionError(error.message)
    }
  }

  function handleAbrirEliminar() {
    if (!receta || !esPropia || eliminando) {
      return
    }
    setActionError("")
    setDeleteError("")
    setConfirmOpen(true)
  }

  function handleCancelarEliminar() {
    if (eliminando) {
      return
    }
    setDeleteError("")
    setConfirmOpen(false)
  }

  async function handleConfirmarEliminar() {
    if (!receta || !esPropia || eliminando) {
      return
    }
    setDeleteError("")
    setEliminando(true)
    try {
      await recetasService.eliminar(receta.recetaId)
      navigate(ROUTES.explorar, { replace: true })
    } catch (error) {
      setDeleteError(error.message)
      setEliminando(false)
    }
  }

  function actualizarSugerencia(ingredienteId, patch) {
    setSugerencias((current) => ({
      ...current,
      [ingredienteId]: { ...current[ingredienteId], ...patch },
    }))
  }

  async function handleBuscarReemplazos(ingrediente) {
    actualizarSugerencia(ingrediente.ingredienteId, { loading: true, error: "" })
    try {
      const items = await sustitutosService.sugeridos(ingrediente.ingredienteId)
      actualizarSugerencia(ingrediente.ingredienteId, { loading: false, items })
    } catch (error) {
      actualizarSugerencia(ingrediente.ingredienteId, { loading: false, error: error.message })
    }
  }

  async function handleSelectReplacement(ingrediente, item) {
    setActionError("")
    if (!item) {
      const next = { ...replacements }
      delete next[ingrediente.ingredienteId]
      const restantes = Object.values(next)
      setReplacements(next)
      if (restantes.length === 0) {
        setAdaptacion(null)
        showNotice(`Volvimos a usar ${ingrediente.nombre}.`)
        return
      }
      const ultimo = restantes[restantes.length - 1]
      actualizarSugerencia(ingrediente.ingredienteId, { aplicando: -1 })
      try {
        const result = await preparacionService.aplicarSustituto({
          recetaId: receta.recetaId,
          ingredienteOriginalId: ultimo.ingredienteOriginalId,
          ingredienteSustitutoId: ultimo.ingredienteSustitutoId,
          sustitucionesActivas: toSustituciones(next),
        })
        setAdaptacion({
          titulo: result.titulo,
          descripcion: result.descripcion,
          ingredientes: result.ingredientes,
          preparaciones: result.preparaciones,
        })
        showNotice(`Volvimos a usar ${ingrediente.nombre}.`)
      } catch (error) {
        setAdaptacion(null)
        setActionError(error.message)
      } finally {
        actualizarSugerencia(ingrediente.ingredienteId, { aplicando: null })
      }
      return
    }
    actualizarSugerencia(ingrediente.ingredienteId, { aplicando: item.ingredienteId })
    try {
      const result = await preparacionService.aplicarSustituto({
        recetaId: receta.recetaId,
        ingredienteOriginalId: ingrediente.ingredienteId,
        ingredienteSustitutoId: item.ingredienteId,
        sustitucionesActivas: toSustituciones(replacements),
      })
      setReplacements((current) => ({
        ...current,
        [ingrediente.ingredienteId]: buildReplacement(ingrediente, item),
      }))
      setAdaptacion({
        titulo: result.titulo,
        descripcion: result.descripcion,
        ingredientes: result.ingredientes,
        preparaciones: result.preparaciones,
      })
      showNotice(result.mensaje)
    } catch (error) {
      setActionError(error.message)
    } finally {
      actualizarSugerencia(ingrediente.ingredienteId, { aplicando: null })
    }
  }

  function handleRestaurarOriginal() {
    if (!receta) {
      return
    }
    setActionError("")
    setReplacements({})
    setAdaptacion(null)
    setPorciones(receta.porciones || 1)
    clearRecipeDraft(userId, receta.recetaId)
    showNotice("Restauramos la receta original.")
  }

  async function handleGuardarAdaptacion() {
    if (!receta || guardandoAdaptacion) {
      return
    }
    setActionError("")
    setGuardandoAdaptacion(true)
    try {
      const ingredientesCombinados = new Map()
      for (const fila of filas) {
        const reemplazo = replacements[fila.ingredienteId]
        const ingredienteId = reemplazo?.ingredienteSustitutoId ?? fila.ingredienteId
        const cantidad = Math.max(0.01, roundCantidad(fila.cantidadAjustada ?? fila.cantidad))
        const unidadMedida = fila.unidad || fila.unidadMedida || "u"
        const existente = ingredientesCombinados.get(ingredienteId)
        if (existente) {
          existente.cantidad = roundCantidad(existente.cantidad + cantidad)
        } else {
          ingredientesCombinados.set(ingredienteId, {
            ingredienteId,
            cantidad,
            unidadMedida,
          })
        }
      }

      const pasosFinales = resolverPasosAdaptados(receta.preparaciones, adaptacion, replacements)
      const payload = {
        titulo: adaptacion?.titulo || receta.titulo,
        descripcion: adaptacion?.descripcion || receta.descripcion,
        caloriasEstimadas: receta.caloriasEstimadas,
        tiempoPreparacionMinutos: receta.tiempoPreparacionMinutos,
        porciones,
        dificultad: receta.dificultad,
        categoria: receta.categoria || "general",
        ingredientes: Array.from(ingredientesCombinados.values()),
        preparaciones: pasosFinales.map((paso, index) => ({
          numeroPaso: index + 1,
          descripcionPaso: paso.descripcionPaso,
        })),
      }

      if (esPropia) {
        await recetasService.actualizar(receta.recetaId, payload)
        clearRecipeDraft(userId, receta.recetaId)
        const actualizada = await recetasService.getDetalle(receta.recetaId)
        setReceta(actualizada)
        setPorciones(actualizada.porciones || 1)
        setReplacements({})
        setAdaptacion(null)
        setSugerencias({})
        showNotice("Guardamos los cambios en tu receta.")
      } else {
        const nueva = await recetasService.crear(payload)
        clearRecipeDraft(userId, receta.recetaId)
        navigate(recetaDetallePath(nueva.recetaId), { replace: true })
      }
    } catch (error) {
      setActionError(error.message)
    } finally {
      setGuardandoAdaptacion(false)
    }
  }

  async function handleAgregarFaltantes() {
    if (!receta || agregando || checklistSaliendo || faltantesAgregados) {
      return
    }
    setActionError("")
    setAgregando(true)
    const batchKey = faltantesKey
    const cantidadItems = faltantes.length
    try {
      await preparacionService.agregarFaltantes({
        recetaId: receta.recetaId,
        nuevasPorciones: porciones,
        sustituciones,
      })
      setEstadoAgregados({ key: batchKey, phase: "exiting" })
      const durationMs = Math.min(520, 280 + cantidadItems * 45)
      window.clearTimeout(exitTimerRef.current)
      exitTimerRef.current = window.setTimeout(() => {
        setEstadoAgregados((current) =>
          current.key === batchKey ? { key: batchKey, phase: "added" } : current,
        )
      }, durationMs)
    } catch (error) {
      setActionError(error.message)
    } finally {
      setAgregando(false)
    }
  }

  async function handleMarcarDisponible(item) {
    if (!receta) {
      return
    }
    setActionError("")
    setMarcandoId(item.ingredienteId)
    try {
      const actualizado = await preparacionService.marcarFaltanteDisponible({
        recetaId: receta.recetaId,
        ingredienteId: item.ingredienteId,
        nuevasPorciones: porciones,
        sustituciones,
      })
      setPreview(actualizado)
      showNotice(`Sumamos ${item.nombre} a tu alacena.`)
    } catch (error) {
      setActionError(error.message)
    } finally {
      setMarcandoId(null)
    }
  }

  function handleCocinar() {
    if (!receta) {
      return
    }
    navigate(cocinarPath(receta.recetaId), {
      state: buildCookState(porciones, replacements, adaptacion),
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
  const tieneReemplazos = Object.keys(replacements).length > 0
  const tituloMostrado = tieneReemplazos && adaptacion?.titulo ? adaptacion.titulo : receta.titulo
  const descripcionMostrada =
    tieneReemplazos && adaptacion?.descripcion ? adaptacion.descripcion : receta.descripcion
  const pasosMostrados = resolverPasosAdaptados(receta.preparaciones, adaptacion, replacements)
  const resumenStock = !preview
    ? ""
    : faltantes.length === 0
      ? "Tenés todo"
      : `Faltan ${faltantes.map((item) => item.nombre).join(", ")}`

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
              <h1 className="text-3xl font-bold tracking-tight text-ink">{tituloMostrado}</h1>
              <p className="mt-2 text-base leading-relaxed text-muted">{descripcionMostrada}</p>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              {esPropia ? (
                <IconButton
                  label="Eliminar receta"
                  onClick={handleAbrirEliminar}
                  disabled={eliminando}
                  className="text-primary"
                >
                  <Trash2 size={20} />
                </IconButton>
              ) : null}
              <IconButton
                label={favorite ? "Quitar de favoritos" : "Agregar a favoritos"}
                onClick={handleToggleFavorite}
                className={favorite ? "text-primary" : undefined}
              >
                <Heart
                  key={favorite ? "fav" : "nofav"}
                  size={20}
                  fill={favorite ? "currentColor" : "none"}
                  className={favorite ? "animate-heart-pop" : undefined}
                />
              </IconButton>
            </div>
          </div>

          {tieneReemplazos ? (
            <div className="animate-fade-up mt-4 flex flex-col gap-3 rounded-2xl bg-ai p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-ink">
                  Receta adaptada desde &ldquo;{receta.titulo}&rdquo;
                </p>
                <p className="mt-0.5 text-xs text-muted">
                  Tus cambios quedan recordados aunque salgas de esta pestaña.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  size="md"
                  loading={guardandoAdaptacion}
                  onClick={handleGuardarAdaptacion}
                >
                  <Save size={16} aria-hidden="true" />
                  {esPropia ? "Guardar cambios" : "Guardar como mi receta"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  disabled={guardandoAdaptacion}
                  onClick={handleRestaurarOriginal}
                >
                  <RotateCcw size={16} aria-hidden="true" />
                  Restaurar original
                </Button>
              </div>
            </div>
          ) : null}

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
            {[
              typeof receta.porcentajeCoincidencia === "number"
                ? `${receta.porcentajeCoincidencia}% de ingredientes disponibles`
                : "",
              resumenStock,
            ]
              .filter(Boolean)
              .join(" · ")}
          </p>
          {actionError ? <StatusBanner message={actionError} tone="error" className="mt-3" /> : null}
          {notice ? <StatusBanner message={notice} className="mt-3" /> : null}

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
        {previewError ? (
          <p className="mt-3 text-sm text-primary" role="alert">
            {previewError}
          </p>
        ) : null}
        <div className="mt-4">
          <IngredientList
            ingredientes={filas}
            replacements={replacements}
            sugerencias={sugerencias}
            onBuscar={handleBuscarReemplazos}
            onSelectReplacement={handleSelectReplacement}
          />
        </div>

        {faltantes.length > 0 ? (
          <div
            className={`mt-4 grid gap-3 overflow-hidden rounded-2xl p-4 transition-colors duration-300 ${
              faltantesAgregados ? "bg-success/10" : "bg-ai"
            }`}
            role={faltantesAgregados ? "status" : "alert"}
            aria-live="polite"
          >
            {faltantesAgregados ? (
              <div className="animate-confirm-pop flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <span
                    className="animate-badge-pop flex size-10 shrink-0 items-center justify-center rounded-full bg-success/15 text-success"
                    aria-hidden="true"
                  >
                    <CheckCircle2 size={22} />
                  </span>
                  <div>
                    <p className="text-base font-bold text-ink">¡Ya fueron agregados!</p>
                    <p className="text-sm text-muted">
                      Los ingredientes faltantes ya están en tu lista de compras.
                    </p>
                  </div>
                </div>
                <Button to={ROUTES.compras} variant="outline" size="md">
                  Ver lista de compras
                </Button>
              </div>
            ) : (
              <>
                <div
                  className={
                    checklistSaliendo
                      ? "opacity-40 transition-opacity duration-300"
                      : "transition-opacity duration-300"
                  }
                >
                  <p className="text-sm font-semibold text-ink">
                    Para {porciones} porciones te falta:
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    Tildá lo que ya conseguiste y lo sumamos a tu alacena.
                  </p>
                </div>
                <MissingIngredientsChecklist
                  faltantes={faltantes}
                  marcandoId={marcandoId}
                  onMarcar={handleMarcarDisponible}
                  exiting={checklistSaliendo}
                />
                <div
                  className={`flex flex-col gap-2 transition-opacity duration-200 sm:flex-row sm:items-center ${
                    checklistSaliendo ? "pointer-events-none opacity-0" : "opacity-100"
                  }`}
                >
                  <Button
                    type="button"
                    size="md"
                    loading={agregando}
                    disabled={checklistSaliendo}
                    onClick={handleAgregarFaltantes}
                  >
                    <ShoppingCart size={16} aria-hidden="true" />
                    Agregar faltantes a la lista de compras
                  </Button>
                  <TextLink to={ROUTES.compras}>Ver lista de compras</TextLink>
                </div>
              </>
            )}
          </div>
        ) : null}
      </Card>

      <Card className="mt-6">
        <h2 className="text-xl font-bold tracking-tight text-ink">Preparación</h2>
        <ol className="mt-4 grid gap-3">
          {pasosMostrados.map((paso) => (
            <li key={paso.numeroPaso} className="flex gap-3">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                {paso.numeroPaso}
              </span>
              <p className="pt-1 text-base leading-relaxed text-ink">{paso.descripcionPaso}</p>
            </li>
          ))}
        </ol>
      </Card>

      <ConfirmModal
        open={confirmOpen}
        title="Eliminar receta"
        description={`¿Seguro que querés eliminar "${receta.titulo}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        loading={eliminando}
        error={deleteError}
        onConfirm={handleConfirmarEliminar}
        onCancel={handleCancelarEliminar}
      />
    </article>
  )
}

export default RecipeDetailPage
