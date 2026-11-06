import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import AuthCard from "../../components/auth/AuthCard"
import Button from "../../components/ui/Button"
import TextField from "../../components/ui/TextField"
import TextLink from "../../components/ui/TextLink"
import { ROUTES } from "../../constants/routes"
import { useAuth } from "../../hooks/useAuth"
import { authService } from "../../services/authService"

function VerifyCodePage() {
  const { pendingTwoFactor, verifyTwoFactor } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const pending = pendingTwoFactor ?? authService.getPendingTwoFactor()
  const [code, setCode] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!pending) {
      navigate(ROUTES.login, { replace: true })
    }
  }, [navigate, pending])

  async function handleSubmit(event) {
    event.preventDefault()
    setError("")

    if (!/^\d{6}$/.test(code.trim())) {
      setError("Ingresá el código de 6 dígitos.")
      return
    }

    setLoading(true)
    try {
      await verifyTwoFactor(code)
      const from = location.state?.from?.pathname ?? ROUTES.home
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (!pending) {
    return null
  }

  return (
    <AuthCard
      title="Verificá tu identidad"
      subtitle={`Ingresá el código de 6 dígitos enviado a ${pending.emailEnmascarado}.`}
    >
      <form className="grid gap-5" onSubmit={handleSubmit} noValidate>
        <TextField
          label="Código"
          name="code"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          value={code}
          onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
        />

        {error ? (
          <p className="text-sm text-primary" role="alert">
            {error}
          </p>
        ) : null}

        <Button type="submit" className="w-full" loading={loading}>
          Verificar
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        <TextLink to={ROUTES.login}>Volver al inicio de sesión</TextLink>
      </p>
    </AuthCard>
  )
}

export default VerifyCodePage
