import { useState } from "react"
import { MailCheck } from "lucide-react"
import AuthCard from "../../components/auth/AuthCard"
import Button from "../../components/ui/Button"
import StatusBanner from "../../components/ui/StatusBanner"
import TextField from "../../components/ui/TextField"
import TextLink from "../../components/ui/TextLink"
import { ROUTES } from "../../constants/routes"
import { useAuth } from "../../hooks/useAuth"
import { isEmail } from "../../utils/validators"

function ForgotPasswordPage() {
  const { forgotPassword } = useAuth()
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError("")
    setSent(false)

    if (!isEmail(email)) {
      setError("El formato del email no es válido.")
      return
    }

    setLoading(true)
    try {
      await forgotPassword(email)
      setSent(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthCard
      title="¿Olvidaste tu contraseña?"
      subtitle="Te vamos a indicar cómo restablecerla si el correo está registrado."
    >
      {sent ? (
        <div className="animate-confirm-pop grid gap-4">
          <div className="flex items-start gap-3 rounded-2xl bg-success/10 p-4" role="status">
            <span
              className="animate-badge-pop flex size-9 shrink-0 items-center justify-center rounded-full bg-success/20 text-success"
              aria-hidden="true"
            >
              <MailCheck size={18} />
            </span>
            <p className="text-sm leading-relaxed text-ink">
              Te enviamos instrucciones para recuperar tu contraseña. Revisá tu casilla de correo y volvé a iniciar sesión.
            </p>
          </div>
          <Button to={ROUTES.login} replace className="w-full">
            Volver
          </Button>
        </div>
      ) : (
        <>
          <form className="grid gap-5" onSubmit={handleSubmit} noValidate>
            <TextField
              label="Email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            {error ? <StatusBanner message={error} tone="error" /> : null}
            <Button type="submit" className="w-full" loading={loading}>
              Enviar instrucciones
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted">
            <TextLink to={ROUTES.login}>Volver al inicio de sesión</TextLink>
          </p>
        </>
      )}
    </AuthCard>
  )
}

export default ForgotPasswordPage
