import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import AuthCard from "../../components/auth/AuthCard"
import GoogleButton from "../../components/auth/GoogleButton"
import Button from "../../components/ui/Button"
import TextField from "../../components/ui/TextField"
import TextLink from "../../components/ui/TextLink"
import { ROUTES } from "../../constants/routes"
import { useAuth } from "../../hooks/useAuth"

function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [usuarioOMail, setUsuarioOMail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError("")

    if (!usuarioOMail.trim() || !password) {
      setError("Usuario o email y contraseña son obligatorios.")
      return
    }

    setLoading(true)
    try {
      await login({ usuarioOMail, password })
      navigate(ROUTES.verifyCode, {
        replace: true,
        state: { from: location.state?.from },
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthCard title="Bienvenido" subtitle="Iniciá sesión para armar tu cocina.">
      <form className="grid gap-5" onSubmit={handleSubmit} noValidate>
        <TextField
          label="Usuario o email"
          name="usuarioOMail"
          autoComplete="username"
          autoCapitalize="none"
          autoCorrect="off"
          value={usuarioOMail}
          onChange={(event) => setUsuarioOMail(event.target.value)}
        />
        <TextField
          label="Contraseña"
          name="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          labelEnd={<TextLink to={ROUTES.forgotPassword}>¿La olvidaste?</TextLink>}
        />

        {error ? (
          <p className="text-sm text-primary" role="alert">
            {error}
          </p>
        ) : null}

        <Button type="submit" className="w-full" loading={loading}>
          Iniciar sesión
        </Button>
      </form>

      <div className="my-5 h-px bg-line" />
      <GoogleButton />

      <p className="mt-6 text-center text-sm text-muted">
        ¿No tenés cuenta?{" "}
        <TextLink to={ROUTES.register}>Crear cuenta</TextLink>
      </p>
      <p className="mt-4 text-center text-xs leading-relaxed text-muted">
        El código de verificación llega al mail de la cuenta.
      </p>
    </AuthCard>
  )
}

export default LoginPage
