import { ordersService } from '../services/orders.service.js'

export const obtenerPedidos = async (req, res, next) => {
  try {
    const resultado = await ordersService.obtenerPedidos(req.query)

    res.status(200).json({
      status: 'success',
      payload: resultado.payload,
      pagination: resultado.pagination
    })
  } catch (error) {
    next(error)
  }
}

export const obtenerPedidosPendientes = async (req, res, next) => {
  try {
    const resultado = await ordersService.obtenerPedidosPendientes(req.query)

    res.status(200).json({
      status: 'success',
      payload: resultado.payload,
      pagination: resultado.pagination
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

export const subirComprobantePedido = async (req, res, next) => {
  try {
    const { oid } = req.params
    const { tipoDocumento } = req.body

    const pedido = await ordersService.subirComprobantePedido(
      oid,
      req.file,
      tipoDocumento
    )

    res.status(200).json({
      status: 'success',
      message: 'Comprobante cargado correctamente',
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
