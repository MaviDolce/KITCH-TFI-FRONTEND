import { MOBILE_NAV_ITEMS } from "../../constants/navItems"
import NavItem from "./NavItem"

function MobileNav() {
  return (
    <nav
      aria-label="Principal"
      className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-surface px-2 pt-1 pb-[max(0.5rem,env(safe-area-inset-bottom))] lg:hidden"
    >
      <div className="flex items-stretch justify-between">
        {MOBILE_NAV_ITEMS.map((item) => (
          <NavItem key={item.to} {...item} compact />
        ))}
      </div>
    </nav>
  )
}

export default MobileNav
