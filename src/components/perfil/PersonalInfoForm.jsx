import { useState } from "react"
import Button from "../ui/Button"
import Card from "../ui/Card"
import SelectField from "../ui/SelectField"
import TextField from "../ui/TextField"
import { DIET_OPTIONS } from "../../constants/diet"
import { isEmail, isUsername } from "../../utils/validators"

function PersonalInfoForm({ user, onSubmit, onBack }) {
  const [form, setForm] = useState({
    nombre: user.nombre ?? "",
    apellido: user.apellido ?? "",
    nombreUsuario: user.nombreUsuario ?? "",
    email: user.email ?? "",
    preferenciaDietetica: user.preferenciaDietetica ?? "Ninguna",
  })
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState("")
  const [notice, setNotice] = useState("")
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
      next.nombreUsuario = "Usá al menos 3 caracteres: letras, números, punto, guion o guion bajo."
    }
    if (!isEmail(form.email)) next.email = "El formato del email no es válido."
    return next
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setFormError("")
    setNotice("")
    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      return
    }

    setLoading(true)
    try {
      await onSubmit(form)
      setNotice("Guardamos tu información personal.")
    } catch (err) {
      setFormError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="max-w-2xl">
      <h2 className="text-xl font-bold tracking-tight text-ink">Información personal</h2>
      <p className="mt-1 text-sm text-muted">Nombre, apellido, usuario, email y preferencia dietética.</p>

      <form className="mt-6 grid gap-4" onSubmit={handleSubmit} noValidate>
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
        {notice ? (
          <p className="text-sm text-success" role="status">
            {notice}
          </p>
        ) : null}

        <div className="flex flex-wrap gap-3">
          <Button type="submit" size="md" loading={loading}>
            Guardar cambios
          </Button>
          <Button type="button" variant="outline" size="md" onClick={onBack}>
            Volver
          </Button>
        </div>
      </form>
    </Card>
  )
}

export default PersonalInfoForm
