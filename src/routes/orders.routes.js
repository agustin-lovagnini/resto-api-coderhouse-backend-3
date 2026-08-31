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
 *     description: Sube un comprobante asociado a un pedido existente.
 *     tags:
 *       - Orders
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