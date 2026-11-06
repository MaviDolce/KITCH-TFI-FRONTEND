import { useState } from "react"
import Badge from "../../components/ui/Badge"
import Button from "../../components/ui/Button"
import Card from "../../components/ui/Card"
import Logo from "../../components/ui/Logo"
import SearchField from "../../components/ui/SearchField"
import TextField from "../../components/ui/TextField"
import TextLink from "../../components/ui/TextLink"

const TOKENS = [
  { name: "primary", className: "bg-primary", hex: "#C92A02" },
  { name: "warning", className: "bg-warning", hex: "#F28B1D" },
  { name: "accent", className: "bg-accent", hex: "#EDD72D" },
  { name: "success", className: "bg-success", hex: "#28AF3C" },
  { name: "ink", className: "bg-ink", hex: "#15191E" },
  { name: "muted", className: "bg-muted", hex: "#5F6872" },
  { name: "line", className: "bg-line", hex: "#E9ECEF" },
  { name: "ai", className: "bg-ai", hex: "#FFF7E8" },
]

function SetupPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("kitch")
  const [query, setQuery] = useState("")

  return (
    <main className="mx-auto flex min-h-svh max-w-5xl flex-col gap-8 px-4 py-10 sm:px-6">
      <header className="flex flex-col gap-3">
        <Logo />
        <h1 className="text-3xl font-bold tracking-tight text-ink">
          Sistema de diseño
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-muted">
          Componentes base según Figma. Esta pantalla es temporal para revisar
          variantes, focus y estados. No es una pantalla de producto.
        </p>
      </header>

      <section aria-labelledby="tokens-title">
        <h2 id="tokens-title" className="mb-4 text-lg font-semibold text-ink">
          Colores
        </h2>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {TOKENS.map((token) => (
            <li key={token.name} className="rounded-2xl border border-line bg-surface p-3">
              <span
                className={`mb-3 block h-10 rounded-xl ${token.className}`}
                aria-hidden="true"
              />
              <p className="text-sm font-medium text-ink">{token.name}</p>
              <p className="text-xs text-muted">{token.hex}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="buttons-title">
        <h2 id="buttons-title" className="mb-4 text-lg font-semibold text-ink">
          Botones
        </h2>
        <Card className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-3">
            <Button>Iniciar sesión</Button>
            <Button variant="outline">Continuar con Google</Button>
            <Button variant="ghost">Ver receta →</Button>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button disabled>Deshabilitado</Button>
            <Button loading>Cargando</Button>
            <TextLink>¿La olvidaste?</TextLink>
          </div>
        </Card>
      </section>

      <section aria-labelledby="fields-title">
        <h2 id="fields-title" className="mb-4 text-lg font-semibold text-ink">
          Campos
        </h2>
        <Card className="grid gap-5">
          <TextField
            label="Usuario o email"
            placeholder="nombre@correo.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="username"
          />
          <TextField
            label="Contraseña"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            labelEnd={<TextLink>¿La olvidaste?</TextLink>}
          />
          <TextField
            label="Email"
            defaultValue="ya@usado.com"
            error="El email ya se encuentra registrado."
          />
          <TextField label="Deshabilitado" defaultValue="No editable" disabled />
          <SearchField
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </Card>
      </section>

      <section aria-labelledby="cards-title">
        <h2 id="cards-title" className="mb-4 text-lg font-semibold text-ink">
          Card y badge
        </h2>
        <Card tone="ai">
          <Badge>Recomendación destacada</Badge>
          <h3 className="mt-2 text-2xl font-bold text-primary">
            Pasta cremosa de vegetales
          </h3>
          <p className="mt-1 text-sm text-muted">25 min · Fácil · 6 ingredientes disponibles</p>
          <Button variant="soft" size="md" className="mt-4">
            Ver receta →
          </Button>
        </Card>
      </section>
    </main>
  )
}

export default SetupPage
