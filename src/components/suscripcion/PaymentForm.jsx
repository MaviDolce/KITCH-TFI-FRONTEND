import { useState } from "react"
import Button from "../ui/Button"
import Card from "../ui/Card"
import SelectField from "../ui/SelectField"
import { METODOS_PAGO, PREMIUM_PLAN, formatMoney } from "../../constants/subscription"

function PaymentForm({ plan, onSubmit }) {
  const [metodoPago, setMetodoPago] = useState("TarjetaCredito")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError("")
    setLoading(true)
    try {
      await onSubmit({
        tipo: plan?.tipo || PREMIUM_PLAN.tipo,
        metodoPago,
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
        <SelectField
          label="Medio de pago"
          name="metodoPago"
          value={metodoPago}
          onChange={(event) => setMetodoPago(event.target.value)}
        >
          {METODOS_PAGO.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </SelectField>

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
