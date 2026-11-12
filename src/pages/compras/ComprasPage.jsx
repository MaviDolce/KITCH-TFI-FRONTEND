import { useEffect, useMemo, useState } from "react"
import AddShoppingItemForm from "../../components/compras/AddShoppingItemForm"
import ShoppingItemCard from "../../components/compras/ShoppingItemCard"
import Button from "../../components/ui/Button"
import SearchField from "../../components/ui/SearchField"
import Spinner from "../../components/ui/Spinner"
import { listaCompraService } from "../../services/listaCompraService"
import { agruparPorCategoria, stepForUnidad } from "../../utils/stock"

const FILTERS = {
  todos: "todos",
  pendientes: "pendientes",
  comprados: "comprados",
}

function ComprasPage() {
  const [items, setItems] = useState([])
  const [query, setQuery] = useState("")
  const [filtro, setFiltro] = useState(FILTERS.todos)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [notice, setNotice] = useState("")
  const [error, setError] = useState("")
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    let active = true

    listaCompraService
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

  const pendientes = items.filter((item) => !item.estaComprado)
  const comprados = items.filter((item) => item.estaComprado)

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return items.filter((item) => {
      const matchesQuery = !needle || item.nombreArticulo.toLowerCase().includes(needle)
      const matchesFilter =
        filtro === FILTERS.todos ||
        (filtro === FILTERS.pendientes && !item.estaComprado) ||
        (filtro === FILTERS.comprados && item.estaComprado)
      return matchesQuery && matchesFilter
    })
  }, [filtro, items, query])

  const groups = useMemo(() => agruparPorCategoria(visible), [visible])

  async function run(action) {
    setError("")
    try {
      await action()
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleCreate(payload) {
    const created = await listaCompraService.crear(payload)
    setItems((current) => {
      const without = current.filter((item) => item.id !== created.id)
      return [...without, created]
    })
    setShowForm(false)
    setNotice(`Agregamos ${created.nombreArticulo} a la lista.`)
  }

  function handleToggle(item) {
    return run(async () => {
      if (!item.estaComprado) {
        await listaCompraService.marcarComprado(item.id)
        setItems(await listaCompraService.listar())
        setNotice(`Marcamos ${item.nombreArticulo} como comprado y lo sumamos a tu alacena.`)
        return
      }
      await listaCompraService.actualizar(item.id, {
        nombreArticulo: item.nombreArticulo,
        cantidadFaltante: item.cantidadFaltante,
        estaComprado: false,
        unidadMedida: item.unidadMedida,
        ingredienteId: item.ingredienteId,
      })
      setItems((current) =>
        current.map((row) => (row.id === item.id ? { ...row, estaComprado: false } : row)),
      )
    })
  }

  function handleStep(item, direccion) {
    return run(async () => {
      const next = Math.max(
        0,
        Math.round((item.cantidadFaltante + direccion * stepForUnidad(item.unidadMedida)) * 100) / 100,
      )
      if (next <= 0) {
        await listaCompraService.eliminar(item.id)
        setItems((current) => current.filter((row) => row.id !== item.id))
        return
      }
      await listaCompraService.actualizar(item.id, {
        nombreArticulo: item.nombreArticulo,
        cantidadFaltante: next,
        estaComprado: item.estaComprado,
        unidadMedida: item.unidadMedida,
        ingredienteId: item.ingredienteId,
      })
      setItems((current) =>
        current.map((row) => (row.id === item.id ? { ...row, cantidadFaltante: next } : row)),
      )
    })
  }

  async function handleGenerar() {
    setGenerating(true)
    setNotice("")
    await run(async () => {
      const resumen = await listaCompraService.resumen()
      setItems(await listaCompraService.listar())
      setNotice(resumen.mensaje)
    })
    setGenerating(false)
  }

  return (
    <div className="relative isolate overflow-hidden">
      <div
        className="pointer-events-none absolute -top-24 right-8 size-64 rounded-full bg-warning/20 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-64 -right-16 size-72 rounded-full bg-primary/10 blur-3xl"
        aria-hidden="true"
      />

      <header className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">Lista de compras</h1>
          <p className="mt-2 text-base text-muted">
            Todo lo que necesitas para completar tus comidas
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button type="button" variant="outline" size="md" loading={generating} onClick={handleGenerar}>
            Completar con el plan
          </Button>
          <Button type="button" size="md" onClick={() => setShowForm((open) => !open)}>
            Agregar producto
          </Button>
        </div>
      </header>

      <div className="relative mt-6 -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] lg:mx-0 lg:flex-wrap lg:overflow-visible lg:px-0" role="group" aria-label="Resumen de la lista">
        <button
          type="button"
          aria-pressed={filtro === FILTERS.todos}
          onClick={() => setFiltro(FILTERS.todos)}
          className={`inline-flex h-11 shrink-0 items-center rounded-full px-4 text-sm font-semibold transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
            filtro === FILTERS.todos ? "bg-primary/10 text-primary" : "bg-surface text-ink shadow-sm"
          }`}
        >
          {items.length} {items.length === 1 ? "producto" : "productos"}
        </button>
        <button
          type="button"
          aria-pressed={filtro === FILTERS.pendientes}
          onClick={() => setFiltro(FILTERS.pendientes)}
          className={`inline-flex h-11 shrink-0 items-center rounded-full px-4 text-sm font-semibold transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
            filtro === FILTERS.pendientes ? "bg-primary/10 text-primary" : "bg-surface text-ink shadow-sm"
          }`}
        >
          {pendientes.length} {pendientes.length === 1 ? "pendiente" : "pendientes"}
        </button>
        <button
          type="button"
          aria-pressed={filtro === FILTERS.comprados}
          onClick={() => setFiltro(FILTERS.comprados)}
          className={`inline-flex h-11 shrink-0 items-center rounded-full px-4 text-sm font-semibold transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
            filtro === FILTERS.comprados ? "bg-primary/10 text-primary" : "bg-surface text-ink shadow-sm"
          }`}
        >
          {comprados.length} {comprados.length === 1 ? "comprado" : "comprados"}
        </button>
      </div>

      <form className="relative mt-6 max-w-3xl" onSubmit={(event) => event.preventDefault()}>
        <SearchField
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          label="Buscar en la lista..."
        />
      </form>

      {notice ? (
        <p className="relative mt-4 text-sm text-success" role="status">
          {notice}
        </p>
      ) : null}
      {error ? (
        <p className="relative mt-4 text-sm text-primary" role="alert">
          {error}
        </p>
      ) : null}

      {showForm ? (
        <div className="relative mt-6 max-w-3xl">
          <AddShoppingItemForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
        </div>
      ) : null}

      {loading ? (
        <div className="mt-10 flex justify-center" role="status" aria-label="Cargando lista de compras">
          <Spinner size={24} className="text-primary" />
        </div>
      ) : visible.length === 0 ? (
        <p className="relative mt-8 text-base text-muted">
          {items.length === 0
            ? "Tu lista está vacía. Agregá un producto o completá con el plan de la semana."
            : "No encontramos productos con esa búsqueda o filtro."}
        </p>
      ) : (
        <div className="relative mt-8 grid gap-8">
          {groups.map(({ categoria, items: group }) => {
            return (
              <section key={categoria} aria-labelledby={`compra-${categoria}`}>
                <h2
                  id={`compra-${categoria}`}
                  className="text-xl font-bold tracking-tight text-primary"
                >
                  {categoria}
                </h2>
                <ul className="mt-3 grid gap-3 sm:grid-cols-2">
                  {group.map((item) => (
                    <li key={item.id}>
                      <ShoppingItemCard
                        item={item}
                        onToggle={handleToggle}
                        onIncrement={(row) => handleStep(row, 1)}
                        onDecrement={(row) => handleStep(row, -1)}
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

export default ComprasPage
