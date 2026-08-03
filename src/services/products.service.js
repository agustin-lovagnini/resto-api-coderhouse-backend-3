import { CATEGORIAS_PRODUCTO, ESTADOS_PRODUCTO } from '../constants/index.js'
import {
    createDuplicateError,
    createNotFoundError,
    createValidationError
} from '../errors/errorFactory.js'
import { productsRepository } from '../repositories/products.repository.js'

const calcularEstadoProducto = (stock) => {
    return stock > 0
        ? ESTADOS_PRODUCTO.DISPONIBLE
        : ESTADOS_PRODUCTO.SIN_STOCK
}

export const productsService = {
    obtenerProductos: async () => {
        return productsRepository.getAll()
    },

    obtenerProductosDisponibles: async () => {
        return productsRepository.getAll({
            stock: { $gt: 0 },
            estado: ESTADOS_PRODUCTO.DISPONIBLE
        })
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
            throw createValidationError('El estado del producto no es valido')
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
            throw createValidationError('El estado del producto no es valido')
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
