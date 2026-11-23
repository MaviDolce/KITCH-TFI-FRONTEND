import { CircleX, Home, Sparkles, UserRound } from "lucide-react"
import Button from "../ui/Button"
import Card from "../ui/Card"
import StatusBanner from "../ui/StatusBanner"
import { ROUTES } from "../../constants/routes"
import { estadoPagoLabel, formatDate, formatMoney, metodoPagoLabel } from "../../constants/subscription"
import { planLabel } from "../../utils/profile"

function SubscriptionStatus({
  user,
  suscripcion,
  pagos = [],
  notice,
  canCancel = false,
  onRequestCancel,
}) {
  return (
    <Card tone="ai" className="animate-confirm-pop max-w-xl">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="animate-badge-pop flex size-11 shrink-0 items-center justify-center rounded-2xl bg-accent text-ink">
            <Sparkles size={20} aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h2 className="text-xl font-bold tracking-tight text-ink">{planLabel(user.rol)}</h2>
            <p className="mt-1 text-sm text-muted">Tu plan está activo y podés usar todas las funciones.</p>
          </div>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-success/15 px-3 py-1 text-xs font-semibold text-success">
          <span className="size-1.5 rounded-full bg-success" aria-hidden="true" />
          Activa
        </span>
      </div>

      {notice ? <StatusBanner message={notice} className="mt-4" /> : null}

      {suscripcion ? (
        <dl className="mt-6 grid gap-3 rounded-2xl bg-surface/80 p-4 text-sm">
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
              <li
                key={pago.id}
                className="flex flex-wrap items-baseline justify-between gap-2 rounded-xl bg-surface/70 px-3 py-2 text-sm"
              >
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

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Button to={ROUTES.home} variant="outline" size="md">
          <Home size={16} aria-hidden="true" />
          Ir al inicio
        </Button>
        <Button to={ROUTES.perfil} variant="outline" size="md">
          <UserRound size={16} aria-hidden="true" />
          Ir a mi perfil
        </Button>
      </div>

      {canCancel ? (
        <div className="mt-6 border-t border-ink/10 pt-5">
          <p className="text-xs text-muted">
            Si cancelás, volvés al Plan básico de inmediato y conservás tu historial de pagos.
          </p>
          <Button
            type="button"
            variant="ghost"
            size="md"
            onClick={onRequestCancel}
            className="mt-3 border border-primary/25 text-primary hover:border-primary/40 hover:bg-primary/10"
          >
            <CircleX size={16} aria-hidden="true" />
            Cancelar suscripción
          </Button>
        </div>
      ) : null}
    </Card>
  )
}

export default SubscriptionStatus
