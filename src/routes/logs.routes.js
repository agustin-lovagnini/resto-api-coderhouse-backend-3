import { Router } from 'express'
import { probarLogger } from '../controllers/logs.controller.js'

const router = Router()

/**
 * @swagger
 * /api/logs/test:
 *   get:
 *     summary: Probar logger
 *     description: Ejecuta una prueba de los distintos niveles de log configurados en la aplicacion. Es una herramienta de validacion tecnica, no una funcionalidad de negocio.
 *     tags:
 *       - Logger
 *     responses:
 *       200:
 *         description: Logs de prueba generados correctamente.
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
 *                   example: Logs de prueba generados correctamente
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/test', probarLogger)

export default router