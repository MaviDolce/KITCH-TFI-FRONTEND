import {
  ChartColumn,
  CookingPot,
  Home,
  LayoutGrid,
  Search,
  ShoppingCart,
  Sparkles,
  User,
  Users,
} from "lucide-react"
import { ROUTES } from "./routes"

export const NAV_ITEMS = [
  { to: ROUTES.home, label: "Inicio", icon: Home, end: true },
  { to: ROUTES.explorar, label: "Explorar", icon: Search },
  { to: ROUTES.alacena, label: "Mi alacena", icon: CookingPot },
  { to: ROUTES.kitchIa, label: "Kitch IA", icon: Sparkles },
  { to: ROUTES.planificador, label: "Planificador", icon: LayoutGrid },
  { to: ROUTES.compras, label: "Compras", icon: ShoppingCart },
  { to: ROUTES.perfil, label: "Perfil", icon: User },
]

export const ADMIN_NAV_ITEMS = [
  { to: ROUTES.adminUsuarios, label: "Usuarios", icon: Users },
  { to: ROUTES.adminMetricas, label: "Métricas", icon: ChartColumn },
]

export const MOBILE_NAV_ITEMS = NAV_ITEMS.filter((item) =>
  [ROUTES.home, ROUTES.explorar, ROUTES.alacena, ROUTES.planificador, ROUTES.perfil].includes(
    item.to,
  ),
)

export const MOBILE_HEADER_ITEMS = NAV_ITEMS.filter((item) =>
  [ROUTES.kitchIa, ROUTES.compras].includes(item.to),
)
