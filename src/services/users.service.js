import {
  ROLES_USUARIO,
  TIPOS_DOCUMENTO_USUARIO
} from '../constants/index.js'
import { logger } from '../config/logger.config.js'
import {
  createDuplicateError,
  createNotFoundError,
  createValidationError
} from '../errors/errorFactory.js'
import { usersRepository } from '../repositories/users.repository.js'

const crearMetadataArchivo = (file, tipoDocumento) => {
  return {
    nombreOriginal: file.originalname,
    nombreArchivo: file.filename,
    ruta: file.path,
    mimetype: file.mimetype,
    size: file.size,
    tipoDocumento,
    fechaCarga: new Date()
  }
}

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

  subirDocumentoUsuario: async (id, file, tipoDocumento) => {
    if (!file) {
      throw createValidationError('El archivo es obligatorio')
    }

    if (!tipoDocumento) {
      throw createValidationError('El tipo de documento es obligatorio')
    }

    if (!Object.values(TIPOS_DOCUMENTO_USUARIO).includes(tipoDocumento)) {
      logger.warning('Tipo de documento de usuario no permitido', {
        usuarioId: id,
        tipoDocumento
      })

      throw createValidationError('El tipo de documento no es valido')
    }

    const usuario = await usersRepository.getById(id)

    if (!usuario) {
      throw createNotFoundError('Usuario no encontrado')
    }

    const documento = crearMetadataArchivo(file, tipoDocumento)

    const usuarioActualizado = await usersRepository.addDocumentById(
      id,
      documento
    )

    logger.info('Documento de usuario cargado correctamente', {
      usuarioId: id,
      tipoDocumento,
      archivo: documento.nombreArchivo
    })

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