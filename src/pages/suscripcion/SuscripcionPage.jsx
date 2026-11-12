import { useEffect, useState } from "react"
import PaymentForm from "../../components/suscripcion/PaymentForm"
import PlanCard from "../../components/suscripcion/PlanCard"
import SubscriptionStatus from "../../components/suscripcion/SubscriptionStatus"
import Spinner from "../../components/ui/Spinner"
import {
  PLAN_BASICO_FEATURES,
  PLAN_PREMIUM_FEATURES,
  PREMIUM_PLAN,
  formatMoney,
} from "../../constants/subscription"
import { ROLES } from "../../constants/roles"
import { useAuth } from "../../hooks/useAuth"
import { suscripcionService } from "../../services/suscripcionService"

function SuscripcionPage() {
  const { user } = useAuth()
  const [suscripcion, setSuscripcion] = useState(null)
  const [pagos, setPagos] = useState([])
  const [plan, setPlan] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notice, setNotice] = useState("")
  const [planError, setPlanError] = useState("")

  const isBasico = user?.rol === ROLES.basico

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
    const result = await suscripcionService.contratar(payload)
    setNotice(result.mensaje)
    if (!result.initPoint) {
      throw new Error("Mercado Pago no devolvió el enlace de pago. Intentá de nuevo.")
    }
    window.location.assign(result.initPoint)
    return result
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
        <p className="mt-2 text-base text-muted">Mejora tu plan</p>
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
              <>
                <PaymentForm plan={plan} onSubmit={handleContratar} />
                {planError ? (
                  <p className="mt-4 max-w-xl text-sm text-primary" role="alert">
                    {planError}
                  </p>
                ) : null}
                {notice ? (
                  <p className="mt-4 max-w-xl text-sm text-success" role="status">
                    {notice}
                  </p>
                ) : null}
              </>
            ) : (
              <SubscriptionStatus user={user} suscripcion={suscripcion} pagos={pagos} notice={notice} />
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default SuscripcionPage
