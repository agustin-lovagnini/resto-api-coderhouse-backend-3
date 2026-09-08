import { createValidationError } from '../errors/errorFactory.js'

//! valores por defecto para la paginacion
const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 10
const MAX_LIMIT = 100

//! validamos que el valor de page y limit sean numeros enteros positivos
const parsePositiveInteger = (value, fieldName, defaultValue) => {//? value: valor a validar, fieldName: nombre del parametro, defaultValue: valor por defecto
    if (value === undefined) {
        return defaultValue
    }

    const parsedValue = Number(value) //? parseamos el valor a numero

    //! validamos que el valor sea un numero entero positivo
    if (!Number.isInteger(parsedValue) || parsedValue < 1) {
        throw createValidationError(`El parametro ${fieldName} debe ser un numero entero mayor a 0`)
    }

    return parsedValue
}

//! obtenemos los parametros de paginacion desde la query y validamos que sean numeros enteros positivos
export const getPaginationParams = (query = {}) => {
    const page = parsePositiveInteger(query.page, 'page', DEFAULT_PAGE) //? si no se pasa el parametro page, se toma el valor por defecto
    const limit = parsePositiveInteger(query.limit, 'limit', DEFAULT_LIMIT) //? si no se pasa el parametro limit, se toma el valor por defecto

    if (limit > MAX_LIMIT) {
        throw createValidationError(`El parametro limit no puede ser mayor a ${MAX_LIMIT}`)
    }

    return {
        page,
        limit,
        skip: (page - 1) * limit //? calculamos el valor de skip para la paginacion, skip significa cuántos registros saltear en MongoDB.
    }
}

//! construimos el objeto de metadatos de paginacion
export const buildPaginationMeta = ({ page, limit, totalDocs }) => {
    const totalPages = Math.ceil(totalDocs / limit) //? calculamos el total de paginas, redondeando hacia arriba para que si hay un resto, se cuente como una pagina mas

    return {
        page,
        limit,
        totalDocs,
        totalPages,
        hasPrevPage: page > 1,
        hasNextPage: page < totalPages
    }
}