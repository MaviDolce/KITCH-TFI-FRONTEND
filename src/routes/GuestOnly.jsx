import { Navigate, Outlet } from "react-router-dom"
import PageLoader from "../components/ui/PageLoader"
import { ROUTES } from "../constants/routes"
import { useAuth } from "../hooks/useAuth"

function GuestOnly() {
  const { isAuthenticated, ready } = useAuth()

  if (!ready) {
    return <PageLoader label="Cargando sesión" />
  }

  if (isAuthenticated) {
    return <Navigate to={ROUTES.home} replace />
  }

  return <Outlet />
}

export default GuestOnly
