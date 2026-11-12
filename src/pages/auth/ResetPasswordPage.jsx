import { useState } from "react"
import { useLocation, useNavigate, useSearchParams } from "react-router-dom"
import AuthCard from "../../components/auth/AuthCard"
import Button from "../../components/ui/Button"
import TextField from "../../components/ui/TextField"
import TextLink from "../../components/ui/TextLink"
import { ROUTES } from "../../constants/routes"
import { useAuth } from "../../hooks/useAuth"
import { isValidPassword, PASSWORD_MIN_LENGTH } from "../../utils/validators"

function ResetPasswordPage() {
  const { resetPassword, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const email = searchParams.get("email") ?? ""
  const [token, setToken] = useState(
    location.state?.token ?? searchParams.get("token") ?? "",
  )
  const [nuevaPassword, setNuevaPassword] = useState("")
  const [confirmacion, setConfirmacion] = useState("")
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
    if (!isValidPassword(nuevaPassword)) {
      setError(`La nueva contraseña debe tener al menos ${PASSWORD_MIN_LENGTH} caracteres.`)
      return
    }
    if (nuevaPassword !== confirmacion) {
      setError("Las contraseñas no coinciden.")
      return
    }

    setLoading(true)
    try {
      const response = await resetPassword({ token: token.trim(), nuevaPassword })
      setSuccess(response.message)
      if (isAuthenticated) {
        logout()
      }
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
      subtitle={
        email
          ? `Elegí una nueva contraseña para ${email}.`
          : "Ingresá el token de recuperación y tu nueva contraseña."
      }
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
        <TextField
          label="Repetí la nueva contraseña"
          name="confirmacion"
          type="password"
          autoComplete="new-password"
          value={confirmacion}
          onChange={(event) => setConfirmacion(event.target.value)}
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
        <Button type="submit" className="w-full" loading={loading} disabled={Boolean(success)}>
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
