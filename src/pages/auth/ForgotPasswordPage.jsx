import { useState } from "react"
import { useNavigate } from "react-router-dom"
import AuthCard from "../../components/auth/AuthCard"
import Button from "../../components/ui/Button"
import TextField from "../../components/ui/TextField"
import TextLink from "../../components/ui/TextLink"
import { ROUTES } from "../../constants/routes"
import { useAuth } from "../../hooks/useAuth"
import { isEmail } from "../../utils/validators"

function ForgotPasswordPage() {
  const { forgotPassword } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError("")
    setResult(null)

    if (!isEmail(email)) {
      setError("El formato del email no es válido.")
      return
    }

    setLoading(true)
    try {
      const response = await forgotPassword(email)
      setResult(response)
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
      {result ? (
        <div className="grid gap-4">
          <p className="text-sm leading-relaxed text-ink">{result.message}</p>
          <Button
            className="w-full"
            onClick={() => navigate(ROUTES.resetPassword)}
          >
            Restablecer contraseña
          </Button>
        </div>
      ) : (
        <form className="grid gap-5" onSubmit={handleSubmit} noValidate>
          <TextField
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          {error ? (
            <p className="text-sm text-primary" role="alert">
              {error}
            </p>
          ) : null}
          <Button type="submit" className="w-full" loading={loading}>
            Enviar instrucciones
          </Button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-muted">
        <TextLink to={ROUTES.login}>Volver al inicio de sesión</TextLink>
      </p>
    </AuthCard>
  )
}

export default ForgotPasswordPage
