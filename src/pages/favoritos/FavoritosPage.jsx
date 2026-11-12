import { useEffect, useMemo, useState } from "react"
import RecipeCard from "../../components/recipes/RecipeCard"
import SearchField from "../../components/ui/SearchField"
import Spinner from "../../components/ui/Spinner"
import TextLink from "../../components/ui/TextLink"
import { ROUTES } from "../../constants/routes"
import { useTransientNotice } from "../../hooks/useTransientNotice"
import { favoritosService } from "../../services/favoritosService"

function FavoritosPage() {
  const [recetas, setRecetas] = useState([])
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState("")
  const [actionError, setActionError] = useState("")
  const [notice, showNotice] = useTransientNotice()

  useEffect(() => {
    let active = true

    favoritosService
      .listar()
      .then((list) => {
        if (active) {
          setRecetas(list)
        }
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

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) {
      return recetas
    }
    return recetas.filter(
      (receta) =>
        receta.titulo.toLowerCase().includes(needle) ||
        receta.descripcion.toLowerCase().includes(needle),
    )
  }, [query, recetas])

  async function handleToggleFavorite(recetaId) {
    setActionError("")
    try {
      const result = await favoritosService.toggle(recetaId)
      if (!result.esFavorito) {
        setRecetas((current) => current.filter((receta) => receta.recetaId !== recetaId))
      }
      showNotice(result.message)
    } catch (error) {
      setActionError(error.message)
    }
  }

  return (
    <div className="relative isolate overflow-hidden">
      <div
        className="pointer-events-none absolute -top-24 right-8 size-64 rounded-full bg-success/20 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-64 -right-16 size-72 rounded-full bg-accent/25 blur-3xl"
        aria-hidden="true"
      />

      <header className="relative">
        <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">Favoritos</h1>
        <p className="mt-2 text-base text-muted">Recetas que guardaste.</p>
      </header>

      <form className="relative mt-6 max-w-3xl" onSubmit={(event) => event.preventDefault()}>
        <SearchField
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          label="Buscar recetas guardadas"
        />
      </form>

      <section className="relative mt-8" aria-labelledby="favoritos-title">
        <h2 id="favoritos-title" className="text-xl font-bold tracking-tight text-ink">
          Recetas guardadas
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
            aria-label="Cargando favoritos"
          >
            <Spinner size={24} className="text-primary" />
          </div>
        ) : loadError ? (
          <p className="mt-6 text-base text-primary" role="alert">
            {loadError}
          </p>
        ) : recetas.length === 0 ? (
          <p className="mt-6 text-base text-muted">
            Todavía no guardaste recetas.{" "}
            <TextLink to={ROUTES.explorar} className="inline">
              Ir a Explorar
            </TextLink>
          </p>
        ) : visible.length === 0 ? (
          <p className="mt-6 text-base text-muted">
            No encontramos recetas guardadas con esa búsqueda.
          </p>
        ) : (
          <ul className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {visible.map((receta) => (
              <li key={receta.recetaId}>
                <RecipeCard
                  receta={receta}
                  favorite
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

export default FavoritosPage
