import { useState } from "react"
import {
  CATEGORIA_VARIOS,
  PANTRY_CATEGORIES,
  PANTRY_UNIDADES,
} from "../../constants/pantryCategories"
import Button from "../ui/Button"
import Card from "../ui/Card"
import SelectField from "../ui/SelectField"
import TextField from "../ui/TextField"

const EMPTY = {
  nombreIngrediente: "",
  cantidad: "",
  unidadMedida: "gr",
  categoria: PANTRY_CATEGORIES[0].id,
  fechaCaducidad: "",
}

function fromItem(item) {
  return {
    nombreIngrediente: item.nombreIngrediente,
    cantidad: String(item.cantidad),
    unidadMedida: item.unidadMedida,
    categoria: item.categoria || CATEGORIA_VARIOS,
    fechaCaducidad: item.fechaCaducidad ?? "",
  }
}

function AddStockForm({ item, onSubmit, onCancel }) {
  const editing = Boolean(item)
  const [form, setForm] = useState(() => (item ? fromItem(item) : EMPTY))
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const unidades = PANTRY_UNIDADES.includes(form.unidadMedida)
    ? PANTRY_UNIDADES
    : [form.unidadMedida, ...PANTRY_UNIDADES]

  function handleChange(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const nombre = form.nombreIngrediente.trim()
    const cantidad = Number(form.cantidad)

    if (!nombre) {
      setError("Indicá el nombre del ingrediente.")
      return
    }
    if (!Number.isFinite(cantidad) || cantidad < 0 || (!editing && cantidad === 0)) {
      setError(editing ? "La cantidad no puede ser negativa." : "La cantidad tiene que ser mayor a 0.")
      return
    }

    setError("")
    setLoading(true)
    try {
      await onSubmit({
        nombreIngrediente: nombre,
        cantidad,
        unidadMedida: form.unidadMedida,
        categoria: form.categoria || CATEGORIA_VARIOS,
        fechaCaducidad: form.fechaCaducidad || null,
      })
      if (!editing) {
        setForm(EMPTY)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <h2 className="text-lg font-bold tracking-tight text-ink">
        {editing ? `Editar ${item.nombreIngrediente}` : "Agregar ingrediente"}
      </h2>
      <form className="mt-4 grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
        <TextField
          name="nombreIngrediente"
          label="Nombre"
          value={form.nombreIngrediente}
          onChange={handleChange}
          className="sm:col-span-2"
          readOnly={editing}
        />
        <TextField
          name="cantidad"
          label="Cantidad"
          type="number"
          min="0"
          step="any"
          value={form.cantidad}
          onChange={handleChange}
        />
        <SelectField
          name="unidadMedida"
          label="Unidad"
          value={form.unidadMedida}
          onChange={handleChange}
        >
          {unidades.map((unidad) => (
            <option key={unidad} value={unidad}>
              {unidad}
            </option>
          ))}
        </SelectField>
        {editing ? null : (
          <SelectField
            name="categoria"
            label="Categoría"
            value={form.categoria}
            onChange={handleChange}
          >
            {PANTRY_CATEGORIES.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.label}
              </option>
            ))}
            <option value={CATEGORIA_VARIOS}>{CATEGORIA_VARIOS}</option>
          </SelectField>
        )}
        <TextField
          name="fechaCaducidad"
          label="Caducidad"
          type="date"
          value={form.fechaCaducidad}
          onChange={handleChange}
          hint="Opcional"
        />
        {error ? (
          <p className="sm:col-span-2 text-sm text-primary" role="alert">
            {error}
          </p>
        ) : null}
        <div className="flex flex-col gap-2 sm:col-span-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="ghost" size="md" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" size="md" loading={loading}>
            Guardar
          </Button>
        </div>
      </form>
    </Card>
  )
}

export default AddStockForm
