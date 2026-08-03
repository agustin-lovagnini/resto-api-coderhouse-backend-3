import { AppError } from './appError.js'
import { ERROR_CODES } from './errorCodes.js'

//! Crea errores de validación.
export const createValidationError = (message, details = null) => {
  return new AppError(ERROR_CODES.VALIDATION_ERROR, message, details)
}

//! Crea errores de cosas inexistentes.
export const createNotFoundError = (message, details = null) => {
  return new AppError(ERROR_CODES.NOT_FOUND_ERROR, message, details)
}

//! Crea errores de duplicados.
export const createDuplicateError = (message, details = null) => {
  return new AppError(ERROR_CODES.DUPLICATE_ERROR, message, details)
}

//! Crea errores de servidor interno.
export const createInternalServerError = (message, details = null) => {
  return new AppError(ERROR_CODES.INTERNAL_SERVER_ERROR, message, details)
}