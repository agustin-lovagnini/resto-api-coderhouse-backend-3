import { mocksService } from '../services/mocks.service.js'

export const responderUsuariosMock = async (req, res) => {
    try {
        const { cantidad } = req.query

        const usuarios = await mocksService.obtenerUsuariosMock(cantidad)

        res.status(200).json({
            status: 'success',
            payload: usuarios
        })
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        })
    }
}

export const responderEmpleadosMock = async (req, res) => {
    try {
        const { cantidad } = req.query

        const empleados = await mocksService.obtenerEmpleadosMock(cantidad)

        res.status(200).json({
            status: 'success',
            payload: empleados
        })
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        })
    }
}

export const responderPedidosMock = async (req, res) => {
    try {
        const { cantidad } = req.query

        const pedidos = await mocksService.obtenerPedidosMock(cantidad)

        res.status(200).json({
            status: 'success',
            payload: pedidos
        })
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        })
    }
}

export const responderPopulateMocks = async (req, res) => {
    try {
        const { users, employees, orders } = req.body

        const resultado = await mocksService.popularMocks({
            users,
            employees,
            orders
        })

        res.status(201).json({
            status: 'success',
            payload: resultado
        })
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message
        })
    }
}
