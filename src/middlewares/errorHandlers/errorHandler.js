import { AppError } from '../../errors/appError.js'
import { ERROR_DICTIONARY } from '../../errors/errorDictionary.js'
import { logger } from '../../config/logger.config.js'

export const errorHandler = (error, req, res, next) => {
    //! recordatorio: es como instanceof? 'Este error (error) fue creado por nuestra app (AppError)?'. 
    //? ERROR CONTROLADO: Si el error es una instancia de AppError, significa que es un error controlado. En este caso, devolvemos la respuesta con el código de estado y el mensaje correspondiente.
    if (error instanceof AppError) {

        //! errores controlados y ponemos metadata
        logger.warning(error.message, { 
            code: error.code,
            statusCode: error.statusCode,
            method: req.method,
            url: req.originalUrl,
            details: error.details
        })

        const response = {
            status: 'error', //* Lo escribimos fijo nosotros. Valor fijo para indicar que la respuesta es un error.
            code: error.code, //* Viene de this.code que pusimos en AppError. Ese this.code se carga usando el diccionario de errores.
            message: error.message //* Sale de super(...), porque AppError hereda de Error. El mensaje puede ser el especifico del service o el generico del diccionario.
        }

        if (error.details) {
            response.details = error.details
        }

        return res.status(error.statusCode).json(response)
    }

    //? ERROR NO CONTROLADO: Si el error NO es una instancia de AppError, es un error no controlado. En este caso, devolvemos un error interno del servidor (500) y registramos el error en la consola.
    const internalError = ERROR_DICTIONARY.INTERNAL_SERVER_ERROR

    //! errores inesperados y ponemos metadata
    logger.error(error.message, {
        code: internalError.code,
        statusCode: internalError.statusCode,
        method: req.method,
        url: req.originalUrl,
        stack: error.stack //* esto no se muesta al cliente
    })

    //! Respuesta de error inesperado ---> interno del servidor (500) con el mensaje genérico del diccionario de errores
    return res.status(internalError.statusCode).json({
        status: 'error',
        code: internalError.code,
        message: internalError.message
    })
}

