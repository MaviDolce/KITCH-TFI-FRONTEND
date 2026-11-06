import { Link } from "react-router-dom"
import { NAV_ITEMS } from "../../constants/navItems"
import { ROUTES } from "../../constants/routes"
import Logo from "../ui/Logo"
import NavItem from "./NavItem"
import PremiumCard from "./PremiumCard"

function Sidebar() {
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
      </nav>

      <PremiumCard />
    </aside>
  )
}

export default Sidebar
