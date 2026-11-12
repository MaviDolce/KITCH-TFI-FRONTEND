import { useState } from "react"
import { TURNOS } from "../../constants/turnos"
import Button from "../ui/Button"
import Card from "../ui/Card"
import SelectField from "../ui/SelectField"
import TextField from "../ui/TextField"

function AddMealForm({
  recetas,
  initial,
  onSubmit,
  onCancel,
  error,
  conflictMessage,
  onConfirmReplace,
  onDismissConflict,
}) {
  const [form, setForm] = useState({
    recetaId: initial.recetaId ? String(initial.recetaId) : "",
    fechaAsignada: initial.fechaAsignada,
    turno: initial.turno,
  })
  const [loading, setLoading] = useState(false)
  const [replacing, setReplacing] = useState(false)
  const editing = Boolean(initial.id)

  async function handleReplace() {
    setReplacing(true)
    try {
      await onConfirmReplace()
    } finally {
      setReplacing(false)
    }
  }

  function handleChange(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (!form.recetaId) {
      return
    }
    setLoading(true)
    try {
      await onSubmit({
        id: initial.id,
        recetaId: Number(form.recetaId),
        fechaAsignada: form.fechaAsignada,
        turno: form.turno,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="max-w-xl">
      <h2 className="text-lg font-bold tracking-tight text-ink">
        {editing ? "Cambiar receta" : "Agregar comida"}
      </h2>
      <form className="mt-4 grid gap-4" onSubmit={handleSubmit}>
        <SelectField
          name="recetaId"
          label="Receta"
          value={form.recetaId}
          onChange={handleChange}
          required
        >
          <option value="">Elegí una receta</option>
          {recetas.map((receta) => (
            <option key={receta.recetaId} value={receta.recetaId}>
              {receta.titulo}
            </option>
          ))}
        </SelectField>

        <TextField
          name="fechaAsignada"
          type="date"
          label="Fecha"
          value={form.fechaAsignada}
          onChange={handleChange}
          required
        />

        <SelectField name="turno" label="Turno" value={form.turno} onChange={handleChange}>
          {TURNOS.map((turno) => (
            <option key={turno} value={turno}>
              {turno}
            </option>
          ))}
        </SelectField>

        {error ? (
          <p className="text-sm text-primary" role="alert">
            {error}
          </p>
        ) : null}

        {conflictMessage ? (
          <div className="grid gap-3 rounded-2xl bg-ai p-4" role="alertdialog" aria-label="Conflicto de planificación">
            <p className="text-sm font-medium text-ink">{conflictMessage}</p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button type="button" size="md" className="flex-1" loading={replacing} onClick={handleReplace}>
                Reemplazar
              </Button>
              <Button type="button" variant="outline" size="md" className="flex-1" onClick={onDismissConflict}>
                Cancelar
              </Button>
            </div>
          </div>
        ) : null}

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button type="submit" size="md" loading={loading} className="flex-1">
            {editing ? "Guardar" : "Planificar"}
          </Button>
          <Button type="button" variant="outline" size="md" onClick={onCancel} className="flex-1">
            Cancelar
          </Button>
        </div>
      </form>
    </Card>
  )
}

export default AddMealForm
