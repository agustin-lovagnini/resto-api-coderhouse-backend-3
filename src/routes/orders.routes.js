import { Router } from 'express'
import {
  actualizarPedido,
  crearPedido,
  eliminarPedido,
  obtenerPedidoPorId,
  obtenerPedidos,
  obtenerPedidosPendientes
} from '../controllers/orders.controller.js'

const router = Router()

router.get('/', obtenerPedidos)
router.get('/pendientes', obtenerPedidosPendientes)
router.get('/:oid', obtenerPedidoPorId)
router.post('/', crearPedido)
router.put('/:oid', actualizarPedido)
router.delete('/:oid', eliminarPedido)

export default router
