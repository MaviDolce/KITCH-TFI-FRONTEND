export function filtrarUsuarios(usuarios, termino) {
  const valor = termino.trim().toLowerCase()
  if (!valor) {
    return usuarios
  }
  return usuarios.filter((usuario) =>
    [usuario.nombre, usuario.apellido, usuario.nombreUsuario, usuario.email]
      .join(" ")
      .toLowerCase()
      .includes(valor),
  )
}

export function reemplazarUsuario(usuarios, actualizado) {
  return usuarios.map((usuario) => (usuario.id === actualizado.id ? actualizado : usuario))
}
