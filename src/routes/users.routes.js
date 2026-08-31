import { Router } from 'express'
import {
  actualizarUsuario,
  crearUsuario,
  eliminarUsuario,
  obtenerUsuarioPorId,
  obtenerUsuarios,
  subirDocumentoUsuario
} from '../controllers/users.controller.js'
import { uploadUserDocument } from '../config/multer.config.js'
import { uploadErrorHandler } from '../middlewares/index.js'

const router = Router()

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Obtener todos los usuarios
 *     description: Devuelve el listado completo de usuarios registrados en el sistema.
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: Usuarios obtenidos correctamente.
 */
router.get('/', obtenerUsuarios)

/**
 * @swagger
 * /api/users/{uid}/documents:
 *   post:
 *     summary: Subir documento de usuario
 *     description: Sube un documento asociado a un usuario existente.
 *     tags:
 *       - Users
 */
router.post(
  '/:uid/documents',
  uploadUserDocument.single('documento'),
  uploadErrorHandler,
  subirDocumentoUsuario
)

/**
 * @swagger
 * /api/users/{uid}:
 *   get:
 *     summary: Obtener usuario por ID
 *     description: Devuelve un usuario específico a partir de su ID de MongoDB.
 *     tags:
 *       - Users
 */
router.get('/:uid', obtenerUsuarioPorId)

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Crear usuario
 *     description: Crea un nuevo usuario en la base de datos.
 *     tags:
 *       - Users
 */
router.post('/', crearUsuario)

/**
 * @swagger
 * /api/users/{uid}:
 *   put:
 *     summary: Actualizar usuario
 *     description: Actualiza los datos de un usuario existente.
 *     tags:
 *       - Users
 */
router.put('/:uid', actualizarUsuario)

/**
 * @swagger
 * /api/users/{uid}:
 *   delete:
 *     summary: Eliminar usuario
 *     description: Elimina un usuario existente a partir de su ID.
 *     tags:
 *       - Users
 */
router.delete('/:uid', eliminarUsuario)

export default router