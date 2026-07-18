import { Router } from 'express'
import {
    actualizarProducto,
    crearProducto,
    eliminarProducto,
    obtenerProductoPorId,
    obtenerProductos,
    obtenerProductosDisponibles
} from '../controllers/products.controller.js'

const router = Router()

router.get('/', obtenerProductos)
router.get('/available', obtenerProductosDisponibles)
router.get('/disponibles', obtenerProductosDisponibles)
router.get('/:pid', obtenerProductoPorId)
router.post('/', crearProducto)
router.put('/:pid', actualizarProducto)
router.delete('/:pid', eliminarProducto)

export default router