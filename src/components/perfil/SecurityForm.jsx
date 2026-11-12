import { useState } from "react"
import Button from "../ui/Button"
import Card from "../ui/Card"
import TextField from "../ui/TextField"
import { isValidPassword, PASSWORD_MIN_LENGTH } from "../../utils/validators"

function SecurityForm({ onSubmit, onBack }) {
  const [form, setForm] = useState({
    actual: "",
    nueva: "",
    confirmacion: "",
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
    if (!form.actual) next.actual = "Ingresá tu contraseña actual."
    if (!isValidPassword(form.nueva)) {
      next.nueva = `La nueva contraseña debe tener al menos ${PASSWORD_MIN_LENGTH} caracteres.`
    }
    if (form.nueva !== form.confirmacion) {
      next.confirmacion = "Las contraseñas no coinciden."
    }
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
      const result = await onSubmit({ actual: form.actual, nueva: form.nueva })
      setForm({ actual: "", nueva: "", confirmacion: "" })
      setNotice(result?.message || "La contraseña se actualizó correctamente.")
    } catch (err) {
      setFormError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="max-w-2xl">
      <h2 className="text-xl font-bold tracking-tight text-ink">Seguridad</h2>
      <p className="mt-1 text-sm text-muted">Cambiá tu contraseña de acceso.</p>

      <form className="mt-6 grid gap-4" onSubmit={handleSubmit} noValidate>
        <TextField
          label="Contraseña actual"
          name="actual"
          type="password"
          autoComplete="current-password"
          value={form.actual}
          onChange={updateField("actual")}
          error={errors.actual}
        />
        <TextField
          label="Nueva contraseña"
          name="nueva"
          type="password"
          autoComplete="new-password"
          value={form.nueva}
          onChange={updateField("nueva")}
          error={errors.nueva}
        />
        <TextField
          label="Confirmar contraseña"
          name="confirmacion"
          type="password"
          autoComplete="new-password"
          value={form.confirmacion}
          onChange={updateField("confirmacion")}
          error={errors.confirmacion}
        />

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
            Actualizar contraseña
          </Button>
          <Button type="button" variant="outline" size="md" onClick={onBack}>
            Volver
          </Button>
        </div>
      </form>
    </Card>
  )
}

export default SecurityForm
