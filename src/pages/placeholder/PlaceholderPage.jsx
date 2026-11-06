import { useLocation } from "react-router-dom"
import Button from "../../components/ui/Button"
import { NAV_ITEMS } from "../../constants/navItems"
import { ROUTES } from "../../constants/routes"
import { useAuth } from "../../hooks/useAuth"

const TITLES = {
  [ROUTES.suscripcion]: "Suscripción",
}

function PlaceholderPage() {
  const { pathname } = useLocation()
  const { user, logout } = useAuth()
  const navItem = NAV_ITEMS.find((item) => item.to === pathname)
  const title = navItem?.label ?? TITLES[pathname] ?? "Kitch"

  return (
    <section className="max-w-2xl">
      <h1 className="text-3xl font-bold tracking-tight text-ink">{title}</h1>
      <p className="mt-2 text-base leading-relaxed text-muted">
        El layout ya está activo. El contenido de esta pantalla se construye en
        el siguiente bloque, fiel a Figma.
      </p>
      {pathname === ROUTES.perfil ? (
        <div className="mt-8 rounded-3xl bg-surface p-6 shadow-sm">
          <p className="font-semibold text-ink">
            {user?.nombre} {user?.apellido}
          </p>
          <p className="mt-1 text-sm text-muted">
            {user?.email} · {user?.rol}
          </p>
          <Button variant="outline" className="mt-5" onClick={logout}>
            Cerrar sesión
          </Button>
        </div>
      ) : null}
    </section>
  )
}

export default PlaceholderPage
