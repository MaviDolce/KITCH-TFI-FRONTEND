import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "react-router-dom"
import FilterChip from "../../components/explorar/FilterChip"
import RecipeCard from "../../components/recipes/RecipeCard"
import SearchField from "../../components/ui/SearchField"
import Spinner from "../../components/ui/Spinner"
import { RECIPE_FILTERS } from "../../constants/recipeFilters"
import { useTransientNotice } from "../../hooks/useTransientNotice"
import { favoritosService } from "../../services/favoritosService"
import { filterRecipes, recetasService } from "../../services/recetasService"

function ExplorarPage() {
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
        <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          Explorar recetas
        </h1>
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
          Recetas para vos
        </h2>

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
        ) : visible.length === 0 ? (
          <p className="mt-6 text-base text-muted">
            No encontramos recetas con esa búsqueda o filtro.
          </p>
        ) : (
          <ul className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {visible.map((receta) => (
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
