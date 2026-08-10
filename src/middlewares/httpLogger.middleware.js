import { logger } from '../config/logger.config.js'
//! esto se ejecuta al final de cada request, para loguear la solicitud y la respuesta que el cliente nos pidio
//! Middleware para registrar las solicitudes HTTP entrantes y sus respuestas
export const httpLogger = (req, res, next) => {
    res.on('finish', () => {
        logger.http(`${req.method} ${req.originalUrl} ${res.statusCode}`, {
            method: req.method,
            url: req.originalUrl,
            statusCode: res.statusCode
        })
    })

    next()
}