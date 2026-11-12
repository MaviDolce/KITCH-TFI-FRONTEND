import { useState } from "react"
import { useNavigate } from "react-router-dom"
import AuthCard from "../../components/auth/AuthCard"
import Button from "../../components/ui/Button"
import SelectField from "../../components/ui/SelectField"
import TextField from "../../components/ui/TextField"
import TextLink from "../../components/ui/TextLink"
import { DIET_OPTIONS } from "../../constants/diet"
import { ROUTES } from "../../constants/routes"
import { useAuth } from "../../hooks/useAuth"
import { authService } from "../../services/authService"
import { isEmail, isUsername, isValidPassword, PASSWORD_MIN_LENGTH } from "../../utils/validators"

function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    nombreUsuario: "",
    email: "",
    password: "",
    preferenciaDietetica: "Ninguna",
  })
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState("")
  const [loading, setLoading] = useState(false)

  function updateField(field) {
    return (event) => {
      setForm((current) => ({ ...current, [field]: event.target.value }))
    }
  }

  function validate() {
    const next = {}
    if (!form.nombre.trim()) next.nombre = "El nombre es obligatorio."
    if (!form.apellido.trim()) next.apellido = "El apellido es obligatorio."
    if (!isUsername(form.nombreUsuario)) {
      next.nombreUsuario =
        "Usá al menos 3 caracteres: letras, números, punto, guion o guion bajo."
    }
    if (!isEmail(form.email)) next.email = "El formato del email no es válido."
    if (!isValidPassword(form.password)) {
      next.password = `La contraseña debe tener al menos ${PASSWORD_MIN_LENGTH} caracteres.`
    }
    return next
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setFormError("")
    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      return
    }

    setLoading(true)
    try {
      const occupied = await authService.emailExiste(form.email.trim())
      if (occupied) {
        setErrors({ email: "Ese email ya está registrado." })
        return
      }
      await register(form)
      navigate(ROUTES.verifyCode, { replace: true })
    } catch (err) {
      setFormError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthCard
      title="Crear cuenta"
      subtitle="Completá tus datos para empezar a cocinar con Kitch."
    >
      <form className="grid gap-4" onSubmit={handleSubmit} noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            label="Nombre"
            name="nombre"
            autoComplete="given-name"
            value={form.nombre}
            onChange={updateField("nombre")}
            error={errors.nombre}
          />
          <TextField
            label="Apellido"
            name="apellido"
            autoComplete="family-name"
            value={form.apellido}
            onChange={updateField("apellido")}
            error={errors.apellido}
          />
        </div>
        <TextField
          label="Nombre de usuario"
          name="nombreUsuario"
          autoComplete="username"
          autoCapitalize="none"
          autoCorrect="off"
          value={form.nombreUsuario}
          onChange={updateField("nombreUsuario")}
          error={errors.nombreUsuario}
        />
        <TextField
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={updateField("email")}
          error={errors.email}
        />
        <TextField
          label="Contraseña"
          name="password"
          type="password"
          autoComplete="new-password"
          value={form.password}
          onChange={updateField("password")}
          error={errors.password}
        />
        <SelectField
          label="Preferencia dietética"
          name="preferenciaDietetica"
          value={form.preferenciaDietetica}
          onChange={updateField("preferenciaDietetica")}
        >
          {DIET_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </SelectField>

        {formError ? (
          <p className="text-sm text-primary" role="alert">
            {formError}
          </p>
        ) : null}

        <Button type="submit" className="w-full" loading={loading}>
          Crear cuenta
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        ¿Ya tenés cuenta? <TextLink to={ROUTES.login}>Iniciar sesión</TextLink>
      </p>
    </AuthCard>
  )
}

export default RegisterPage
