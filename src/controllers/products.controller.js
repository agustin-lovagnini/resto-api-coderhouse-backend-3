import { productsService } from '../services/products.service.js'

export const obtenerProductos = async (req, res) => {
    try {
        const productos = await productsService.obtenerProductos()

        res.status(200).json({
            status: 'success',
            payload: productos
        })
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        })
    }
}

export const obtenerProductosDisponibles = async (req, res) => {
    try {
        const productos = await productsService.obtenerProductosDisponibles()

        res.status(200).json({
            status: 'success',
            payload: productos
        })
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        })
    }
}

export const obtenerProductoPorId = async (req, res) => {
    try {
        const { pid } = req.params

        const producto = await productsService.obtenerProductoPorId(pid)

        res.status(200).json({
            status: 'success',
            payload: producto
        })
    } catch (error) {
        res.status(404).json({
            status: 'error',
            message: error.message
        })
    }
}

export const crearProducto = async (req, res) => {
    try {
        const producto = await productsService.crearProducto(req.body)

        res.status(201).json({
            status: 'success',
            payload: producto
        })
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message
        })
    }
}

export const actualizarProducto = async (req, res) => {
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
        res.status(400).json({
            status: 'error',
            message: error.message
        })
    }
}

export const eliminarProducto = async (req, res) => {
    try {
        const { pid } = req.params

        const producto = await productsService.eliminarProducto(pid)

        res.status(200).json({
            status: 'success',
            payload: producto
        })
    } catch (error) {
        res.status(404).json({
            status: 'error',
            message: error.message
        })
    }
}