import { useEffect, useState } from "react"
import { CreditCard, LogOut, Sparkles, UserRound } from "lucide-react"
import PersonalInfoForm from "../../components/perfil/PersonalInfoForm"
import ProfileHero from "../../components/perfil/ProfileHero"
import ProfileNavCard from "../../components/perfil/ProfileNavCard"
import Button from "../../components/ui/Button"
import Spinner from "../../components/ui/Spinner"
import { ROUTES } from "../../constants/routes"
import { useAuth } from "../../hooks/useAuth"
import { perfilService } from "../../services/perfilService"
import { planLabel } from "../../utils/profile"

function PerfilPage() {
  const { user, logout, updateProfile } = useAuth()
  const [section, setSection] = useState("hub")
  const [profile, setProfile] = useState(user)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    perfilService
      .getMe()
      .then((data) => {
        if (active) {
          setProfile(data)
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false)
        }
      })
    return () => {
      active = false
    }
  }, [])

  async function handleUpdate(payload) {
    const next = await updateProfile(payload)
    setProfile(next)
  }

  if (loading || !profile) {
    return (
      <div className="flex justify-center py-16" role="status" aria-label="Cargando perfil">
        <Spinner size={24} className="text-primary" />
      </div>
    )
  }

  return (
    <div className="relative isolate overflow-hidden">
      <div
        className="pointer-events-none absolute -top-20 right-8 size-64 rounded-full bg-success/20 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-40 -right-16 size-72 rounded-full bg-accent/30 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-24 left-1/3 size-56 rounded-full bg-warning/20 blur-3xl"
        aria-hidden="true"
      />

      <header className="relative">
        <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">Mi perfil</h1>
        <p className="mt-2 text-base text-muted">
          Administrá tu información personal y tu cuenta
        </p>
      </header>

      <div className="relative">
        <ProfileHero user={profile} plan={planLabel(profile.rol)} />
      </div>

      {section === "personal" ? (
        <div className="relative mt-8">
          <PersonalInfoForm
            user={profile}
            onSubmit={handleUpdate}
            onBack={() => setSection("hub")}
          />
        </div>
      ) : null}

      {section === "hub" ? (
        <>
          <div className="relative mt-8 grid max-w-2xl gap-4 sm:grid-cols-2">
            <ProfileNavCard
              icon={UserRound}
              title="Información personal"
              onClick={() => setSection("personal")}
            />
            <ProfileNavCard
              icon={Sparkles}
              title="Kitch Premium"
              tone="accent"
              to={ROUTES.suscripcion}
            />
            <ProfileNavCard
              icon={CreditCard}
              title="Método de pago"
              to={ROUTES.suscripcion}
            />
          </div>

          <Button variant="outline" size="md" className="relative mt-8" onClick={logout}>
            <LogOut size={16} aria-hidden="true" />
            Cerrar sesión
          </Button>
        </>
      ) : null}
    </div>
  )
}

export default PerfilPage
