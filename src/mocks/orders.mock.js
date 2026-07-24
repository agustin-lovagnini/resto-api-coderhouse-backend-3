import mongoose from 'mongoose'
import { ESTADOS_PEDIDO } from '../constants/index.js'

const observaciones = [
  '',
  'Sin sal',
  'Mesa cerca de la ventana',
  'Cliente espera en barra',
  'Preparar rapido'
]

const obtenerElementoAleatorio = (items) => {
  const indice = Math.floor(Math.random() * items.length)

  return items[indice]
}

const obtenerCantidadAleatoria = (minimo, maximo) => {
  return Math.floor(Math.random() * (maximo - minimo + 1)) + minimo
}

export const generarPedidoMock = (empleados = [], productos = []) => {
  const empleado = obtenerElementoAleatorio(empleados)
  const cantidadProductos = obtenerCantidadAleatoria(1, Math.min(3, productos.length))
  const productosSeleccionados = productos
    .sort(() => Math.random() - 0.5)
    .slice(0, cantidadProductos)

  const productosPedido = productosSeleccionados.map((producto) => {
    const cantidad = obtenerCantidadAleatoria(1, 3)
    const precioUnitario = producto.precio

    return {
      producto: producto._id,
      cantidad,
      precioUnitario,
      subtotal: precioUnitario * cantidad
    }
  })

  const total = productosPedido.reduce((acumulador, item) => {
    return acumulador + item.subtotal
  }, 0)

  return {
    mesa: obtenerCantidadAleatoria(1, 20),
    empleado: empleado._id,
    productos: productosPedido,
    estado: ESTADOS_PEDIDO.PENDIENTE,
    total,
    observaciones: obtenerElementoAleatorio(observaciones)
  }
}

export const generarPedidosMock = (cantidad = 10, empleados = [], productos = []) => {
  if (empleados.length === 0 || productos.length === 0) {
    return Array.from({ length: cantidad }, () => {
      const productoId = new mongoose.Types.ObjectId()
      const cantidadProducto = obtenerCantidadAleatoria(1, 3)
      const precioUnitario = obtenerCantidadAleatoria(3000, 15000)

      return {
        mesa: obtenerCantidadAleatoria(1, 20),
        empleado: new mongoose.Types.ObjectId(),
        productos: [
          {
            producto: productoId,
            cantidad: cantidadProducto,
            precioUnitario,
            subtotal: precioUnitario * cantidadProducto
          }
        ],
        estado: ESTADOS_PEDIDO.PENDIENTE,
        total: precioUnitario * cantidadProducto,
        observaciones: obtenerElementoAleatorio(observaciones)
      }
    })
  }

  return Array.from({ length: cantidad }, () =>
    generarPedidoMock(empleados, productos)
  )
}
