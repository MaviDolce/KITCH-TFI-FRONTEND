import { Link } from "react-router-dom"
import { MOBILE_HEADER_ITEMS } from "../../constants/navItems"
import { ROUTES } from "../../constants/routes"
import Logo from "../ui/Logo"
import NavItem from "./NavItem"

function MobileHeader() {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-line bg-surface px-4 py-3 lg:hidden">
      <Link
        to={ROUTES.home}
        aria-label="Ir al inicio"
        className="rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        <Logo size="sm" />
      </Link>

      <nav aria-label="Accesos rápidos" className="flex items-center">
        {MOBILE_HEADER_ITEMS.map((item) => (
          <NavItem key={item.to} {...item} iconOnly />
        ))}
      </nav>
    </header>
  )
}

export default MobileHeader
