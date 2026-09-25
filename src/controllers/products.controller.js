import { productsService } from '../services/products.service.js'

export const obtenerProductos = async (req, res, next) => {
    try {
        const { payload, pagination } =
            await productsService.obtenerProductos(req.query)

        res.status(200).json({
            status: 'success',
            payload,
            pagination
        })
    } catch (error) {
        next(error)
    }
}

export const obtenerProductosDisponibles = async (req, res, next) => {
    try {
        const { payload, pagination } =
            await productsService.obtenerProductosDisponibles(req.query)

        res.status(200).json({
            status: 'success',
            payload,
            pagination
        })
    } catch (error) {
        next(error)
    }
}

export const obtenerProductoPorId = async (req, res, next) => {
    try {
        const { pid } = req.params

        const producto = await productsService.obtenerProductoPorId(pid)

        res.status(200).json({
            status: 'success',
            payload: producto
        })
    } catch (error) {
        next(error)
    }
}

export const crearProducto = async (req, res, next) => {
    try {
        const producto = await productsService.crearProducto(req.body)

        res.status(201).json({
            status: 'success',
            payload: producto
        })
    } catch (error) {
        next(error)
    }
}

export const actualizarProducto = async (req, res, next) => {
    try {
        const { pid } = req.params

        const producto = await productsService.actualizarProducto(
            pid,
            req.body
        )

        res.status(200).json({
            status: 'success',
            payload: producto
        })
    } catch (error) {
        next(error)
    }
}

export const eliminarProducto = async (req, res, next) => {
    try {
        const { pid } = req.params

        const producto = await productsService.eliminarProducto(pid)

        res.status(200).json({
            status: 'success',
            payload: producto
        })
    } catch (error) {
        next(error)
    }
}
