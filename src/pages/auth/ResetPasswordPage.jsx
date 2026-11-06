import { useState } from "react"
import { useLocation, useNavigate, useSearchParams } from "react-router-dom"
import AuthCard from "../../components/auth/AuthCard"
import Button from "../../components/ui/Button"
import TextField from "../../components/ui/TextField"
import TextLink from "../../components/ui/TextLink"
import { ROUTES } from "../../constants/routes"
import { useAuth } from "../../hooks/useAuth"

function ResetPasswordPage() {
  const { resetPassword } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const [token, setToken] = useState(
    location.state?.token ?? searchParams.get("token") ?? "",
  )
  const [nuevaPassword, setNuevaPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError("")
    setSuccess("")

    if (!token.trim()) {
      setError("El token de recuperación es obligatorio.")
      return
    }
    if (nuevaPassword.length < 6) {
      setError("La nueva contraseña debe tener al menos 6 caracteres.")
      return
    }

    setLoading(true)
    try {
      const response = await resetPassword({ token, nuevaPassword })
      setSuccess(response.message)
      window.setTimeout(() => navigate(ROUTES.login, { replace: true }), 1200)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthCard
      title="Restablecer contraseña"
      subtitle="Ingresá el token de recuperación y tu nueva contraseña."
    >
      <form className="grid gap-5" onSubmit={handleSubmit} noValidate>
        <TextField
          label="Token"
          name="token"
          autoComplete="off"
          value={token}
          onChange={(event) => setToken(event.target.value)}
        />
        <TextField
          label="Nueva contraseña"
          name="nuevaPassword"
          type="password"
          autoComplete="new-password"
          value={nuevaPassword}
          onChange={(event) => setNuevaPassword(event.target.value)}
        />
        {error ? (
          <p className="text-sm text-primary" role="alert">
            {error}
          </p>
        ) : null}
        {success ? (
          <p className="text-sm text-success" role="status">
            {success}
          </p>
        ) : null}
        <Button type="submit" className="w-full" loading={loading}>
          Guardar contraseña
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        <TextLink to={ROUTES.login}>Volver al inicio de sesión</TextLink>
      </p>
    </AuthCard>
  )
}

export default ResetPasswordPage
