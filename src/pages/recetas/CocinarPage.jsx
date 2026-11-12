import { useEffect, useMemo, useState } from "react"
import { ArrowLeft } from "lucide-react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import CookStep from "../../components/cocinar/CookStep"
import StockPreview from "../../components/cocinar/StockPreview"
import Button from "../../components/ui/Button"
import Card from "../../components/ui/Card"
import Spinner from "../../components/ui/Spinner"
import TextLink from "../../components/ui/TextLink"
import { recetaDetallePath } from "../../constants/paths"
import { ROUTES } from "../../constants/routes"
import { ApiError } from "../../api/errors"
import { preparacionService } from "../../services/preparacionService"
import { recetasService } from "../../services/recetasService"
import {
  cantidadesIniciales,
  readCookState,
  reemplazoPorSustituto,
  toCantidadesUtilizadas,
  toSustituciones,
} from "../../utils/cookSession"
import { formatCantidad } from "../../utils/stock"

function MovimientosList({ titulo, items }) {
  if (!items?.length) {
    return null
  }
  return (
    <div className="mt-3">
      <p className="text-sm font-semibold text-ink">{titulo}</p>
      <ul className="mt-1 grid gap-0.5 text-sm text-muted">
        {items.map((item) => (
          <li key={`${titulo}-${item.nombre}`}>
            {item.nombre}: {formatCantidad(item.cantidad)} {item.unidadMedida}
          </li>
        ))}
      </ul>
    </div>
  )
}

function CocinarPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [receta, setReceta] = useState(null)
  const [planError, setPlanError] = useState("")
  const [loaded, setLoaded] = useState(false)
  const [paso, setPaso] = useState(0)
  const [completados, setCompletados] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [preview, setPreview] = useState(null)
  const [cantidades, setCantidades] = useState({})
  const [loadingPreview, setLoadingPreview] = useState(false)
  const [saving, setSaving] = useState(false)
  const [modalError, setModalError] = useState("")
  const [ofrecerParcial, setOfrecerParcial] = useState(false)
  const [resultado, setResultado] = useState(null)

  useEffect(() => {
    let active = true
    recetasService
      .getDetalle(id)
      .then((found) => {
        if (!active) {
          return
        }
        setReceta(found)
        setPaso(0)
        setCompletados([])
        setResultado(null)
        setPlanError("")
        setLoaded(true)
      })
      .catch((err) => {
        if (!active) {
          return
        }
        if (err instanceof ApiError && err.status === 403) {
          setPlanError(err.message)
        }
        setReceta(null)
        setLoaded(true)
      })
    return () => {
      active = false
    }
  }, [id])

  const session = useMemo(() => readCookState(location.state, receta), [location.state, receta])
  const sustituciones = useMemo(() => toSustituciones(session.replacements), [session.replacements])
  const finished = Boolean(resultado)

  const previewConReemplazos = useMemo(() => {
    if (!preview) {
      return null
    }
    return {
      ...preview,
      ingredientes: preview.ingredientes.map((item) => ({
        ...item,
        reemplazaA: reemplazoPorSustituto(session.replacements, item.ingredienteId)?.reemplazaA,
      })),
    }
  }, [preview, session.replacements])

  const hayFaltantes = (preview?.ingredientes ?? []).some((item) => item.cantidadFaltante > 0)

  function handleVolver() {
    if (window.history.state?.idx > 0) {
      navigate(-1)
      return
    }
    navigate(recetaDetallePath(receta.recetaId), { replace: true })
  }

  function handleToggleDone(numeroPaso) {
    setCompletados((current) =>
      current.includes(numeroPaso)
        ? current.filter((item) => item !== numeroPaso)
        : [...current, numeroPaso],
    )
  }

  async function handleAbrirFinalizar() {
    if (!receta || finished) {
      return
    }
    setModalOpen(true)
    setModalError("")
    setOfrecerParcial(false)
    setLoadingPreview(true)
    try {
      const result = await preparacionService.previsualizarDescuento({
        recetaId: receta.recetaId,
        porcionesCocinadas: session.porciones,
        sustituciones,
      })
      setPreview(result)
      setCantidades(cantidadesIniciales(result))
    } catch (err) {
      setModalError(err.message)
    } finally {
      setLoadingPreview(false)
    }
  }

  function handleChangeCantidad(ingredienteId, value) {
    setCantidades((current) => ({ ...current, [ingredienteId]: value }))
  }

  function handleCerrarModal() {
    if (saving) {
      return
    }
    setModalOpen(false)
  }

  async function handleConfirmar() {
    const cantidadesUtilizadas = toCantidadesUtilizadas(cantidades)
    if (!cantidadesUtilizadas) {
      setModalError("Revisá las cantidades: tienen que ser números iguales o mayores a 0.")
      return
    }
    setModalError("")
    setSaving(true)
    try {
      const result = await preparacionService.descontarStock({
        recetaId: receta.recetaId,
        porcionesCocinadas: session.porciones,
        cantidadesUtilizadas,
        sustituciones,
      })
      setResultado(result)
      setModalOpen(false)
    } catch (err) {
      setModalError(err.message)
      setOfrecerParcial(err instanceof ApiError && err.status === 400)
    } finally {
      setSaving(false)
    }
  }

  async function handleDescontarParcial() {
    setModalError("")
    setSaving(true)
    try {
      const result = await preparacionService.descontarStockParcial({
        recetaId: receta.recetaId,
        porcionesCocinadas: session.porciones,
        sustituciones,
      })
      setResultado(result)
      setModalOpen(false)
    } catch (err) {
      setModalError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (!loaded) {
    return (
      <div className="flex min-h-64 items-center justify-center" role="status" aria-label="Cargando modo cocina">
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
        <p className="mt-2 text-base text-muted">{planError || "Esa receta no está en el catálogo."}</p>
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

  const totalPasos = receta.preparaciones.length
  const pasoActual = receta.preparaciones[paso]
  const firstStep = paso === 0
  const lastStep = paso === totalPasos - 1
  const showAnterior = !firstStep
  const showSiguiente = !lastStep
  const showFinalizar = lastStep && !finished
  const showBar = showAnterior || showSiguiente || showFinalizar

  return (
    <div className="relative isolate overflow-hidden">
      <div
        className="pointer-events-none absolute -top-16 right-6 size-56 rounded-full bg-warning/20 blur-3xl"
        aria-hidden="true"
      />

      <Button type="button" variant="ghost" size="md" className="relative -ml-2" onClick={handleVolver}>
        <ArrowLeft size={18} aria-hidden="true" />
        Volver a la receta
      </Button>

      <header className="relative mt-4">
        <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">{receta.titulo}</h1>
        <p className="mt-2 text-base text-muted">
          {session.porciones} porciones
          {receta.porciones !== session.porciones ? ` · receta base ${receta.porciones}` : ""}
          {totalPasos > 0 ? ` · ${completados.length} de ${totalPasos} pasos completados` : ""}
        </p>
      </header>

      {pasoActual ? (
        <div className="relative mt-6">
          <CookStep
            paso={pasoActual}
            total={totalPasos}
            done={completados.includes(pasoActual.numeroPaso)}
            onToggleDone={handleToggleDone}
          />

          {finished && lastStep ? (
            <Card tone="ai" className="mt-4 max-w-2xl" role="status" aria-live="polite">
              <p className="text-2xl font-bold tracking-tight text-ink">¡Buen provecho!</p>
              {resultado.mensaje ? <p className="mt-2 text-sm text-muted">{resultado.mensaje}</p> : null}
              <MovimientosList titulo="Descontado de tu alacena" items={resultado.descontados} />
              <MovimientosList titulo="Faltó en tu alacena" items={resultado.faltantes} />
              <MovimientosList titulo="No descontado (otra unidad)" items={resultado.noDescontados} />
              <div className="mt-4 flex flex-wrap gap-2">
                <Button to={ROUTES.alacena} variant="outline" size="md">
                  Ver alacena
                </Button>
                {resultado.faltantes.length > 0 ? (
                  <Button to={ROUTES.compras} variant="outline" size="md">
                    Ver lista de compras
                  </Button>
                ) : null}
              </div>
            </Card>
          ) : null}

          {showBar ? (
            <>
              <div className="fixed inset-x-0 bottom-[5.5rem] z-10 flex flex-wrap gap-3 border-t border-line bg-canvas/95 px-4 py-3 backdrop-blur-sm lg:static lg:mt-4 lg:border-0 lg:bg-transparent lg:px-0 lg:py-0 lg:backdrop-blur-none">
                {showAnterior ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="md"
                    onClick={() => setPaso((current) => Math.max(0, current - 1))}
                  >
                    Anterior
                  </Button>
                ) : null}
                {showSiguiente ? (
                  <Button
                    type="button"
                    size="md"
                    onClick={() => setPaso((current) => Math.min(totalPasos - 1, current + 1))}
                  >
                    Siguiente
                  </Button>
                ) : null}
                {showFinalizar ? (
                  <Button type="button" size="md" onClick={handleAbrirFinalizar}>
                    Finalizar y servir
                  </Button>
                ) : null}
              </div>
              <div className="h-24 lg:hidden" aria-hidden="true" />
            </>
          ) : null}
        </div>
      ) : null}

      {modalOpen ? (
        <div
          className="fixed inset-0 z-30 flex items-end justify-center bg-ink/40 p-4 sm:items-center"
          role="presentation"
          onClick={handleCerrarModal}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Finalizar y servir"
            className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-surface p-6 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            {loadingPreview ? (
              <div className="flex justify-center py-8" role="status" aria-label="Calculando descuento">
                <Spinner size={24} className="text-primary" />
              </div>
            ) : (
              <StockPreview
                embedded
                preview={previewConReemplazos}
                cantidades={cantidades}
                onChangeCantidad={handleChangeCantidad}
              />
            )}

            {hayFaltantes && !loadingPreview ? (
              <p className="mt-4 text-sm text-primary">
                No te alcanza el stock de algunos ingredientes. Podés ajustar las cantidades o descontar solo lo que tenés.
              </p>
            ) : null}

            {modalError ? (
              <p className="mt-4 text-sm text-primary" role="alert">
                {modalError}
              </p>
            ) : null}

            <div className="mt-5 flex flex-col gap-2 sm:flex-row">
              <Button
                type="button"
                size="md"
                className="flex-1"
                loading={saving}
                disabled={loadingPreview || !preview}
                onClick={handleConfirmar}
              >
                Confirmar y descontar
              </Button>
              {hayFaltantes || ofrecerParcial ? (
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  className="flex-1"
                  disabled={saving || loadingPreview}
                  onClick={handleDescontarParcial}
                >
                  Descontar lo que tengo
                </Button>
              ) : null}
              <Button type="button" variant="ghost" size="md" disabled={saving} onClick={handleCerrarModal}>
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default CocinarPage
