import { useState } from "react"
import { CATEGORIA_VARIOS, PANTRY_CATEGORIES, PANTRY_UNIDADES } from "../../constants/pantryCategories"
import Button from "../ui/Button"
import Card from "../ui/Card"
import SelectField from "../ui/SelectField"
import TextField from "../ui/TextField"

const EMPTY = {
  nombreArticulo: "",
  cantidadFaltante: "",
  unidadMedida: "gr",
  categoria: PANTRY_CATEGORIES[0].id,
}

function AddShoppingItemForm({ onSubmit, onCancel }) {
  const [form, setForm] = useState(EMPTY)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const nombre = form.nombreArticulo.trim()
    const cantidad = Number(form.cantidadFaltante)

    if (!nombre) {
      setError("Indicá el nombre del producto.")
      return
    }
    if (!Number.isFinite(cantidad) || cantidad <= 0) {
      setError("La cantidad tiene que ser mayor a 0.")
      return
    }

    setError("")
    setLoading(true)
    try {
      await onSubmit({
        nombreArticulo: nombre,
        cantidadFaltante: cantidad,
        unidadMedida: form.unidadMedida,
        categoria: form.categoria || CATEGORIA_VARIOS,
      })
      setForm(EMPTY)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <h2 className="text-lg font-bold tracking-tight text-ink">Agregar producto</h2>
      <form className="mt-4 grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
        <TextField
          name="nombreArticulo"
          label="Nombre"
          value={form.nombreArticulo}
          onChange={handleChange}
          className="sm:col-span-2"
        />
        <TextField
          name="cantidadFaltante"
          label="Cantidad"
          type="number"
          min="0"
          step="any"
          value={form.cantidadFaltante}
          onChange={handleChange}
        />
        <SelectField
          name="unidadMedida"
          label="Unidad"
          value={form.unidadMedida}
          onChange={handleChange}
        >
          {PANTRY_UNIDADES.map((unidad) => (
            <option key={unidad} value={unidad}>
              {unidad}
            </option>
          ))}
        </SelectField>
        <SelectField
          name="categoria"
          label="Categoría"
          value={form.categoria}
          onChange={handleChange}
          className="sm:col-span-2"
        >
          {PANTRY_CATEGORIES.map((categoria) => (
            <option key={categoria.id} value={categoria.id}>
              {categoria.label}
            </option>
          ))}
          <option value={CATEGORIA_VARIOS}>{CATEGORIA_VARIOS}</option>
        </SelectField>
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

export default AddShoppingItemForm
