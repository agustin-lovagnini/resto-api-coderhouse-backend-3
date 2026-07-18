import { ROLES_USUARIO } from '../constants/index.js'
import { usersRepository } from '../repositories/users.repository.js'

export const usersService = {
  obtenerUsuarios: async () => {
    return usersRepository.getAll()
  },

  obtenerUsuarioPorId: async (id) => {
    const usuario = await usersRepository.getById(id)

    if (!usuario) {
      throw new Error('Usuario no encontrado')
    }

    return usuario
  },

  crearUsuario: async (userData) => {
    if (!userData.nombre) {
      throw new Error('El nombre del usuario es obligatorio')
    }

    if (!userData.apellido) {
      throw new Error('El apellido del usuario es obligatorio')
    }

    if (!userData.email) {
      throw new Error('El email del usuario es obligatorio')
    }

    if (
      userData.rol &&
      !Object.values(ROLES_USUARIO).includes(userData.rol)
    ) {
      throw new Error('El rol del usuario no es válido')
    }

    const usuarioExistente = await usersRepository.getByEmail(userData.email)

    if (usuarioExistente) {
      throw new Error('Ya existe un usuario con ese email')
    }

    const nuevoUsuario = {
      ...userData,
      rol: userData.rol || ROLES_USUARIO.USUARIO
    }

    return usersRepository.create(nuevoUsuario)
  },

  actualizarUsuario: async (id, userData) => {
    if (
      userData.rol &&
      !Object.values(ROLES_USUARIO).includes(userData.rol)
    ) {
      throw new Error('El rol del usuario no es válido')
    }

    if (userData.email) {
      const usuarioExistente = await usersRepository.getByEmail(userData.email)

      if (usuarioExistente && usuarioExistente._id.toString() !== id) {
        throw new Error('Ya existe un usuario con ese email')
      }
    }

    const usuarioActualizado = await usersRepository.updateById(id, userData)

    if (!usuarioActualizado) {
      throw new Error('Usuario no encontrado')
    }

    return usuarioActualizado
  },

  eliminarUsuario: async (id) => {
    const usuarioEliminado = await usersRepository.deleteById(id)

    if (!usuarioEliminado) {
      throw new Error('Usuario no encontrado')
    }

    return usuarioEliminado
  }
}
