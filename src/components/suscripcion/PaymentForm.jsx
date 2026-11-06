import { useState } from "react"
import Button from "../ui/Button"
import Card from "../ui/Card"
import SelectField from "../ui/SelectField"
import { METODOS_PAGO, PREMIUM_PLAN, formatMoney } from "../../constants/subscription"

function PaymentForm({ onSubmit }) {
  const [metodoPago, setMetodoPago] = useState("TarjetaCredito")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError("")
    setLoading(true)
    try {
      await onSubmit({
        tipo: PREMIUM_PLAN.tipo,
        monto: PREMIUM_PLAN.monto,
        metodoPago,
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="max-w-xl">
      <h2 className="text-xl font-bold tracking-tight text-ink">Método de pago</h2>
      <p className="mt-1 text-sm text-muted">
        El cobro real usa Mercado Pago. En esta etapa no redirigimos a la pasarela:
        si ya tenés plan Profesional, recargá la sesión.
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

        <Button type="submit" variant="accent" size="md" loading={loading}>
          Pagar {formatMoney(PREMIUM_PLAN.monto)}
        </Button>
      </form>
    </Card>
  )
}

export default PaymentForm
