import { config } from '../config/env.config.js'

export const obtenerHealthCheck = (req, res) => {
    res.status(200).json({
        status: 'success',
        api: 'Resto API',
        environment: config.nodeEnv,
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    })
}