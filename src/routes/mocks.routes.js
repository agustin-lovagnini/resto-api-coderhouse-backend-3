import { Router } from 'express'
import {
  responderEmpleadosMock,
  responderPedidosMock,
  responderPopulateMocks,
  responderUsuariosMock
} from '../controllers/mocks.controller.js'

const router = Router()

/**
 * @swagger
 * /api/mocks/users:
 *   get:
 *     summary: Obtener usuarios mock
 *     description: Genera usuarios mock en memoria. No los inserta en la base de datos.
 *     tags:
 *       - Mocks
 *     parameters:
 *       - in: query
 *         name: cantidad
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Cantidad de usuarios mock a generar.
 *         example: 10
 *     responses:
 *       200:
 *         description: Usuarios mock generados correctamente.
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
 *                     $ref: '#/components/schemas/User'
 *       400:
 *         description: Cantidad invalida. Ocurre si cantidad falta, no es numerica, no es entera, es menor o igual a 0, o supera 100.
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
router.get('/users', responderUsuariosMock)

/**
 * @swagger
 * /api/mocks/employees:
 *   get:
 *     summary: Obtener empleados mock
 *     description: Genera empleados mock en memoria. No los inserta en la base de datos.
 *     tags:
 *       - Mocks
 *     parameters:
 *       - in: query
 *         name: cantidad
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Cantidad de empleados mock a generar.
 *         example: 10
 *     responses:
 *       200:
 *         description: Empleados mock generados correctamente.
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
 *                     $ref: '#/components/schemas/Employee'
 *       400:
 *         description: Cantidad invalida. Ocurre si cantidad falta, no es numerica, no es entera, es menor o igual a 0, o supera 100.
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
router.get('/employees', responderEmpleadosMock)

/**
 * @swagger
 * /api/mocks/orders:
 *   get:
 *     summary: Obtener pedidos mock
 *     description: Genera pedidos mock en memoria usando empleados activos y productos existentes. No los inserta en la base de datos.
 *     tags:
 *       - Mocks
 *     parameters:
 *       - in: query
 *         name: cantidad
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Cantidad de pedidos mock a generar.
 *         example: 10
 *     responses:
 *       200:
 *         description: Pedidos mock generados correctamente.
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
 *       400:
 *         description: Cantidad invalida. Ocurre si cantidad falta, no es numerica, no es entera, es menor o igual a 0, o supera 100.
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
router.get('/orders', responderPedidosMock)

/**
 * @swagger
 * /api/mocks/populate:
 *   post:
 *     summary: Insertar datos mock en la base de datos
 *     description: Inserta usuarios, empleados y/o pedidos mock en MongoDB. Para insertar pedidos deben existir empleados activos y productos en la base de datos.
 *     tags:
 *       - Mocks
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               users:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 100
 *                 example: 5
 *               employees:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 100
 *                 example: 5
 *               orders:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 100
 *                 example: 5
 *     responses:
 *       201:
 *         description: Datos mock insertados correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 payload:
 *                   type: object
 *                   properties:
 *                     usuarios:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/User'
 *                     empleados:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Employee'
 *                     pedidos:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Order'
 *       400:
 *         description: Datos invalidos. Puede ocurrir si no se envia ninguna cantidad, si alguna cantidad es invalida, o si se intentan insertar pedidos sin empleados activos o productos existentes.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error interno al insertar datos mock.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/populate', responderPopulateMocks)

export default router