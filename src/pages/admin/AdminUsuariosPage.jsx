import { useEffect, useMemo, useState } from "react"
import { KeyRound, Lock, LockOpen } from "lucide-react"
import Badge from "../../components/ui/Badge"
import Button from "../../components/ui/Button"
import Card from "../../components/ui/Card"
import SearchField from "../../components/ui/SearchField"
import Spinner from "../../components/ui/Spinner"
import { ROLES } from "../../constants/roles"
import { adminService } from "../../services/adminService"
import { filtrarUsuarios, reemplazarUsuario } from "../../utils/admin"

function AdminUsuariosPage() {
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [busqueda, setBusqueda] = useState("")
  const [error, setError] = useState("")
  const [notice, setNotice] = useState("")
  const [pendingId, setPendingId] = useState(null)

  useEffect(() => {
    let active = true
    adminService
      .getUsuarios()
      .then((data) => {
        if (active) {
          setUsuarios(data)
        }
      })
      .catch((err) => {
        if (active) {
          setError(err.message)
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

  const visibles = useMemo(() => filtrarUsuarios(usuarios, busqueda), [usuarios, busqueda])

  async function ejecutar(usuario, accion) {
    setError("")
    setNotice("")
    setPendingId(usuario.id)
    try {
      if (accion === "recuperar") {
        const result = await adminService.enviarRecuperacion(usuario.id)
        setNotice(result.message)
      } else {
        const actualizado = usuario.activo
          ? await adminService.bloquear(usuario.id)
          : await adminService.desbloquear(usuario.id)
        setUsuarios((current) => reemplazarUsuario(current, actualizado))
        setNotice(
          actualizado.activo
            ? `${actualizado.nombreUsuario} fue desbloqueado.`
            : `${actualizado.nombreUsuario} fue bloqueado.`,
        )
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setPendingId(null)
    }
  }

  return (
    <div className="relative isolate">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">Usuarios</h1>
        <p className="mt-2 text-base text-muted">Administrá las cuentas de la plataforma</p>
      </header>

      <SearchField
        label="Buscar por nombre, usuario o email"
        className="mt-6 max-w-xl"
        value={busqueda}
        onChange={(event) => setBusqueda(event.target.value)}
      />

      {error ? (
        <p className="mt-4 text-sm text-primary" role="alert">
          {error}
        </p>
      ) : null}
      {notice ? (
        <p className="mt-4 text-sm text-success" role="status">
          {notice}
        </p>
      ) : null}

      {loading ? (
        <div className="mt-10 flex justify-center" role="status" aria-label="Cargando usuarios">
          <Spinner size={24} className="text-primary" />
        </div>
      ) : (
        <ul className="mt-6 grid gap-3">
          {visibles.length === 0 ? (
            <li className="text-sm text-muted">No hay usuarios que coincidan con la búsqueda.</li>
          ) : null}
          {visibles.map((usuario) => {
            const esAdmin = usuario.rol === ROLES.admin
            return (
              <Card as="li" key={usuario.id} className="flex flex-wrap items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-ink">
                      {usuario.nombre} {usuario.apellido}
                    </p>
                    <Badge>{usuario.rol}</Badge>
                    {!usuario.activo ? <Badge className="text-muted">Bloqueado</Badge> : null}
                  </div>
                  <p className="mt-1 truncate text-sm text-muted">
                    @{usuario.nombreUsuario} · {usuario.email}
                  </p>
                </div>
                {esAdmin ? null : (
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="md"
                      loading={pendingId === usuario.id}
                      onClick={() => ejecutar(usuario, "bloqueo")}
                    >
                      {usuario.activo ? (
                        <Lock size={16} aria-hidden="true" />
                      ) : (
                        <LockOpen size={16} aria-hidden="true" />
                      )}
                      {usuario.activo ? "Bloquear" : "Desbloquear"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="md"
                      disabled={!usuario.activo || pendingId === usuario.id}
                      onClick={() => ejecutar(usuario, "recuperar")}
                    >
                      <KeyRound size={16} aria-hidden="true" />
                      Enviar recupero
                    </Button>
                  </div>
                )}
              </Card>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export default AdminUsuariosPage
