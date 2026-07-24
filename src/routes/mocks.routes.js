import { Router } from 'express'
import {
    responderEmpleadosMock,
    responderPedidosMock,
    responderPopulateMocks,
    responderUsuariosMock
} from '../controllers/mocks.controller.js'

const router = Router()

router.get('/users', responderUsuariosMock)
router.get('/employees', responderEmpleadosMock)
router.get('/orders', responderPedidosMock)
router.post('/populate', responderPopulateMocks)

export default router
