import multer from 'multer'
import { createValidationError } from '../errors/errorFactory.js'
import { logger } from '../config/logger.config.js'

export const uploadErrorHandler = (error, req, res, next) => {
  if (!(error instanceof multer.MulterError)) {
    return next(error)
  }

  logger.warning('Error al subir archivo', {
    code: error.code,
    field: error.field,
    url: req.originalUrl
  })

  if (error.code === 'LIMIT_FILE_SIZE') {
    return next(createValidationError('El archivo supera el tamaño maximo permitido'))
  }

  if (error.code === 'LIMIT_FILE_COUNT') {
    return next(createValidationError('Solo se permite subir un archivo'))
  }

  if (error.code === 'LIMIT_UNEXPECTED_FILE') {
    return next(createValidationError('El campo del archivo no coincide o el tipo de archivo no esta permitido'))
  }

  return next(createValidationError('Error al cargar el archivo'))
}