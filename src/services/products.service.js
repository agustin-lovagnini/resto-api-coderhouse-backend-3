import { CATEGORIAS_PRODUCTO, ESTADOS_PRODUCTO } from '../constants/index.js'
import {
    createDuplicateError,
    createInvalidStateError,
    createNotFoundError,
    createValidationError
} from '../errors/errorFactory.js'
import { productsRepository } from '../repositories/products.repository.js'
import {
    buildPaginationMeta,
    getPaginationParams
} from '../utils/pagination.js'

const calcularEstadoProducto = (stock) => {
    return stock > 0
        ? ESTADOS_PRODUCTO.DISPONIBLE
        : ESTADOS_PRODUCTO.SIN_STOCK
}

//! Función para obtener productos paginados según filtros y parámetros de consulta
const obtenerProductosPaginados = async (filter, query) => {
    const { page, limit, skip } = getPaginationParams(query) //? Obtenemos los parámetros de paginación de la consulta

    //! Obtenemos los productos y el total de documentos de manera concurrente para optimizar el rendimiento
    const [productos, totalDocs] = await Promise.all([
        productsRepository.getAll(filter, { limit, skip }), //? Obtenemos los productos según el filtro y los parámetros de paginación
        productsRepository.countAll(filter) //? Contamos cuántos productos existen en total
    ])

    return {
        payload: productos,
        pagination: buildPaginationMeta({
            page,
            limit,
            totalDocs
        })
    }
}

//! Servicio de productos que expone métodos para interactuar con los productos en la base de datos
export const productsService = {
    obtenerProductos: async (query = {}) => {
        return obtenerProductosPaginados({}, query)
    },

    obtenerProductosDisponibles: async (query = {}) => {
        return obtenerProductosPaginados(
            {
                stock: { $gt: 0 },
                estado: ESTADOS_PRODUCTO.DISPONIBLE
            },
            query
        )
    },

    obtenerProductoPorId: async (id) => {
        const producto = await productsRepository.getById(id)

        if (!producto) {
            throw createNotFoundError('Producto no encontrado')
        }

        return producto
    },

    crearProducto: async (productData) => {
        if (!productData.nombre) {
            throw createValidationError('El nombre del producto es obligatorio')
        }

        if (productData.precio === undefined || productData.precio < 0) {
            throw createValidationError('El precio del producto debe ser mayor o igual a 0')
        }

        if (productData.stock === undefined || productData.stock < 0) {
            throw createValidationError('El stock del producto debe ser mayor o igual a 0')
        }

        if (
            !productData.categoria ||
            !Object.values(CATEGORIAS_PRODUCTO).includes(productData.categoria)
        ) {
            throw createValidationError('La categoria del producto no es valida')
        }

        if (
            productData.estado &&
            !Object.values(ESTADOS_PRODUCTO).includes(productData.estado)
        ) {
            throw createInvalidStateError('El estado del producto no es valido')
        }

        const productoExistente = await productsRepository.getByNombre(
            productData.nombre
        )

        if (productoExistente) {
            throw createDuplicateError('Ya existe un producto con ese nombre')
        }

        const estado =
            productData.estado === ESTADOS_PRODUCTO.DISCONTINUADO
                ? ESTADOS_PRODUCTO.DISCONTINUADO
                : calcularEstadoProducto(productData.stock)

        const nuevoProducto = {
            ...productData,
            estado
        }

        return productsRepository.create(nuevoProducto)
    },

    actualizarProducto: async (id, productData) => {
        if (productData.precio !== undefined && productData.precio < 0) {
            throw createValidationError('El precio del producto debe ser mayor o igual a 0')
        }

        if (productData.stock !== undefined && productData.stock < 0) {
            throw createValidationError('El stock del producto debe ser mayor o igual a 0')
        }

        if (
            productData.estado &&
            !Object.values(ESTADOS_PRODUCTO).includes(productData.estado)
        ) {
            throw createInvalidStateError('El estado del producto no es valido')
        }

        if (
            productData.categoria &&
            !Object.values(CATEGORIAS_PRODUCTO).includes(productData.categoria)
        ) {
            throw createValidationError('La categoria del producto no es valida')
        }

        if (productData.nombre) {
            const productoExistente = await productsRepository.getByNombre(
                productData.nombre
            )

            if (productoExistente && productoExistente._id.toString() !== id) {
                throw createDuplicateError('Ya existe un producto con ese nombre')
            }
        }

        if (
            productData.stock !== undefined &&
            productData.estado !== ESTADOS_PRODUCTO.DISCONTINUADO
        ) {
            productData.estado = calcularEstadoProducto(productData.stock)
        }

        const productoActualizado = await productsRepository.updateById(
            id,
            productData
        )

        if (!productoActualizado) {
            throw createNotFoundError('Producto no encontrado')
        }

        return productoActualizado
    },

    eliminarProducto: async (id) => {
        const productoEliminado = await productsRepository.deleteById(id)

        if (!productoEliminado) {
            throw createNotFoundError('Producto no encontrado')
        }

        return productoEliminado
    }
}
