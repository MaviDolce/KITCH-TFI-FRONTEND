import { useEffect, useRef, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { CircleAlert, CircleCheck, Clock } from "lucide-react"
import Button from "../../components/ui/Button"
import Card from "../../components/ui/Card"
import Spinner from "../../components/ui/Spinner"
import { ROUTES } from "../../constants/routes"
import { useAuth } from "../../hooks/useAuth"
import { suscripcionService } from "../../services/suscripcionService"

function readPaymentId(searchParams) {
  const value = searchParams.get("payment_id") || searchParams.get("collection_id") || ""
  return value && value !== "null" ? value : ""
}

function PagoExitosoPage() {
  const [searchParams] = useSearchParams()
  const { refreshSession } = useAuth()
  const paymentId = readPaymentId(searchParams)
  const processedRef = useRef(false)
  const [estado, setEstado] = useState(paymentId ? "loading" : "sinPago")
  const [mensaje, setMensaje] = useState(
    paymentId ? "" : "No recibimos un pago de Mercado Pago. Tu plan no cambió.",
  )

  useEffect(() => {
    if (!paymentId || processedRef.current) {
      return
    }
    processedRef.current = true

    async function confirmar() {
      try {
        const resultado = await suscripcionService.confirmarPago(paymentId)
        if (resultado.requiereRefrescarSesion) {
          await refreshSession()
        }
        setMensaje(resultado.mensaje)
        setEstado(resultado.aprobado ? "aprobado" : resultado.pendiente ? "pendiente" : "rechazado")
      } catch (err) {
        setMensaje(err.message)
        setEstado("error")
      }
    }

    confirmar()
  }, [paymentId, refreshSession])

  if (estado === "loading") {
    return (
      <div className="flex justify-center py-16" role="status" aria-label="Confirmando pago">
        <Spinner size={24} className="text-primary" />
      </div>
    )
  }

  const Icon = estado === "aprobado" ? CircleCheck : estado === "pendiente" ? Clock : CircleAlert
  const tone = estado === "aprobado" ? "text-success" : estado === "pendiente" ? "text-warning" : "text-primary"
  const title =
    estado === "aprobado"
      ? "¡Pago aprobado!"
      : estado === "pendiente"
        ? "Pago pendiente"
        : "No pudimos completar el pago"

  return (
    <div className="relative isolate">
      <Card className="max-w-xl" role={estado === "aprobado" ? "status" : "alert"}>
        <div className="flex items-start gap-3">
          <Icon size={28} className={tone} aria-hidden="true" />
          <div className="min-w-0">
            <h1 className="text-2xl font-bold tracking-tight text-ink">{title}</h1>
            <p className="mt-2 text-sm text-muted">{mensaje}</p>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button to={ROUTES.suscripcion} size="md">
            Ver mi suscripción
          </Button>
          <Button to={ROUTES.home} variant="outline" size="md">
            Ir al inicio
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default PagoExitosoPage
