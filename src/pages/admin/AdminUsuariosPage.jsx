import { useEffect, useMemo, useState } from "react"
import { KeyRound, Lock, LockOpen, Trash2 } from "lucide-react"
import Badge from "../../components/ui/Badge"
import Button from "../../components/ui/Button"
import Card from "../../components/ui/Card"
import ConfirmModal from "../../components/ui/ConfirmModal"
import SearchField from "../../components/ui/SearchField"
import Spinner from "../../components/ui/Spinner"
import StatusBanner from "../../components/ui/StatusBanner"
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
  const [saliendoId, setSaliendoId] = useState(null)
  const [usuarioAEliminar, setUsuarioAEliminar] = useState(null)
  const [deleteError, setDeleteError] = useState("")

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
      } else if (accion === "bloqueo") {
        const actualizado = await adminService.bloquear(usuario.id)
        setUsuarios((current) => reemplazarUsuario(current, actualizado))
        setNotice(`${actualizado.nombreUsuario} fue bloqueado.`)
      } else {
        const actualizado = await adminService.desbloquear(usuario.id)
        setUsuarios((current) => reemplazarUsuario(current, actualizado))
        setNotice(`${actualizado.nombreUsuario} fue desbloqueado.`)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setPendingId(null)
    }
  }

  async function confirmarEliminacion() {
    if (!usuarioAEliminar || pendingId === usuarioAEliminar.id) {
      return
    }
    const targetId = usuarioAEliminar.id
    const targetNombre = usuarioAEliminar.nombreUsuario
    setDeleteError("")
    setPendingId(targetId)
    try {
      await adminService.eliminar(targetId)
      setUsuarioAEliminar(null)
      setSaliendoId(targetId)
      window.setTimeout(() => {
        setUsuarios((current) => current.filter((item) => item.id !== targetId))
        setSaliendoId((current) => (current === targetId ? null : current))
        setNotice(`La cuenta de ${targetNombre} fue borrada.`)
      }, 210)
    } catch (err) {
      setDeleteError(err.message)
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

      {error ? <StatusBanner message={error} tone="error" className="mt-4" /> : null}
      {notice ? <StatusBanner message={notice} className="mt-4" /> : null}

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
              <Card
                as="li"
                key={usuario.id}
                className={`flex flex-wrap items-center justify-between gap-4 transition-shadow duration-150 hover:shadow-md ${
                  saliendoId === usuario.id ? "animate-card-exit pointer-events-none" : ""
                }`}
              >
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
                      disabled={pendingId === usuario.id}
                      onClick={() => {
                        setDeleteError("")
                        setUsuarioAEliminar(usuario)
                      }}
                    >
                      <Trash2 size={16} aria-hidden="true" />
                      Borrar cuenta
                    </Button>
                    {usuario.activo ? (
                      <Button
                        variant="outline"
                        size="md"
                        loading={pendingId === usuario.id}
                        onClick={() => ejecutar(usuario, "bloqueo")}
                      >
                        <Lock size={16} aria-hidden="true" />
                        Bloquear
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="md"
                        loading={pendingId === usuario.id}
                        onClick={() => ejecutar(usuario, "desbloqueo")}
                      >
                        <LockOpen size={16} aria-hidden="true" />
                        Desbloquear
                      </Button>
                    )}
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

      <ConfirmModal
        open={Boolean(usuarioAEliminar)}
        title="Borrar cuenta"
        description={
          usuarioAEliminar
            ? `¿Seguro que querés borrar la cuenta de ${usuarioAEliminar.nombreUsuario}? Se eliminan todos sus datos y esta acción no se puede deshacer.`
            : ""
        }
        confirmLabel="Borrar cuenta"
        loading={Boolean(usuarioAEliminar && pendingId === usuarioAEliminar.id)}
        error={deleteError}
        onConfirm={confirmarEliminacion}
        onCancel={() => {
          if (!usuarioAEliminar || pendingId !== usuarioAEliminar.id) {
            setDeleteError("")
            setUsuarioAEliminar(null)
          }
        }}
      />
    </div>
  )
}

export default AdminUsuariosPage
