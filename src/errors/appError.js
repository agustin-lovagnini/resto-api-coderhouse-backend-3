import { ERROR_DICTIONARY } from './errorDictionary.js'

export class AppError extends Error {
    constructor(errorType, customMessage, details = null) {
        const errorDefinition = ERROR_DICTIONARY[errorType]

        //! NO ENCONTRADO: Si NO se encuentra errorType en el diccionario, itilizamos la definición de error interno del servidor
        if (!errorDefinition) {
            const internalError = ERROR_DICTIONARY.INTERNAL_SERVER_ERROR //* si no encuentra el errorType = error interon del cervidor 500.

            super(internalError.message)

            this.name = 'AppError' //* identifica el tipo de error, en vez de 'Error' por defecto
            this.code = internalError.code //* codigo interno del error.
            this.statusCode = internalError.statusCode //* codigo HTTP que vamos a devolver.
            this.details = details //* informacion extra del error.

            return
        }

        //! SI ENCONTRADO: Si se encuentra el errorType en el diccionario, se utiliza la definición correspondiente
        super(customMessage || errorDefinition.message) //* si se pasa un mensaje personalizado (lo encontramos en service), se utiliza ese. Si no, se utiliza el mensaje predeterminado del diccionario de errores (mensaje generico).

        this.name = 'AppError'
        this.code = errorDefinition.code
        this.statusCode = errorDefinition.statusCode
        this.details = details
    }
}