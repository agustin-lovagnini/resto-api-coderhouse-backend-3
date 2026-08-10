import { createNotFoundError } from '../../errors/errorFactory.js'
import { logger } from '../../config/logger.config.js'

//! Middleware para manejar rutas no encontradas (404).
export const notFoundHandler = (req, res, next) => {
  //? marco una advertencia de ruta inexistente con información adicional
  logger.warning(`Ruta inexistente: ${req.originalUrl}`, {
    method: req.method,
    url: req.originalUrl
  })

  next(createNotFoundError(`La ruta ${req.originalUrl} no existe`))
}
