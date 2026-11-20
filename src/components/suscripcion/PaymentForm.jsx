import { useState } from "react"
import Button from "../ui/Button"
import Card from "../ui/Card"
import { PREMIUM_PLAN, formatMoney } from "../../constants/subscription"

function PaymentForm({ plan, onSubmit }) {
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError("")
    setLoading(true)
    try {
      await onSubmit({
        tipo: plan?.tipo || PREMIUM_PLAN.tipo,
      })
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <Card className="max-w-xl">
      <h2 className="text-xl font-bold tracking-tight text-ink">Método de pago</h2>
      <p className="mt-1 text-sm text-muted">
        Te vamos a redirigir a Mercado Pago para completar el pago de forma segura.
        Al volver, actualizamos tu plan automáticamente.
      </p>

      <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-primary bg-primary/5 px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-ink">Mercado Pago</p>
            <p className="text-xs text-muted">
              Tarjetas, dinero en cuenta y otros medios disponibles dentro de Mercado Pago.
            </p>
          </div>
          <span className="shrink-0 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            Seleccionado
          </span>
        </div>
        <p className="text-xs text-muted">Próximamente vamos a sumar otros medios de pago.</p>

        {error ? (
          <p className="text-sm text-primary" role="alert">
            {error}
          </p>
        ) : null}

        <Button type="submit" variant="accent" size="md" loading={loading} disabled={!plan}>
          {plan ? `Pagar ${formatMoney(plan.monto, plan.moneda)}` : "Pagar"}
        </Button>
      </form>
    </Card>
  )
}

export default PaymentForm
