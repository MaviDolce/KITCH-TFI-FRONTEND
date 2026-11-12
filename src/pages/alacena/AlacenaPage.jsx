import { useEffect, useMemo, useState } from "react"
import AddStockForm from "../../components/alacena/AddStockForm"
import StockItemCard from "../../components/alacena/StockItemCard"
import FilterChip from "../../components/explorar/FilterChip"
import Button from "../../components/ui/Button"
import SearchField from "../../components/ui/SearchField"
import Spinner from "../../components/ui/Spinner"
import { PANTRY_CATEGORIES } from "../../constants/pantryCategories"
import { stockService } from "../../services/stockService"
import { agruparPorCategoria, proximaCantidad } from "../../utils/stock"

function AlacenaPage() {
  const [items, setItems] = useState([])
  const [query, setQuery] = useState("")
  const [filtro, setFiltro] = useState("")
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [error, setError] = useState("")

  useEffect(() => {
    let active = true

    stockService
      .listar()
      .then((list) => {
        if (active) {
          setItems(list)
        }
      })
      .catch((err) => {
        if (active) {
          setError(err.message)
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false)
        }
      })

    return () => {
      active = false
    }
  }, [])

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return items.filter((item) => {
      const matchesQuery = !needle || item.nombreIngrediente.toLowerCase().includes(needle)
      const matchesFilter = !filtro || item.categoria === filtro
      return matchesQuery && matchesFilter
    })
  }, [filtro, items, query])

  const groups = useMemo(() => agruparPorCategoria(visible), [visible])

  function handleChip(id) {
    setFiltro((current) => (current === id ? "" : id))
  }

  function mergeItem(id, updated) {
    setItems((current) => current.map((row) => (row.id === id ? { ...row, ...updated } : row)))
  }

  async function handleCreate(payload) {
    const created = await stockService.crear(payload)
    setItems((current) => {
      const without = current.filter((item) => item.id !== created.id)
      return [...without, created]
    })
    setShowForm(false)
  }

  async function handleEdit(payload) {
    const updated = await stockService.actualizar(editing.id, {
      cantidad: payload.cantidad,
      unidadMedida: payload.unidadMedida,
      fechaCaducidad: payload.fechaCaducidad ?? editing.fechaCaducidad,
    })
    mergeItem(editing.id, updated)
    setEditing(null)
  }

  async function handleStep(item, direccion) {
    setError("")
    const next = proximaCantidad(item, direccion)
    try {
      if (next <= 0) {
        await stockService.eliminar(item.id)
        setItems((current) => current.filter((row) => row.id !== item.id))
        return
      }
      const updated = await stockService.actualizar(item.id, {
        cantidad: next,
        unidadMedida: item.unidadMedida,
        fechaCaducidad: item.fechaCaducidad,
      })
      mergeItem(item.id, updated)
    } catch (err) {
      setError(err.message)
    }
  }

  function openCreate() {
    setEditing(null)
    setShowForm((open) => !open)
  }

  function openEdit(item) {
    setShowForm(false)
    setEditing(item)
  }

  return (
    <div>
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">Mi alacena</h1>
          <p className="mt-2 text-base text-muted">Todo lo que tenés disponible para cocinar.</p>
        </div>
        <Button type="button" size="md" onClick={openCreate}>
          Agregar ingrediente
        </Button>
      </header>

      <form
        className="mt-6 max-w-3xl"
        onSubmit={(event) => event.preventDefault()}
      >
        <SearchField
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          label="Buscar ingrediente"
        />
      </form>

      <div className="mt-4 -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] lg:mx-0 lg:flex-wrap lg:overflow-visible lg:px-0" role="group" aria-label="Categorías">
        {PANTRY_CATEGORIES.map((chip) => (
          <FilterChip
            key={chip.id}
            label={chip.label}
            dot={chip.dot}
            selected={filtro === chip.id}
            onClick={() => handleChip(chip.id)}
          />
        ))}
      </div>

      {showForm ? (
        <div className="mt-6 max-w-3xl">
          <AddStockForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
        </div>
      ) : null}

      {editing ? (
        <div className="mt-6 max-w-3xl">
          <AddStockForm
            key={editing.id}
            item={editing}
            onSubmit={handleEdit}
            onCancel={() => setEditing(null)}
          />
        </div>
      ) : null}

      {error ? (
        <p className="mt-6 text-sm text-primary" role="alert">
          {error}
        </p>
      ) : null}

      {loading ? (
        <div className="mt-10 flex justify-center" role="status" aria-label="Cargando alacena">
          <Spinner size={24} className="text-primary" />
        </div>
      ) : visible.length === 0 ? (
        <p className="mt-8 text-base text-muted">
          {items.length === 0
            ? "Tu alacena está vacía. Agregá un ingrediente para empezar."
            : "No encontramos ingredientes con esa búsqueda o filtro."}
        </p>
      ) : (
        <div className="mt-8 grid gap-8">
          {groups.map(({ categoria, items: group }) => {
            return (
              <section key={categoria} aria-labelledby={`cat-${categoria}`}>
                <h2
                  id={`cat-${categoria}`}
                  className="text-xl font-bold tracking-tight text-ink"
                >
                  {categoria}
                </h2>
                <ul className="mt-3 grid gap-3 sm:grid-cols-2">
                  {group.map((item) => (
                    <li key={item.id}>
                      <StockItemCard
                        item={item}
                        onIncrement={(row) => handleStep(row, 1)}
                        onDecrement={(row) => handleStep(row, -1)}
                        onEdit={openEdit}
                      />
                    </li>
                  ))}
                </ul>
              </section>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default AlacenaPage
