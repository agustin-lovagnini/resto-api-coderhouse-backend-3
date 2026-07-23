import { ESTADOS_PEDIDO, ESTADOS_PRODUCTO } from '../constants/index.js'
import { employeesRepository } from '../repositories/employees.repository.js'
import { ordersRepository } from '../repositories/orders.repository.js'
import { productsRepository } from '../repositories/products.repository.js'

const prepararProductosDelPedido = async (productos = []) => {
  if (!Array.isArray(productos) || productos.length === 0) {
    throw new Error('El pedido debe tener al menos un producto')
  }

  const productosPreparados = []

  for (const item of productos) {
    if (!item.producto) {
      throw new Error('Cada item del pedido debe incluir un producto')
    }

    if (!item.cantidad || item.cantidad < 1) {
      throw new Error('La cantidad de cada producto debe ser mayor a 0')
    }

    const producto = await productsRepository.getById(item.producto)

    if (!producto) {
      throw new Error('Uno de los productos del pedido no existe')
    }

    if (producto.estado !== ESTADOS_PRODUCTO.DISPONIBLE) {
      throw new Error(`El producto ${producto.nombre} no esta disponible`)
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
      throw new Error('Pedido no encontrado')
    }

    return pedido
  },

  crearPedido: async (orderData) => {
    if (!orderData.mesa || orderData.mesa < 1) {
      throw new Error('La mesa del pedido es obligatoria y debe ser valida')
    }

    if (!orderData.empleado) {
      throw new Error('El empleado del pedido es obligatorio')
    }

    const empleado = await employeesRepository.getById(orderData.empleado)

    if (!empleado) {
      throw new Error('El empleado asignado al pedido no existe')
    }

    if (!empleado.activo) {
      throw new Error('El empleado asignado al pedido no esta activo')
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
      throw new Error('El estado del pedido no es valido')
    }

    return ordersRepository.create(nuevoPedido)
  },

  actualizarPedido: async (id, orderData) => {
    if (
      orderData.estado &&
      !Object.values(ESTADOS_PEDIDO).includes(orderData.estado)
    ) {
      throw new Error('El estado del pedido no es valido')
    }

    const datosActualizados = { ...orderData }

    if (orderData.empleado) {
      const empleado = await employeesRepository.getById(orderData.empleado)

      if (!empleado) {
        throw new Error('El empleado asignado al pedido no existe')
      }

      if (!empleado.activo) {
        throw new Error('El empleado asignado al pedido no esta activo')
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
      throw new Error('Pedido no encontrado')
    }

    return pedidoActualizado
  },

  eliminarPedido: async (id) => {
    const pedidoEliminado = await ordersRepository.deleteById(id)

    if (!pedidoEliminado) {
      throw new Error('Pedido no encontrado')
    }

    return pedidoEliminado
  }
}
