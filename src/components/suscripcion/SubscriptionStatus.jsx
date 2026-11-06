import { Sparkles } from "lucide-react"
import Button from "../ui/Button"
import Card from "../ui/Card"
import { ROUTES } from "../../constants/routes"
import { estadoPagoLabel, formatDate, formatMoney, metodoPagoLabel } from "../../constants/subscription"
import { planLabel } from "../../utils/profile"

function SubscriptionStatus({ user, suscripcion, pagos = [], notice }) {
  return (
    <Card tone="ai" className="max-w-xl">
      <div className="flex items-start gap-3">
        <span className="flex size-11 items-center justify-center rounded-2xl bg-accent text-ink">
          <Sparkles size={20} aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h2 className="text-xl font-bold tracking-tight text-ink">{planLabel(user.rol)}</h2>
          <p className="mt-1 text-sm text-muted">Tu plan está activo.</p>
        </div>
      </div>

      {notice ? (
        <p className="mt-4 text-sm text-success" role="status">
          {notice}
        </p>
      ) : null}

      {suscripcion ? (
        <dl className="mt-6 grid gap-3 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Tipo</dt>
            <dd className="font-semibold text-ink">{suscripcion.tipo}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Estado</dt>
            <dd className="font-semibold text-ink">{suscripcion.activa ? "Activa" : "Inactiva"}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Vigencia</dt>
            <dd className="font-semibold text-ink">
              {formatDate(suscripcion.fechaInicio)}
              {suscripcion.fechaFin ? ` — ${formatDate(suscripcion.fechaFin)}` : ""}
            </dd>
          </div>
        </dl>
      ) : (
        <p className="mt-4 text-sm text-muted">
          No hay una suscripción registrada. Tu rol ya incluye el acceso de este plan.
        </p>
      )}

      {pagos.length > 0 ? (
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-ink">Historial de pagos</h3>
          <ul className="mt-3 grid gap-2">
            {pagos.map((pago) => (
              <li key={pago.id} className="flex flex-wrap items-baseline justify-between gap-2 text-sm">
                <span className="text-muted">
                  {formatDate(pago.fechaPago)} · {metodoPagoLabel(pago.metodoPago)}
                </span>
                <span className="font-semibold text-ink">
                  {formatMoney(pago.monto)} · {estadoPagoLabel(pago.estadoPago)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <Button to={ROUTES.perfil} variant="outline" size="md" className="mt-6">
        Ir a mi perfil
      </Button>
    </Card>
  )
}

export default SubscriptionStatus
