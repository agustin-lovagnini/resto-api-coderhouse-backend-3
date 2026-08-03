import { ROLES_USUARIO } from '../constants/index.js'
import {
  createDuplicateError,
  createNotFoundError,
  createValidationError
} from '../errors/errorFactory.js'
import { usersRepository } from '../repositories/users.repository.js'

export const usersService = {
  obtenerUsuarios: async () => {
    return usersRepository.getAll()
  },

  obtenerUsuarioPorId: async (id) => {
    const usuario = await usersRepository.getById(id)

    if (!usuario) {
      throw createNotFoundError('Usuario no encontrado')
    }

    return usuario
  },

  crearUsuario: async (userData) => {
    if (!userData.nombre) {
      throw createValidationError('El nombre del usuario es obligatorio')
    }

    if (!userData.apellido) {
      throw createValidationError('El apellido del usuario es obligatorio')
    }

    if (!userData.email) {
      throw createValidationError('El email del usuario es obligatorio')
    }

    if (
      userData.rol &&
      !Object.values(ROLES_USUARIO).includes(userData.rol)
    ) {
      throw createValidationError('El rol del usuario no es valido')
    }

    const usuarioExistente = await usersRepository.getByEmail(userData.email)

    if (usuarioExistente) {
      throw createDuplicateError('Ya existe un usuario con ese email')
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
      throw createValidationError('El rol del usuario no es valido')
    }

    if (userData.email) {
      const usuarioExistente = await usersRepository.getByEmail(userData.email)

      if (usuarioExistente && usuarioExistente._id.toString() !== id) {
        throw createDuplicateError('Ya existe un usuario con ese email')
      }
    }

    const usuarioActualizado = await usersRepository.updateById(id, userData)

    if (!usuarioActualizado) {
      throw createNotFoundError('Usuario no encontrado')
    }

    return usuarioActualizado
  },

  eliminarUsuario: async (id) => {
    const usuarioEliminado = await usersRepository.deleteById(id)

    if (!usuarioEliminado) {
      throw createNotFoundError('Usuario no encontrado')
    }

    return usuarioEliminado
  }
}