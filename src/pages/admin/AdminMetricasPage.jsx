import { useEffect, useState } from "react"
import Card from "../../components/ui/Card"
import Spinner from "../../components/ui/Spinner"
import { formatMoney } from "../../constants/subscription"
import { adminService } from "../../services/adminService"

function buildSecciones(metricas) {
  return [
    {
      titulo: "Usuarios",
      items: [
        { label: "Totales", valor: metricas.usuariosTotales },
        { label: "Activos", valor: metricas.usuariosActivos },
        { label: "Básicos", valor: metricas.usuariosBasicos },
        { label: "Profesionales", valor: metricas.usuariosProfesionales },
        { label: "Administradores", valor: metricas.usuariosAdmin },
      ],
    },
    {
      titulo: "Suscripciones y pagos",
      items: [
        { label: "Suscripciones totales", valor: metricas.suscripcionesTotales },
        { label: "Suscripciones activas", valor: metricas.suscripcionesActivas },
        { label: "Contratos activos", valor: metricas.contratosActivos },
        { label: "Pagos aprobados", valor: metricas.pagosAprobados },
        { label: "Ingresos totales", valor: formatMoney(metricas.ingresosTotales ?? 0) },
      ],
    },
    {
      titulo: "Kitch IA",
      items: [
        { label: "Peticiones de hoy", valor: metricas.peticionesIaHoy },
        { label: "Usuarios en el tope diario", valor: metricas.usuariosEnTopeIa },
        { label: "Límite plan básico", valor: metricas.limiteIaBasico },
        { label: "Límite plan profesional", valor: metricas.limiteIaProfesional },
      ],
    },
  ]
}

function AdminMetricasPage() {
  const [metricas, setMetricas] = useState(null)
  const [error, setError] = useState("")

  useEffect(() => {
    let active = true
    adminService
      .getMetricas()
      .then((data) => {
        if (active) {
          setMetricas(data)
        }
      })
      .catch((err) => {
        if (active) {
          setError(err.message)
        }
      })
    return () => {
      active = false
    }
  }, [])

  return (
    <div className="relative isolate">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">Métricas</h1>
        <p className="mt-2 text-base text-muted">Estado general de la plataforma</p>
      </header>

      {error ? (
        <p className="mt-6 text-sm text-primary" role="alert">
          {error}
        </p>
      ) : null}

      {!metricas && !error ? (
        <div className="mt-10 flex justify-center" role="status" aria-label="Cargando métricas">
          <Spinner size={24} className="text-primary" />
        </div>
      ) : null}

      {metricas ? (
        <div className="mt-8 grid gap-6">
          {buildSecciones(metricas).map((seccion) => (
            <section key={seccion.titulo} aria-labelledby={`metricas-${seccion.titulo}`}>
              <h2 id={`metricas-${seccion.titulo}`} className="text-lg font-bold tracking-tight text-ink">
                {seccion.titulo}
              </h2>
              <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {seccion.items.map((item) => (
                  <Card key={item.label} className="flex flex-col gap-1">
                    <span className="text-sm text-muted">{item.label}</span>
                    <span className="text-2xl font-bold text-ink">{item.valor ?? 0}</span>
                  </Card>
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : null}
    </div>
  )
}

export default AdminMetricasPage
