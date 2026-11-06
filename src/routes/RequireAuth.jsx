import { Navigate, Outlet, useLocation } from "react-router-dom"
import PageLoader from "../components/ui/PageLoader"
import { ROUTES } from "../constants/routes"
import { useAuth } from "../hooks/useAuth"

function RequireAuth() {
  const { isAuthenticated, ready } = useAuth()
  const location = useLocation()

  if (!ready) {
    return <PageLoader label="Cargando sesión" />
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.login} replace state={{ from: location }} />
  }

  return <Outlet />
}

export default RequireAuth
