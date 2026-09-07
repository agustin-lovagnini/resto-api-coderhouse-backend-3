import { Router } from 'express'
import {
  actualizarPedido,
  crearPedido,
  eliminarPedido,
  obtenerPedidoPorId,
  obtenerPedidos,
  obtenerPedidosPendientes,
  subirComprobantePedido
} from '../controllers/orders.controller.js'
import { uploadOrderReceipt } from '../config/multer.config.js'
import { uploadErrorHandler } from '../middlewares/index.js'

const router = Router()

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Obtener todos los pedidos
 *     description: Devuelve el listado completo de pedidos del restaurante.
 *     tags:
 *       - Orders
 */
router.get('/', obtenerPedidos)

/**
 * @swagger
 * /api/orders/pendientes:
 *   get:
 *     summary: Obtener pedidos pendientes
 *     description: Devuelve los pedidos cuyo estado es PENDIENTE.
 *     tags:
 *       - Orders
 */
router.get('/pendientes', obtenerPedidosPendientes)

/**
 * @swagger
 * /api/orders/{oid}/receipts:
 *   post:
 *     summary: Subir comprobante de pedido
 *     description: Sube un comprobante asociado a un pedido existente. El archivo se guarda en uploads/orders/receipts y en MongoDB se registran sus metadatos.
 *     tags:
 *       - Orders
 *     parameters:
 *       - in: path
 *         name: oid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del pedido.
 *         example: 64f8a8c2b9a1f23d45678913
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - tipoDocumento
 *               - comprobante
 *             properties:
 *               tipoDocumento:
 *                 type: string
 *                 enum:
 *                   - TICKET
 *                   - PAGO
 *                   - ENTREGA
 *                   - OTRO
 *                 example: TICKET
 *               comprobante:
 *                 type: string
 *                 format: binary
 *                 description: Archivo permitido en formato JPEG, PNG, WEBP o PDF. Tamaño maximo 5 MB.
 *     responses:
 *       200:
 *         description: Comprobante cargado correctamente.
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
 *                   example: Comprobante cargado correctamente
 *                 payload:
 *                   $ref: '#/components/schemas/Order'
 *       400:
 *         description: Archivo faltante, tipo de comprobante invalido, tipo de archivo no permitido o archivo demasiado grande.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Pedido no encontrado.
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
  '/:oid/receipts',
  uploadOrderReceipt.single('comprobante'),
  uploadErrorHandler,
  subirComprobantePedido
)

/**
 * @swagger
 * /api/orders/{oid}:
 *   get:
 *     summary: Obtener pedido por ID
 *     description: Devuelve un pedido específico a partir de su ID de MongoDB.
 *     tags:
 *       - Orders
 */
router.get('/:oid', obtenerPedidoPorId)

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Crear pedido
 *     description: Crea un nuevo pedido.
 *     tags:
 *       - Orders
 */
router.post('/', crearPedido)

/**
 * @swagger
 * /api/orders/{oid}:
 *   put:
 *     summary: Actualizar pedido
 *     description: Actualiza los datos de un pedido existente.
 *     tags:
 *       - Orders
 */
router.put('/:oid', actualizarPedido)

/**
 * @swagger
 * /api/orders/{oid}:
 *   delete:
 *     summary: Eliminar pedido
 *     description: Elimina un pedido existente a partir de su ID.
 *     tags:
 *       - Orders
 */
router.delete('/:oid', eliminarPedido)

export default router