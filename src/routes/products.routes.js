import { Router } from 'express'
import {
  actualizarProducto,
  crearProducto,
  eliminarProducto,
  obtenerProductoPorId,
  obtenerProductos,
  obtenerProductosDisponibles
} from '../controllers/products.controller.js'

const router = Router()

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Obtener todos los productos
 *     description: Devuelve el listado completo de productos del restaurante.
 *     tags:
 *       - Products
 *     responses:
 *       200:
 *         description: Productos obtenidos correctamente.
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
 *                     $ref: '#/components/schemas/Product'
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', obtenerProductos)

/**
 * @swagger
 * /api/products/available:
 *   get:
 *     summary: Obtener productos disponibles
 *     description: Devuelve los productos cuyo estado es DISPONIBLE.
 *     tags:
 *       - Products
 *     responses:
 *       200:
 *         description: Productos disponibles obtenidos correctamente.
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
 *                     $ref: '#/components/schemas/Product'
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/available', obtenerProductosDisponibles)

/**
 * @swagger
 * /api/products/disponibles:
 *   get:
 *     summary: Obtener productos disponibles
 *     description: Devuelve los productos disponibles. Es una ruta alternativa a /api/products/available.
 *     tags:
 *       - Products
 *     responses:
 *       200:
 *         description: Productos disponibles obtenidos correctamente.
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
 *                     $ref: '#/components/schemas/Product'
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/disponibles', obtenerProductosDisponibles)

/**
 * @swagger
 * /api/products/{pid}:
 *   get:
 *     summary: Obtener producto por ID
 *     description: Devuelve un producto específico a partir de su ID de MongoDB.
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: pid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto.
 *         example: 64f8a8c2b9a1f23d45678911
 *     responses:
 *       200:
 *         description: Producto encontrado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 payload:
 *                   $ref: '#/components/schemas/Product'
 *       404:
 *         description: Producto no encontrado.
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
router.get('/:pid', obtenerProductoPorId)

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Crear producto
 *     description: Crea un nuevo producto del menú.
 *     tags:
 *       - Products
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - categoria
 *               - precio
 *               - stock
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Hamburguesa completa
 *               descripcion:
 *                 type: string
 *                 example: Hamburguesa con queso, lechuga, tomate y papas.
 *               categoria:
 *                 type: string
 *                 enum:
 *                   - ENTRADAS
 *                   - PLATOS_PRINCIPALES
 *                   - POSTRES
 *                   - BEBIDAS
 *                 example: PLATOS_PRINCIPALES
 *               precio:
 *                 type: number
 *                 example: 8500
 *               stock:
 *                 type: number
 *                 example: 25
 *               estado:
 *                 type: string
 *                 enum:
 *                   - DISPONIBLE
 *                   - SIN_STOCK
 *                   - DISCONTINUADO
 *                 example: DISPONIBLE
 *     responses:
 *       201:
 *         description: Producto creado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 payload:
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         description: Datos inválidos. Puede ocurrir si falta un campo obligatorio, si la categoría no es válida, si el estado no es válido o si precio/stock son menores a cero.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Ya existe un producto con ese nombre.
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
router.post('/', crearProducto)

/**
 * @swagger
 * /api/products/{pid}:
 *   put:
 *     summary: Actualizar producto
 *     description: Actualiza los datos de un producto existente.
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: pid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto.
 *         example: 64f8a8c2b9a1f23d45678911
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Hamburguesa actualizada
 *               descripcion:
 *                 type: string
 *                 example: Hamburguesa doble con papas.
 *               categoria:
 *                 type: string
 *                 enum:
 *                   - ENTRADAS
 *                   - PLATOS_PRINCIPALES
 *                   - POSTRES
 *                   - BEBIDAS
 *                 example: PLATOS_PRINCIPALES
 *               precio:
 *                 type: number
 *                 example: 9500
 *               stock:
 *                 type: number
 *                 example: 20
 *               estado:
 *                 type: string
 *                 enum:
 *                   - DISPONIBLE
 *                   - SIN_STOCK
 *                   - DISCONTINUADO
 *                 example: DISPONIBLE
 *     responses:
 *       200:
 *         description: Producto actualizado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 payload:
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         description: Datos inválidos. Puede ocurrir si la categoría, el estado, el precio o el stock no son válidos.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Producto no encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Ya existe un producto con ese nombre.
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
router.put('/:pid', actualizarProducto)

/**
 * @swagger
 * /api/products/{pid}:
 *   delete:
 *     summary: Eliminar producto
 *     description: Elimina un producto existente a partir de su ID.
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: pid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto.
 *         example: 64f8a8c2b9a1f23d45678911
 *     responses:
 *       200:
 *         description: Producto eliminado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 payload:
 *                   $ref: '#/components/schemas/Product'
 *       404:
 *         description: Producto no encontrado.
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
router.delete('/:pid', eliminarProducto)

export default router