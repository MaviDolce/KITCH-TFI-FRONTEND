import { useCallback, useEffect, useRef, useState } from "react"
import { CircleCheck, Home, Sparkles, UserRound } from "lucide-react"
import PaymentForm from "../../components/suscripcion/PaymentForm"
import PlanCard from "../../components/suscripcion/PlanCard"
import SubscriptionStatus from "../../components/suscripcion/SubscriptionStatus"
import Button from "../../components/ui/Button"
import Card from "../../components/ui/Card"
import ConfirmModal from "../../components/ui/ConfirmModal"
import Spinner from "../../components/ui/Spinner"
import StatusBanner from "../../components/ui/StatusBanner"
import {
  PLAN_BASICO_FEATURES,
  PLAN_PREMIUM_FEATURES,
  PREMIUM_PLAN,
  formatMoney,
} from "../../constants/subscription"
import { ROLES } from "../../constants/roles"
import { ROUTES } from "../../constants/routes"
import { useAuth } from "../../hooks/useAuth"
import { suscripcionService } from "../../services/suscripcionService"

function SuscripcionPage() {
  const { user, refreshSession } = useAuth()
  const [suscripcion, setSuscripcion] = useState(null)
  const [pagos, setPagos] = useState([])
  const [plan, setPlan] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notice, setNotice] = useState("")
  const [cancelNotice, setCancelNotice] = useState("")
  const [planError, setPlanError] = useState("")
  const [verificando, setVerificando] = useState(false)
  const [verificacion, setVerificacion] = useState(null)
  const [cancelModalOpen, setCancelModalOpen] = useState(false)
  const [canceling, setCanceling] = useState(false)
  const [cancelError, setCancelError] = useState("")
  const verificacionInicialRef = useRef(false)

  const isBasico = user?.rol === ROLES.basico
  const isProfesional = user?.rol === ROLES.profesional
  const isAdmin = user?.rol === ROLES.admin

  const verificarPagos = useCallback(
    async ({ silencioso }) => {
      setVerificando(true)
      try {
        const resultado = await suscripcionService.verificarPagos()
        if (resultado.requiereRefrescarSesion) {
          await refreshSession()
        }
        if (!silencioso || resultado.pagosAplicados > 0) {
          setVerificacion({ tipo: resultado.pagosAplicados > 0 ? "exito" : "info", mensaje: resultado.mensaje })
        }
      } catch (err) {
        if (!silencioso) {
          setVerificacion({ tipo: "error", mensaje: err.message })
        }
      } finally {
        setVerificando(false)
      }
    },
    [refreshSession],
  )

  useEffect(() => {
    if (!user || isAdmin || verificacionInicialRef.current) {
      return
    }
    verificacionInicialRef.current = true
    verificarPagos({ silencioso: true })
  }, [user, isAdmin, verificarPagos])

  useEffect(() => {
    let active = true
    Promise.all([
      suscripcionService.getMine().catch(() => null),
      suscripcionService.listarPagos().catch(() => []),
      suscripcionService.getPlan().catch((err) => {
        if (active) {
          setPlanError(err.message)
        }
        return null
      }),
    ])
      .then(([data, historial, planActual]) => {
        if (active) {
          setSuscripcion(data)
          setPagos(historial)
          setPlan(planActual)
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false)
        }
      })
    return () => {
      active = false
    }
  }, [user?.rol])

  async function handleContratar(payload) {
    setCancelNotice("")
    const result = await suscripcionService.contratar(payload)
    setNotice(result.mensaje)
    if (!result.initPoint) {
      throw new Error("Mercado Pago no devolvió el enlace de pago. Intentá de nuevo.")
    }
    window.location.assign(result.initPoint)
    return result
  }

  function handleOpenCancelModal() {
    setCancelError("")
    setCancelModalOpen(true)
  }

  function handleCloseCancelModal() {
    if (!canceling) {
      setCancelModalOpen(false)
      setCancelError("")
    }
  }

  async function handleConfirmCancel() {
    setCanceling(true)
    setCancelError("")
    try {
      const resultado = await suscripcionService.cancelar()
      if (resultado.requiereRefrescarSesion) {
        await refreshSession()
      }
      setNotice("")
      setVerificacion(null)
      setCancelModalOpen(false)
      setCancelNotice(resultado.mensaje)
    } catch (err) {
      setCancelError(err.message)
    } finally {
      setCanceling(false)
    }
  }

  return (
    <div className="relative isolate overflow-hidden">
      <div
        className="pointer-events-none absolute -top-20 right-8 size-64 rounded-full bg-accent/30 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-40 -right-16 size-72 rounded-full bg-warning/20 blur-3xl"
        aria-hidden="true"
      />

      <header className="relative">
        <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">Kitch Premium</h1>
        <p className="mt-2 text-base text-muted">
          {isBasico ? "Mejorá tu plan cuando quieras" : "Administrá tu suscripción y beneficios"}
        </p>
      </header>

      {loading ? (
        <div className="relative mt-10 flex justify-center" role="status" aria-label="Cargando suscripción">
          <Spinner size={24} className="text-primary" />
        </div>
      ) : (
        <>
          <section className="relative mt-8 grid max-w-4xl gap-4 lg:grid-cols-2">
            <PlanCard
              title="Plan básico"
              price="Gratis"
              hint="Tu cuenta actual si todavía no contrataste."
              features={PLAN_BASICO_FEATURES}
              current={isBasico}
            />
            <PlanCard
              title="Kitch Premium"
              price={plan ? `${formatMoney(plan.monto, plan.moneda)} / ${PREMIUM_PLAN.periodo}` : "—"}
              hint="Rol Profesional. Vigencia de 30 días."
              features={PLAN_PREMIUM_FEATURES}
              featured
              current={!isBasico}
            />
          </section>

          <div className="relative mt-8">
            {isBasico ? (
              cancelNotice ? (
                <Card className="animate-confirm-pop max-w-xl" role="status">
                  <div className="flex items-start gap-3">
                    <span className="animate-badge-pop flex size-11 shrink-0 items-center justify-center rounded-2xl bg-success/15 text-success">
                      <CircleCheck size={22} aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <h2 className="text-xl font-bold tracking-tight text-ink">
                        Suscripción cancelada
                      </h2>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted">{cancelNotice}</p>
                    </div>
                  </div>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Button to={ROUTES.home} size="md">
                      <Home size={16} aria-hidden="true" />
                      Ir al inicio
                    </Button>
                    <Button to={ROUTES.perfil} variant="outline" size="md">
                      <UserRound size={16} aria-hidden="true" />
                      Ir a mi perfil
                    </Button>
                    <Button
                      type="button"
                      variant="accent"
                      size="md"
                      onClick={() => setCancelNotice("")}
                    >
                      <Sparkles size={16} aria-hidden="true" />
                      Volver a contratar Premium
                    </Button>
                  </div>
                </Card>
              ) : (
                <div className="animate-fade-up">
                  <PaymentForm plan={plan} onSubmit={handleContratar} />
                  {planError ? (
                    <StatusBanner message={planError} tone="error" className="mt-4 max-w-xl" />
                  ) : null}
                  {notice ? <StatusBanner message={notice} className="mt-4 max-w-xl" /> : null}
                </div>
              )
            ) : (
              <SubscriptionStatus
                user={user}
                suscripcion={suscripcion}
                pagos={pagos}
                notice={notice}
                canCancel={isProfesional}
                onRequestCancel={handleOpenCancelModal}
              />
            )}

            {isBasico && !cancelNotice ? (
              <div className="mt-6 grid max-w-xl gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  loading={verificando}
                  onClick={() => verificarPagos({ silencioso: false })}
                >
                  Ya pagué, verificar mi pago
                </Button>
                {verificacion ? (
                  verificacion.tipo === "info" ? (
                    <p className="animate-fade-up text-sm text-muted" role="status">
                      {verificacion.mensaje}
                    </p>
                  ) : (
                    <StatusBanner
                      message={verificacion.mensaje}
                      tone={verificacion.tipo === "error" ? "error" : "success"}
                    />
                  )
                ) : null}
              </div>
            ) : null}
          </div>
        </>
      )}

      <ConfirmModal
        open={cancelModalOpen}
        title="¿Cancelar Kitch Premium?"
        description="Tu cuenta volverá al Plan básico de inmediato y perderás los beneficios de Kitch Premium. Tu historial de pagos queda guardado y podés volver a suscribirte cuando quieras."
        confirmLabel="Sí, cancelar suscripción"
        cancelLabel="Mantener mi plan"
        loading={canceling}
        error={cancelError}
        onConfirm={handleConfirmCancel}
        onCancel={handleCloseCancelModal}
      />
    </div>
  )
}

export default SuscripcionPage
