import { useEffect, useMemo, useState } from "react"
import AddStockForm from "../../components/alacena/AddStockForm"
import StockItemCard from "../../components/alacena/StockItemCard"
import FilterChip from "../../components/explorar/FilterChip"
import Button from "../../components/ui/Button"
import SearchField from "../../components/ui/SearchField"
import Spinner from "../../components/ui/Spinner"
import { CATEGORIA_VARIOS, PANTRY_CATEGORIES } from "../../constants/pantryCategories"
import { stockService } from "../../services/stockService"
import { stepForUnidad } from "../../utils/stock"

function groupByCategoria(items) {
  const groups = new Map()
  for (const item of items) {
    const key = item.categoria || CATEGORIA_VARIOS
    if (!groups.has(key)) {
      groups.set(key, [])
    }
    groups.get(key).push(item)
  }
  return groups
}

function AlacenaPage() {
  const [items, setItems] = useState([])
  const [query, setQuery] = useState("")
  const [filtro, setFiltro] = useState("")
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    let active = true

    stockService
      .listar()
      .then((list) => {
        if (active) {
          setItems(list)
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

  const groups = useMemo(() => groupByCategoria(visible), [visible])
  const categoryOrder = [
    ...PANTRY_CATEGORIES.map((categoria) => categoria.id),
    CATEGORIA_VARIOS,
  ]

  function handleChip(id) {
    setFiltro((current) => (current === id ? "" : id))
  }

  async function handleCreate(payload) {
    const created = await stockService.crear(payload)
    setItems((current) => {
      const without = current.filter((item) => item.id !== created.id)
      return [...without, created]
    })
    setShowForm(false)
  }

  async function handleIncrement(item) {
    const updated = await stockService.actualizar(item.id, {
      cantidad: item.cantidad + stepForUnidad(item.unidadMedida),
      unidadMedida: item.unidadMedida,
    })
    if (updated) {
      setItems((current) =>
        current.map((row) => (row.id === item.id ? { ...row, ...updated } : row)),
      )
    }
  }

  async function handleDecrement(item) {
    const next = item.cantidad - stepForUnidad(item.unidadMedida)
    if (next <= 0) {
      await stockService.eliminar(item.id)
      setItems((current) => current.filter((row) => row.id !== item.id))
      return
    }
    const updated = await stockService.actualizar(item.id, {
      cantidad: next,
      unidadMedida: item.unidadMedida,
    })
    if (updated) {
      setItems((current) =>
        current.map((row) => (row.id === item.id ? { ...row, ...updated } : row)),
      )
    }
  }

  return (
    <div>
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">Mi alacena</h1>
          <p className="mt-2 text-base text-muted">Todo lo que tenés disponible para cocinar.</p>
        </div>
        <Button type="button" size="md" onClick={() => setShowForm((open) => !open)}>
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
          {categoryOrder.map((categoria) => {
            const group = groups.get(categoria)
            if (!group?.length) {
              return null
            }
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
                        onIncrement={handleIncrement}
                        onDecrement={handleDecrement}
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
