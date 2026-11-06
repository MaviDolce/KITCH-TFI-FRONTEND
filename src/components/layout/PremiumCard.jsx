import { ROUTES } from "../../constants/routes"
import { ROLES } from "../../constants/roles"
import { useAuth } from "../../hooks/useAuth"
import Button from "../ui/Button"

function PremiumCard() {
  const { user } = useAuth()
  const isBasico = user?.rol === ROLES.basico

  return (
    <div className="rounded-2xl bg-ai p-4">
      <p className="font-semibold text-ink">Kitch Premium</p>
      <p className="mt-1 text-sm text-muted">{isBasico ? "Mejora tu plan" : "Tu plan está activo"}</p>
      <Button
        to={ROUTES.suscripcion}
        variant="accent"
        size="md"
        className="mt-3 w-full"
      >
        {isBasico ? "Mejorar" : "Ver plan"}
      </Button>
    </div>
  )
}

export default PremiumCard
