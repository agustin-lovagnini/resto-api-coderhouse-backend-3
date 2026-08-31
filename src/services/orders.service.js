import {
  ESTADOS_PEDIDO,
  ESTADOS_PRODUCTO,
  TIPOS_COMPROBANTE_PEDIDO
} from '../constants/index.js'
import {
  createNotFoundError,
  createValidationError
} from '../errors/errorFactory.js'
import { logger } from '../config/logger.config.js'
import { employeesRepository } from '../repositories/employees.repository.js'
import { ordersRepository } from '../repositories/orders.repository.js'
import { productsRepository } from '../repositories/products.repository.js'

const prepararProductosDelPedido = async (productos = []) => {
  if (!Array.isArray(productos) || productos.length === 0) {
    throw createValidationError('El pedido debe tener al menos un producto')
  }

  const productosPreparados = []

  for (const item of productos) {
    if (!item.producto) {
      throw createValidationError('Cada item del pedido debe incluir un producto')
    }

    if (!item.cantidad || item.cantidad < 1) {
      throw createValidationError('La cantidad de cada producto debe ser mayor a 0')
    }

    const producto = await productsRepository.getById(item.producto)

    if (!producto) {
      throw createNotFoundError('Uno de los productos del pedido no existe')
    }

    if (producto.estado !== ESTADOS_PRODUCTO.DISPONIBLE) {
      throw createValidationError(`El producto ${producto.nombre} no esta disponible`)
    }

    const subtotal = producto.precio * item.cantidad

    productosPreparados.push({
      producto: item.producto,
      cantidad: item.cantidad,
      precioUnitario: producto.precio,
      subtotal
    })
  }

  return productosPreparados
}

const calcularTotal = (productos) => {
  return productos.reduce((total, item) => total + item.subtotal, 0)
}

const crearMetadataArchivo = (file, tipoDocumento) => {
  return {
    nombreOriginal: file.originalname,
    nombreArchivo: file.filename,
    ruta: file.path,
    mimetype: file.mimetype,
    size: file.size,
    tipoDocumento,
    fechaCarga: new Date()
  }
}

export const ordersService = {
  obtenerPedidos: async () => {
    return ordersRepository.getAll()
  },

  obtenerPedidosPendientes: async () => {
    return ordersRepository.getAll({
      estado: ESTADOS_PEDIDO.PENDIENTE
    })
  },

  obtenerPedidoPorId: async (id) => {
    const pedido = await ordersRepository.getById(id)

    if (!pedido) {
      logger.warning('Pedido no encontrado', {
        pedidoId: id
      })

      throw createNotFoundError('Pedido no encontrado')
    }

    return pedido
  },

  crearPedido: async (orderData) => {
    if (!orderData.mesa || orderData.mesa < 1) {
      throw createValidationError('La mesa del pedido es obligatoria y debe ser valida')
    }

    if (!orderData.empleado) {
      throw createValidationError('El empleado del pedido es obligatorio')
    }

    const empleado = await employeesRepository.getById(orderData.empleado)

    if (!empleado) {
      throw createNotFoundError('El empleado asignado al pedido no existe')
    }

    if (!empleado.activo) {
      throw createValidationError('El empleado asignado al pedido no esta activo')
    }

    const productos = await prepararProductosDelPedido(orderData.productos)
    const total = calcularTotal(productos)

    const nuevoPedido = {
      mesa: orderData.mesa,
      empleado: orderData.empleado,
      productos,
      total,
      estado: orderData.estado || ESTADOS_PEDIDO.PENDIENTE,
      observaciones: orderData.observaciones || ''
    }

    if (!Object.values(ESTADOS_PEDIDO).includes(nuevoPedido.estado)) {
      throw createValidationError('El estado del pedido no es valido')
    }

    const pedidoCreado = await ordersRepository.create(nuevoPedido)

    logger.info('Pedido creado correctamente', {
      pedidoId: pedidoCreado._id,
      mesa: pedidoCreado.mesa,
      total: pedidoCreado.total,
      estado: pedidoCreado.estado
    })

    return pedidoCreado
  },

  actualizarPedido: async (id, orderData) => {
    if (
      orderData.estado &&
      !Object.values(ESTADOS_PEDIDO).includes(orderData.estado)
    ) {
      throw createValidationError('El estado del pedido no es valido')
    }

    const datosActualizados = { ...orderData }

    if (orderData.empleado) {
      const empleado = await employeesRepository.getById(orderData.empleado)

      if (!empleado) {
        throw createNotFoundError('El empleado asignado al pedido no existe')
      }

      if (!empleado.activo) {
        throw createValidationError('El empleado asignado al pedido no esta activo')
      }
    }

    if (orderData.productos) {
      datosActualizados.productos = await prepararProductosDelPedido(
        orderData.productos
      )
      datosActualizados.total = calcularTotal(datosActualizados.productos)
    }

    const pedidoActualizado = await ordersRepository.updateById(
      id,
      datosActualizados
    )

    if (!pedidoActualizado) {
      logger.warning('Pedido no encontrado al actualizar', {
        pedidoId: id
      })

      throw createNotFoundError('Pedido no encontrado')
    }

    logger.info('Pedido actualizado correctamente', {
      pedidoId: id,
      estado: pedidoActualizado.estado,
      total: pedidoActualizado.total
    })

    return pedidoActualizado
  },

  subirComprobantePedido: async (id, file, tipoDocumento) => {
    if (!file) {
      throw createValidationError('El archivo es obligatorio')
    }

    if (!tipoDocumento) {
      throw createValidationError('El tipo de comprobante es obligatorio')
    }

    if (!Object.values(TIPOS_COMPROBANTE_PEDIDO).includes(tipoDocumento)) {
      logger.warning('Tipo de comprobante de pedido no permitido', {
        pedidoId: id,
        tipoDocumento
      })

      throw createValidationError('El tipo de comprobante no es valido')
    }

    const pedido = await ordersRepository.getById(id)

    if (!pedido) {
      throw createNotFoundError('Pedido no encontrado')
    }

    const comprobante = crearMetadataArchivo(file, tipoDocumento)

    const pedidoActualizado = await ordersRepository.addReceiptById(
      id,
      comprobante
    )

    logger.info('Comprobante asociado al pedido correctamente', {
      pedidoId: id,
      tipoDocumento,
      archivo: comprobante.nombreArchivo
    })

    return pedidoActualizado
  },

  eliminarPedido: async (id) => {
    const pedidoEliminado = await ordersRepository.deleteById(id)

    if (!pedidoEliminado) {
      logger.warning('Pedido no encontrado al eliminar', {
        pedidoId: id
      })

      throw createNotFoundError('Pedido no encontrado')
    }

    logger.info('Pedido eliminado correctamente', {
      pedidoId: id
    })

    return pedidoEliminado
  }
}