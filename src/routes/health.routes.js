import { Router } from 'express'
import { obtenerHealthCheck } from '../controllers/health.controller.js'

const router = Router()

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Health check de la API
 *     description: Devuelve informacion basica del estado de la API sin exponer datos sensibles.
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: API disponible.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 api:
 *                   type: string
 *                   example: Resto API
 *                 environment:
 *                   type: string
 *                   example: development
 *                 uptime:
 *                   type: number
 *                   example: 120.5
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */
router.get('/', obtenerHealthCheck)

export default router