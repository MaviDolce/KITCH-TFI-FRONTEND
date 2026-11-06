import { NavLink } from "react-router-dom"

function NavItem({ to, label, icon: Icon, end = false, compact = false, iconOnly = false }) {
  return (
    <NavLink
      to={to}
      end={end}
      aria-label={iconOnly ? label : undefined}
      className={({ isActive }) => {
        if (iconOnly) {
          return `inline-flex size-11 items-center justify-center rounded-2xl transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
            isActive ? "bg-primary/10 text-primary" : "text-muted hover:bg-canvas hover:text-ink"
          }`
        }

        if (compact) {
          return `flex min-h-12 min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-2xl px-1 py-2 text-[11px] font-medium transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
            isActive ? "text-primary" : "text-muted hover:text-ink"
          }`
        }

        return `flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
          isActive ? "bg-primary/10 text-primary" : "text-ink hover:bg-canvas"
        }`
      }}
    >
      {({ isActive }) => (
        <>
          <Icon
            size={compact || iconOnly ? 22 : 20}
            strokeWidth={isActive ? 2.4 : 2}
            aria-hidden="true"
          />
          {iconOnly ? null : (
            <span className={compact ? "truncate" : undefined}>{label}</span>
          )}
        </>
      )}
    </NavLink>
  )
}

export default NavItem
