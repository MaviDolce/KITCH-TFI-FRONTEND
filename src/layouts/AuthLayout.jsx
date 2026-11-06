import { Outlet } from "react-router-dom"
import Card from "../components/ui/Card"
import Logo from "../components/ui/Logo"

function AuthLayout() {
  return (
    <div className="min-h-svh bg-canvas lg:grid lg:grid-cols-2">
      <section className="relative hidden flex-col justify-between overflow-hidden bg-surface px-12 py-10 lg:flex">
        <div
          className="pointer-events-none absolute -top-24 right-0 size-72 rounded-full bg-accent/35 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute bottom-10 -left-16 size-80 rounded-full bg-success/15 blur-3xl"
          aria-hidden="true"
        />
        <Logo size="lg" className="relative" />
        <div className="relative max-w-md">
          <h2 className="text-4xl font-bold tracking-tight text-ink">
            ¿Qué cocinamos hoy?
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted">
            Organizá tu alacena, planificá la semana y cociná con lo que ya
            tenés en casa.
          </p>
          <Card tone="ai" className="mt-8 max-w-sm">
            <p className="font-semibold text-ink">Idea inteligente</p>
            <p className="mt-1 text-sm leading-relaxed text-muted">
              Recetas sugeridas según tu stock, sin inventario extra.
            </p>
          </Card>
        </div>
        <p className="relative text-sm text-muted">Kitch</p>
      </section>

      <div id="contenido" tabIndex={-1} className="flex min-h-svh items-center justify-center px-4 py-10">
        <div className="w-full max-w-[420px]">
          <div className="mb-8 flex justify-center lg:hidden">
            <Logo />
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default AuthLayout
