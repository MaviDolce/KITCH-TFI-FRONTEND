import { Navigate, Outlet, useLocation } from "react-router-dom"
import Button from "../components/ui/Button"
import Card from "../components/ui/Card"
import PageLoader from "../components/ui/PageLoader"
import { ROUTES } from "../constants/routes"
import { useAuth } from "../hooks/useAuth"

function RequireAuth({ roles }) {
  const { isAuthenticated, ready, hydrationError, retryHydration, logout, user } = useAuth()
  const location = useLocation()

  if (!ready) {
    return <PageLoader label="Cargando sesión" />
  }

  if (!isAuthenticated && hydrationError) {
    return (
      <main className="flex min-h-svh items-center justify-center bg-canvas p-6">
        <Card className="grid max-w-md gap-4 text-center" role="alert">
          <h1 className="font-display text-2xl font-semibold text-ink">No pudimos recuperar tu sesión</h1>
          <p className="text-sm text-muted">{hydrationError.message}</p>
          <Button onClick={retryHydration}>Reintentar</Button>
          <Button variant="ghost" size="md" onClick={logout}>
            Cerrar sesión
          </Button>
        </Card>
      </main>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.login} replace state={{ from: location }} />
  }

  if (roles?.length && !roles.includes(user?.rol)) {
    return <Navigate to={ROUTES.home} replace />
  }

  return <Outlet />
}

export default RequireAuth
