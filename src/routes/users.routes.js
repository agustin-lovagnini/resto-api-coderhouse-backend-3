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
 *     summary: Obtener usuarios paginados
 *     description: Devuelve un listado paginado de usuarios registrados en el sistema.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Numero de pagina a consultar.
 *         example: 1
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Cantidad maxima de usuarios por pagina.
 *         example: 10
 *     responses:
 *       200:
 *         description: Usuarios obtenidos correctamente.
 *       400:
 *         description: Parametros de paginacion invalidos.
 */
router.get('/', obtenerUsuarios)

/**
 * @swagger
 * /api/users/{uid}/documents:
 *   post:
 *     summary: Subir documento de usuario
 *     description: Sube un documento asociado a un usuario existente. El archivo se guarda en uploads/users/documents y en MongoDB se registran sus metadatos.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario.
 *         example: 64f8a8c2b9a1f23d45678910
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - tipoDocumento
 *               - documento
 *             properties:
 *               tipoDocumento:
 *                 type: string
 *                 enum:
 *                   - DNI
 *                   - CARNET_SANITARIO
 *                   - CONSTANCIA
 *                   - OTRO
 *                 example: DNI
 *               documento:
 *                 type: string
 *                 format: binary
 *                 description: Archivo permitido en formato JPEG, PNG, WEBP o PDF. Tamaño maximo 5 MB.
 *     responses:
 *       200:
 *         description: Documento cargado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Documento cargado correctamente
 *                 payload:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Archivo faltante, tipo de documento invalido, tipo de archivo no permitido o archivo demasiado grande.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Usuario no encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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
