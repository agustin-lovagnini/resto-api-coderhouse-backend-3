import { Router } from 'express'
import {
  actualizarPedido,
  crearPedido,
  eliminarPedido,
  obtenerPedidoPorId,
  obtenerPedidos,
  obtenerPedidosPendientes
} from '../controllers/orders.controller.js'

const router = Router()

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Obtener todos los pedidos
 *     description: Devuelve el listado completo de pedidos del restaurante.
 *     tags:
 *       - Orders
 *     responses:
 *       200:
 *         description: Pedidos obtenidos correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 payload:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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
 *     responses:
 *       200:
 *         description: Pedidos pendientes obtenidos correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 payload:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/pendientes', obtenerPedidosPendientes)

/**
 * @swagger
 * /api/orders/{oid}:
 *   get:
 *     summary: Obtener pedido por ID
 *     description: Devuelve un pedido específico a partir de su ID de MongoDB.
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
 *     responses:
 *       200:
 *         description: Pedido encontrado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 payload:
 *                   $ref: '#/components/schemas/Order'
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
router.get('/:oid', obtenerPedidoPorId)

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Crear pedido
 *     description: Crea un nuevo pedido. El total, precioUnitario y subtotal se calculan desde los productos existentes.
 *     tags:
 *       - Orders
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - mesa
 *               - empleado
 *               - productos
 *             properties:
 *               mesa:
 *                 type: number
 *                 example: 4
 *               empleado:
 *                 type: string
 *                 example: 64f8a8c2b9a1f23d45678912
 *               productos:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - producto
 *                     - cantidad
 *                   properties:
 *                     producto:
 *                       type: string
 *                       example: 64f8a8c2b9a1f23d45678911
 *                     cantidad:
 *                       type: number
 *                       example: 2
 *               estado:
 *                 type: string
 *                 enum:
 *                   - PENDIENTE
 *                   - EN_PREPARACION
 *                   - LISTO
 *                   - ENTREGADO
 *                   - CANCELADO
 *                 example: PENDIENTE
 *               observaciones:
 *                 type: string
 *                 example: Sin cebolla
 *     responses:
 *       201:
 *         description: Pedido creado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 payload:
 *                   $ref: '#/components/schemas/Order'
 *       400:
 *         description: Datos invalidos. Puede ocurrir si la mesa no es valida, falta empleado, no hay productos, una cantidad es menor a 1, un producto no esta disponible o el estado no es valido.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Empleado o producto del pedido no encontrado.
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
router.post('/', crearPedido)

/**
 * @swagger
 * /api/orders/{oid}:
 *   put:
 *     summary: Actualizar pedido
 *     description: Actualiza los datos de un pedido existente. Si se envian productos, recalcula total, precioUnitario y subtotal.
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
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mesa:
 *                 type: number
 *                 example: 5
 *               empleado:
 *                 type: string
 *                 example: 64f8a8c2b9a1f23d45678912
 *               productos:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     producto:
 *                       type: string
 *                       example: 64f8a8c2b9a1f23d45678911
 *                     cantidad:
 *                       type: number
 *                       example: 3
 *               estado:
 *                 type: string
 *                 enum:
 *                   - PENDIENTE
 *                   - EN_PREPARACION
 *                   - LISTO
 *                   - ENTREGADO
 *                   - CANCELADO
 *                 example: EN_PREPARACION
 *               observaciones:
 *                 type: string
 *                 example: Sin sal
 *     responses:
 *       200:
 *         description: Pedido actualizado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 payload:
 *                   $ref: '#/components/schemas/Order'
 *       400:
 *         description: Datos invalidos. Puede ocurrir si el estado del pedido no es valido, el empleado no esta activo, una cantidad es menor a 1 o un producto no esta disponible.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Pedido, empleado o producto no encontrado.
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
router.put('/:oid', actualizarPedido)

/**
 * @swagger
 * /api/orders/{oid}:
 *   delete:
 *     summary: Eliminar pedido
 *     description: Elimina un pedido existente a partir de su ID.
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
 *     responses:
 *       200:
 *         description: Pedido eliminado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 payload:
 *                   $ref: '#/components/schemas/Order'
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
router.delete('/:oid', eliminarPedido)

export default router