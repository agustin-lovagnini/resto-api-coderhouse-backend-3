import { ESTADOS_PRODUCTO } from '../constants/index.js'
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
            throw new Error('Producto no encontrado')
        }

        return producto
    },

    crearProducto: async (productData) => {
        if (!productData.nombre) {
            throw new Error('El nombre del producto es obligatorio')
        }

        if (productData.precio === undefined || productData.precio < 0) {
            throw new Error('El precio del producto debe ser mayor o igual a 0')
        }

        if (productData.stock === undefined || productData.stock < 0) {
            throw new Error('El stock del producto debe ser mayor o igual a 0')
        }

        const productoExistente = await productsRepository.getByNombre(
            productData.nombre
        )

        if (productoExistente) {
            throw new Error('Ya existe un producto con ese nombre')
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
            throw new Error('El precio del producto debe ser mayor o igual a 0')
        }

        if (productData.stock !== undefined && productData.stock < 0) {
            throw new Error('El stock del producto debe ser mayor o igual a 0')
        }

        if (
            productData.estado &&
            !Object.values(ESTADOS_PRODUCTO).includes(productData.estado)
        ) {
            throw new Error('El estado del producto no es válido')
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
            throw new Error('Producto no encontrado')
        }

        return productoActualizado
    },

    eliminarProducto: async (id) => {
        const productoEliminado = await productsRepository.deleteById(id)

        if (!productoEliminado) {
            throw new Error('Producto no encontrado')
        }

        return productoEliminado
    }
}