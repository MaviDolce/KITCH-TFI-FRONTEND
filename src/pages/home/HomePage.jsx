import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import FeaturedRecipeCard from "../../components/home/FeaturedRecipeCard"
import ShortcutCard from "../../components/home/ShortcutCard"
import SearchField from "../../components/ui/SearchField"
import Spinner from "../../components/ui/Spinner"
import { ROUTES } from "../../constants/routes"
import { recomendacionService } from "../../services/recomendacionService"

const SHORTCUTS = [
  {
    to: ROUTES.explorar,
    title: "Recetas para hoy",
    description: "Ver recetas disponibles.",
    accent: "primary",
  },
  {
    to: ROUTES.favoritos,
    title: "Favoritos",
    description: "Ver recetas guardadas.",
    accent: "success",
  },
  {
    to: ROUTES.alacena,
    title: "Alacena",
    description: "Ver ingredientes disponibles.",
    accent: "accent",
  },
  {
    to: ROUTES.compras,
    title: "Compras",
    description: "Ver compras pendientes.",
    accent: "warning",
  },
]

function HomePage() {
  const navigate = useNavigate()
  const [query, setQuery] = useState("")
  const [destacada, setDestacada] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    recomendacionService
      .getDestacada()
      .then((receta) => {
        if (active) {
          setDestacada(receta)
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

  function handleSearch(event) {
    event.preventDefault()
    const value = query.trim()
    navigate(value ? `${ROUTES.explorar}?q=${encodeURIComponent(value)}` : ROUTES.explorar)
  }

  return (
    <div className="relative isolate overflow-hidden">
      <div
        className="pointer-events-none absolute -top-28 right-0 size-72 rounded-full bg-accent/35 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-52 -right-24 size-80 rounded-full bg-success/20 blur-3xl"
        aria-hidden="true"
      />

      <header className="relative max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          ¿Qué cocinamos hoy?
        </h1>
        <p className="mt-2 text-base text-muted">Tu cocina, organizada para hoy.</p>
      </header>

      <div className="relative mt-8">
        {loading ? (
          <div
            className="flex min-h-40 max-w-3xl items-center justify-center rounded-3xl bg-ai"
            role="status"
            aria-label="Cargando recomendación"
          >
            <Spinner size={24} className="text-primary" />
          </div>
        ) : destacada ? (
          <FeaturedRecipeCard receta={destacada} />
        ) : (
          <p className="max-w-3xl text-base text-muted">
            Todavía no hay una recomendación. Cargá tu alacena para ver recetas con lo que tenés.
          </p>
        )}
      </div>

      <form className="relative mt-6 max-w-3xl" onSubmit={handleSearch}>
        <SearchField
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          label="Buscar recetas o ingredientes"
        />
        <button type="submit" className="sr-only">
          Buscar
        </button>
      </form>

      <section aria-label="Accesos" className="relative mt-6 grid max-w-3xl gap-4 sm:grid-cols-2">
        {SHORTCUTS.map((item) => (
          <ShortcutCard key={item.to} {...item} />
        ))}
      </section>
    </div>
  )
}

export default HomePage
