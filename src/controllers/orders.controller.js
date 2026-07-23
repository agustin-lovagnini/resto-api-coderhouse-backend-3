import { ordersService } from '../services/orders.service.js'

export const obtenerPedidos = async (req, res) => {
  try {
    const pedidos = await ordersService.obtenerPedidos()

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

export const obtenerPedidosPendientes = async (req, res) => {
  try {
    const pedidos = await ordersService.obtenerPedidosPendientes()

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

export const obtenerPedidoPorId = async (req, res) => {
  try {
    const { oid } = req.params

    const pedido = await ordersService.obtenerPedidoPorId(oid)

    res.status(200).json({
      status: 'success',
      payload: pedido
    })
  } catch (error) {
    res.status(404).json({
      status: 'error',
      message: error.message
    })
  }
}

export const crearPedido = async (req, res) => {
  try {
    const pedido = await ordersService.crearPedido(req.body)

    res.status(201).json({
      status: 'success',
      payload: pedido
    })
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    })
  }
}

export const actualizarPedido = async (req, res) => {
  try {
    const { oid } = req.params

    const pedido = await ordersService.actualizarPedido(oid, req.body)

    res.status(200).json({
      status: 'success',
      payload: pedido
    })
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    })
  }
}

export const eliminarPedido = async (req, res) => {
  try {
    const { oid } = req.params

    const pedido = await ordersService.eliminarPedido(oid)

    res.status(200).json({
      status: 'success',
      payload: pedido
    })
  } catch (error) {
    res.status(404).json({
      status: 'error',
      message: error.message
    })
  }
}
