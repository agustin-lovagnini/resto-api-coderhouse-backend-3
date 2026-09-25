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

  FILE_REQUIRED: {
    code: ERROR_CODES.FILE_REQUIRED,
    statusCode: 400,
    message: 'El archivo es obligatorio'
  },

  INVALID_FILE_TYPE: {
    code: ERROR_CODES.INVALID_FILE_TYPE,
    statusCode: 400,
    message: 'El tipo de archivo no esta permitido'
  },

  FILE_TOO_LARGE: {
    code: ERROR_CODES.FILE_TOO_LARGE,
    statusCode: 400,
    message: 'El archivo supera el tamaño maximo permitido'
  },

  INVALID_MOCK_QUANTITY: {
    code: ERROR_CODES.INVALID_MOCK_QUANTITY,
    statusCode: 400,
    message: 'La cantidad de mocks no es valida'
  },

  INVALID_STATE: {
    code: ERROR_CODES.INVALID_STATE,
    statusCode: 400,
    message: 'El estado indicado no es valido'
  },

  INTERNAL_SERVER_ERROR: {
    code: ERROR_CODES.INTERNAL_SERVER_ERROR,
    statusCode: 500,
    message: 'Error interno del servidor'
  }
})