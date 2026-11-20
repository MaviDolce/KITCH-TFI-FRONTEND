import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "react-router-dom"
import FilterChip from "../../components/explorar/FilterChip"
import RecipeCard from "../../components/recipes/RecipeCard"
import SearchField from "../../components/ui/SearchField"
import Spinner from "../../components/ui/Spinner"
import { RECIPE_FILTERS } from "../../constants/recipeFilters"
import { useAuth } from "../../hooks/useAuth"
import { useTransientNotice } from "../../hooks/useTransientNotice"
import { favoritosService } from "../../services/favoritosService"
import { filterRecipes, recetasService } from "../../services/recetasService"

function ExplorarPage() {
  const { user } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get("q") ?? ""
  const [filtro, setFiltro] = useState("todas")
  const [recetas, setRecetas] = useState([])
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState("")
  const [actionError, setActionError] = useState("")
  const [notice, showNotice] = useTransientNotice()

  useEffect(() => {
    let active = true

    Promise.all([recetasService.listarConMatch(), favoritosService.listIds()])
      .then(([list, ids]) => {
        if (!active) {
          return
        }
        setRecetas(list)
        setFavorites(ids)
      })
      .catch((error) => {
        if (active) {
          setLoadError(error.message)
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

  const visible = useMemo(
    () => filterRecipes(recetas, { query, filtro }),
    [filtro, query, recetas],
  )
  const propias = useMemo(
    () => visible.filter((receta) => Number(receta.usuarioId) > 0 && Number(receta.usuarioId) === Number(user?.id)),
    [user?.id, visible],
  )
  const catalogo = useMemo(
    () => visible.filter((receta) => !(Number(receta.usuarioId) > 0 && Number(receta.usuarioId) === Number(user?.id))),
    [user?.id, visible],
  )

  function handleQueryChange(event) {
    const value = event.target.value
    if (value) {
      setSearchParams({ q: value }, { replace: true })
    } else {
      setSearchParams({}, { replace: true })
    }
  }

  function handleSearch(event) {
    event.preventDefault()
  }

  async function handleEliminar(receta) {
    if (!receta?.usuarioId || receta.usuarioId !== user?.id) {
      return
    }
    const ok = window.confirm(`¿Eliminar la receta "${receta.titulo}"? Esta acción no se puede deshacer.`)
    if (!ok) {
      return
    }
    setActionError("")
    try {
      await recetasService.eliminar(receta.recetaId)
      setRecetas((current) => current.filter((item) => item.recetaId !== receta.recetaId))
      showNotice("Eliminamos la receta.")
    } catch (error) {
      setActionError(error.message)
    }
  }

  async function handleToggleFavorite(recetaId) {
    setActionError("")
    try {
      const result = await favoritosService.toggle(recetaId)
      setFavorites((current) =>
        result.esFavorito
          ? [...new Set([...current, recetaId])]
          : current.filter((id) => id !== recetaId),
      )
      showNotice(result.message)
    } catch (error) {
      setActionError(error.message)
    }
  }

  return (
    <div className="relative isolate overflow-hidden">
      <div
        className="pointer-events-none absolute -top-24 right-8 size-64 rounded-full bg-accent/30 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-64 -right-16 size-72 rounded-full bg-success/15 blur-3xl"
        aria-hidden="true"
      />

      <header className="relative">
        <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">Recetas</h1>
        <p className="mt-2 text-base text-muted">Todas las que generaste, más el catálogo.</p>
      </header>

      <form className="relative mt-6 max-w-3xl" onSubmit={handleSearch}>
        <SearchField
          value={query}
          onChange={handleQueryChange}
          label="Buscar recetas o ingredientes"
        />
        <button type="submit" className="sr-only">
          Buscar
        </button>
      </form>

      <div
        className="relative mt-4 -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] lg:mx-0 lg:flex-wrap lg:overflow-visible lg:px-0"
        role="group"
        aria-label="Filtros de recetas"
      >
        {RECIPE_FILTERS.map((chip) => (
          <FilterChip
            key={chip.id}
            label={chip.label}
            dot={chip.dot}
            selected={filtro === chip.id}
            onClick={() => setFiltro(chip.id)}
          />
        ))}
      </div>

      <section className="relative mt-8" aria-labelledby="recetas-title">
        <h2 id="recetas-title" className="text-xl font-bold tracking-tight text-ink">
          Recetas
        </h2>
        <p className="mt-1 text-sm text-muted">Las que generaste. Borrarlas de acá no es lo mismo que sacarlas de favoritos.</p>

        {actionError ? (
          <p className="mt-4 text-sm text-primary" role="alert">
            {actionError}
          </p>
        ) : null}
        {notice ? (
          <p className="mt-4 text-sm text-success" role="status">
            {notice}
          </p>
        ) : null}

        {loading ? (
          <div
            className="mt-8 flex justify-center"
            role="status"
            aria-label="Cargando recetas"
          >
            <Spinner size={24} className="text-primary" />
          </div>
        ) : loadError ? (
          <p className="mt-6 text-base text-primary" role="alert">
            {loadError}
          </p>
        ) : propias.length === 0 ? (
          <p className="mt-6 text-base text-muted">
            {recetas.some((receta) => Number(receta.usuarioId) === Number(user?.id))
              ? "No encontramos recetas tuyas con esa búsqueda."
              : "Todavía no generaste recetas con Kitch IA."}
          </p>
        ) : (
          <ul className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {propias.map((receta) => (
              <li key={receta.recetaId}>
                <RecipeCard
                  receta={receta}
                  favorite={favorites.includes(receta.recetaId)}
                  onToggleFavorite={handleToggleFavorite}
                  onDelete={handleEliminar}
                />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="relative mt-10" aria-labelledby="catalogo-title">
        <h2 id="catalogo-title" className="text-xl font-bold tracking-tight text-ink">
          Catálogo
        </h2>
        {loading || loadError ? null : catalogo.length === 0 ? (
          <p className="mt-6 text-base text-muted">No hay recetas del catálogo con esa búsqueda.</p>
        ) : (
          <ul className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {catalogo.map((receta) => (
              <li key={receta.recetaId}>
                <RecipeCard
                  receta={receta}
                  favorite={favorites.includes(receta.recetaId)}
                  onToggleFavorite={handleToggleFavorite}
                />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

export default ExplorarPage
