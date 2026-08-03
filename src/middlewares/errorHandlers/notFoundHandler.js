import { createNotFoundError } from '../../errors/errorFactory.js'

//! Middleware para manejar rutas no encontradas (404).
export const notFoundHandler = (req, res, next) => {
  next(createNotFoundError(`La ruta ${req.originalUrl} no existe`))
}
