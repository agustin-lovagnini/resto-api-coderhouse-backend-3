import { ERROR_CODES } from './errorCodes.js'

export const ERROR_DICTIONARY = Object.freeze({
  VALIDATION_ERROR: {
    code: ERROR_CODES.VALIDATION_ERROR,
    statusCode: 400,
    message: 'Los datos enviados no son validos'
  },

  NOT_FOUND_ERROR: {
    code: ERROR_CODES.NOT_FOUND_ERROR,
    statusCode: 404,
    message: 'El recurso solicitado no fue encontrado'
  },

  DUPLICATE_ERROR: {
    code: ERROR_CODES.DUPLICATE_ERROR,
    statusCode: 409,
    message: 'El recurso ya existe'
  },

  INTERNAL_SERVER_ERROR: {
    code: ERROR_CODES.INTERNAL_SERVER_ERROR,
    statusCode: 500,
    message: 'Error interno del servidor'
  }
})