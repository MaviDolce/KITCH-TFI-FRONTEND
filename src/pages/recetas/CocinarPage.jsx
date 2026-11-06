import { useEffect, useMemo, useState } from "react"
import { ArrowLeft } from "lucide-react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import CookStep from "../../components/cocinar/CookStep"
import Button from "../../components/ui/Button"
import Card from "../../components/ui/Card"
import Spinner from "../../components/ui/Spinner"
import TextLink from "../../components/ui/TextLink"
import { recetaDetallePath } from "../../constants/paths"
import { ROUTES } from "../../constants/routes"
import { ApiError } from "../../api/errors"
import { preparacionService } from "../../services/preparacionService"
import { recetasService } from "../../services/recetasService"
import { readCookState } from "../../utils/cookSession"

function CocinarPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [receta, setReceta] = useState(null)
  const [planError, setPlanError] = useState("")
  const [loaded, setLoaded] = useState(false)
  const [paso, setPaso] = useState(0)
  const [saving, setSaving] = useState(false)
  const [finished, setFinished] = useState(false)
  const [notice, setNotice] = useState("")
  const [error, setError] = useState("")

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
        setFinished(false)
        setNotice("")
        setError("")
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

  async function handleFinalizar() {
    if (!receta || finished) {
      return
    }
    setError("")
    setNotice("")
    setSaving(true)
    try {
      const result = await preparacionService.descontarStock({
        recetaId: receta.recetaId,
        porcionesCocinadas: session.porciones,
      })
      setFinished(true)
      setNotice(result.mensaje)
    } catch (err) {
      setError(err.message)
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

      <Button
        type="button"
        variant="ghost"
        size="md"
        className="relative -ml-2"
        onClick={() => navigate(recetaDetallePath(receta.recetaId))}
      >
        <ArrowLeft size={18} aria-hidden="true" />
        Volver a la receta
      </Button>

      <header className="relative mt-4">
        <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">{receta.titulo}</h1>
        <p className="mt-2 text-base text-muted">
          {session.porciones} porciones
          {receta.porciones !== session.porciones ? ` · receta base ${receta.porciones}` : ""}
        </p>
      </header>

      {pasoActual ? (
        <div className="relative mt-6">
          <CookStep paso={pasoActual} total={totalPasos} />

          {finished && lastStep ? (
            <Card tone="ai" className="mt-4 max-w-2xl" role="status" aria-live="polite">
              <p className="text-2xl font-bold tracking-tight text-ink">¡Buen provecho!</p>
              {notice ? <p className="mt-2 text-sm text-muted">{notice}</p> : null}
              <Button to={ROUTES.alacena} variant="outline" size="md" className="mt-4">
                Ver alacena
              </Button>
            </Card>
          ) : null}

          {error ? (
            <p className="mt-3 text-sm text-primary" role="alert">
              {error}
            </p>
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
                  <Button type="button" size="md" loading={saving} onClick={handleFinalizar}>
                    Finalizar
                  </Button>
                ) : null}
              </div>
              <div className="h-24 lg:hidden" aria-hidden="true" />
            </>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

export default CocinarPage
