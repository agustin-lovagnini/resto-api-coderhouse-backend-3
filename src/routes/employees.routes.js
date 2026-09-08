import { Router } from 'express'
import {
  actualizarEmpleado,
  crearEmpleado,
  eliminarEmpleado,
  obtenerEmpleadoPorId,
  obtenerEmpleados,
  obtenerEmpleadosActivos
} from '../controllers/employees.controller.js'

const router = Router()

/**
 * @swagger
 * /api/employees:
 *   get:
 *     summary: Obtener empleados paginados
 *     description: Devuelve un listado paginado de empleados del restaurante.
 *     tags:
 *       - Employees
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
 *         description: Cantidad maxima de empleados por pagina.
 *         example: 10
 *     responses:
 *       200:
 *         description: Empleados obtenidos correctamente.
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
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', obtenerEmpleados)

/**
 * @swagger
 * /api/employees/activos:
 *   get:
 *     summary: Obtener empleados activos paginados
 *     description: Devuelve un listado paginado de empleados cuyo campo activo es true.
 *     tags:
 *       - Employees
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
 *         description: Cantidad maxima de empleados por pagina.
 *         example: 10
 *     responses:
 *       200:
 *         description: Empleados activos obtenidos correctamente.
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
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/activos', obtenerEmpleadosActivos)

/**
 * @swagger
 * /api/employees/{eid}:
 *   get:
 *     summary: Obtener empleado por ID
 *     description: Devuelve un empleado específico a partir de su ID de MongoDB.
 *     tags:
 *       - Employees
 *     parameters:
 *       - in: path
 *         name: eid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del empleado.
 *         example: 64f8a8c2b9a1f23d45678912
 *     responses:
 *       200:
 *         description: Empleado encontrado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 payload:
 *                   $ref: '#/components/schemas/Employee'
 *       404:
 *         description: Empleado no encontrado.
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
router.get('/:eid', obtenerEmpleadoPorId)

/**
 * @swagger
 * /api/employees:
 *   post:
 *     summary: Crear empleado
 *     description: Crea un nuevo empleado del restaurante.
 *     tags:
 *       - Employees
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - apellido
 *               - email
 *               - puesto
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Laura
 *               apellido:
 *                 type: string
 *                 example: Gomez
 *               email:
 *                 type: string
 *                 example: laura.gomez@resto.com
 *               telefono:
 *                 type: string
 *                 example: 1122334455
 *               puesto:
 *                 type: string
 *                 enum:
 *                   - MOZO
 *                   - COCINERO
 *                   - CAJERO
 *                   - ENCARGADO
 *                 example: MOZO
 *               activo:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Empleado creado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 payload:
 *                   $ref: '#/components/schemas/Employee'
 *       400:
 *         description: Datos invalidos. Puede ocurrir si falta nombre, apellido, email o si el puesto no es valido.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Ya existe un empleado con ese email.
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
router.post('/', crearEmpleado)

/**
 * @swagger
 * /api/employees/{eid}:
 *   put:
 *     summary: Actualizar empleado
 *     description: Actualiza los datos de un empleado existente.
 *     tags:
 *       - Employees
 *     parameters:
 *       - in: path
 *         name: eid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del empleado.
 *         example: 64f8a8c2b9a1f23d45678912
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Laura
 *               apellido:
 *                 type: string
 *                 example: Gomez
 *               email:
 *                 type: string
 *                 example: laura.actualizada@resto.com
 *               telefono:
 *                 type: string
 *                 example: 1199887766
 *               puesto:
 *                 type: string
 *                 enum:
 *                   - MOZO
 *                   - COCINERO
 *                   - CAJERO
 *                   - ENCARGADO
 *                 example: ENCARGADO
 *               activo:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Empleado actualizado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 payload:
 *                   $ref: '#/components/schemas/Employee'
 *       400:
 *         description: Datos invalidos. Puede ocurrir si el puesto no es valido.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Empleado no encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Ya existe un empleado con ese email.
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
router.put('/:eid', actualizarEmpleado)

/**
 * @swagger
 * /api/employees/{eid}:
 *   delete:
 *     summary: Eliminar empleado
 *     description: Elimina un empleado existente a partir de su ID.
 *     tags:
 *       - Employees
 *     parameters:
 *       - in: path
 *         name: eid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del empleado.
 *         example: 64f8a8c2b9a1f23d45678912
 *     responses:
 *       200:
 *         description: Empleado eliminado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 payload:
 *                   $ref: '#/components/schemas/Employee'
 *       404:
 *         description: Empleado no encontrado.
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
router.delete('/:eid', eliminarEmpleado)

export default router
