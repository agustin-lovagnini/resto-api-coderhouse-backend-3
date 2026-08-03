import { ordersService } from '../services/orders.service.js'

export const obtenerPedidos = async (req, res, next) => {
  try {
    const pedidos = await ordersService.obtenerPedidos()

    res.status(200).json({
      status: 'success',
      payload: pedidos
    })
  } catch (error) {
    next(error)
  }
}

export const obtenerPedidosPendientes = async (req, res, next) => {
  try {
    const pedidos = await ordersService.obtenerPedidosPendientes()

    res.status(200).json({
      status: 'success',
      payload: pedidos
    })
  } catch (error) {
    next(error)
  }
}

export const obtenerPedidoPorId = async (req, res, next) => {
  try {
    const { oid } = req.params

    const pedido = await ordersService.obtenerPedidoPorId(oid)

    res.status(200).json({
      status: 'success',
      payload: pedido
    })
  } catch (error) {
    next(error)
  }
}

export const crearPedido = async (req, res, next) => {
  try {
    const pedido = await ordersService.crearPedido(req.body)

    res.status(201).json({
      status: 'success',
      payload: pedido
    })
  } catch (error) {
    next(error)
  }
}

export const actualizarPedido = async (req, res, next) => {
  try {
    const { oid } = req.params

    const pedido = await ordersService.actualizarPedido(oid, req.body)

    res.status(200).json({
      status: 'success',
      payload: pedido
    })
  } catch (error) {
    next(error)
  }
}

export const eliminarPedido = async (req, res, next) => {
  try {
    const { oid } = req.params

    const pedido = await ordersService.eliminarPedido(oid)

    res.status(200).json({
      status: 'success',
      payload: pedido
    })
  } catch (error) {
    next(error)
  }
}
