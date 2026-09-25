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

//! Crea errores de archivo requerido.
export const createFileRequiredError = (message, details = null) => {
  return new AppError(ERROR_CODES.FILE_REQUIRED, message, details)
}

//! Crea errores de tipo de archivo inválido.
export const createInvalidFileTypeError = (message, details = null) => {
  return new AppError(ERROR_CODES.INVALID_FILE_TYPE, message, details)
}

//! Crea errores de archivo demasiado grande.
export const createFileTooLargeError = (message, details = null) => {
  return new AppError(ERROR_CODES.FILE_TOO_LARGE, message, details)
}

//! Crea errores de cantidad de mocks inválida.
export const createInvalidMockQuantityError = (message, details = null) => {
  return new AppError(ERROR_CODES.INVALID_MOCK_QUANTITY, message, details)
}

//! Crea errores de estado inválido.
export const createInvalidStateError = (message, details = null) => {
  return new AppError(ERROR_CODES.INVALID_STATE, message, details)
}