import { Link } from "react-router-dom"
import { ADMIN_NAV_ITEMS, NAV_ITEMS } from "../../constants/navItems"
import { ROLES } from "../../constants/roles"
import { ROUTES } from "../../constants/routes"
import { useAuth } from "../../hooks/useAuth"
import Logo from "../ui/Logo"
import NavItem from "./NavItem"
import PremiumCard from "./PremiumCard"

function Sidebar() {
  const { user } = useAuth()
  const isAdmin = user?.rol === ROLES.admin

  return (
    <aside className="sticky top-0 hidden h-svh w-[17rem] shrink-0 flex-col border-r border-line bg-surface px-4 py-6 lg:flex">
      <Link
        to={ROUTES.home}
        aria-label="Ir al inicio"
        className="mb-8 inline-flex rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        <Logo />
      </Link>

      <nav aria-label="Principal" className="flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map((item) => (
          <NavItem key={item.to} {...item} />
        ))}
        {isAdmin ? (
          <>
            <p className="mt-6 px-3 text-[11px] font-semibold tracking-[0.08em] text-muted uppercase">
              Administración
            </p>
            {ADMIN_NAV_ITEMS.map((item) => (
              <NavItem key={item.to} {...item} />
            ))}
          </>
        ) : null}
      </nav>

      <PremiumCard />
    </aside>
  )
}

export default Sidebar
