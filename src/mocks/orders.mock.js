import mongoose from 'mongoose'
import { faker } from '@faker-js/faker'
import { ESTADOS_PEDIDO } from '../constants/index.js'

//! Obtengo un NUMERO ENTERO aleatorio entre un mínimo y un máximo dado
const obtenerCantidadAleatoria = (minimo, maximo) => {
  return faker.number.int({ min: minimo, max: maximo })
}

//! Obtengo PRODUCTOS aleatorios de un array de productos dado y una cantidad específica
const obtenerProductosAleatorios = (productos = [], cantidad) => {
  return faker.helpers.arrayElements(productos, cantidad) //* helpers --> de faker para obtener elementos aleatorios de un array dado.
}

//! Genero UN SOLO PEDIDO con mock de datos aleatorios usando empleados/productos reales.
export const generarPedidoMock = (empleados = [], productos = []) => {
  const empleado = faker.helpers.arrayElement(empleados) //* agarro un empleado aleatorio
  const cantidadProductos = obtenerCantidadAleatoria(
    1,
    Math.min(3, productos.length)
  )
  const productosSeleccionados = obtenerProductosAleatorios(
    productos,
    cantidadProductos
  )

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
    mesa: obtenerCantidadAleatoria(1, 20), //* mesas del restaurante
    empleado: empleado._id,
    productos: productosPedido,
    estado: ESTADOS_PEDIDO.PENDIENTE,
    total,
    observaciones: faker.helpers.maybe(
      () => faker.lorem.sentence({ min: 3, max: 8 }),
      { probability: 0.7 }
    ) || ''
  }
}

//! Genero un ARRAY de PEDIDOS con mock de datos aleatorios, si hay,usa datos reales, si no hay agarra datos falsos
export const generarPedidosMock = (cantidad = 10, empleados = [], productos = []) => {
  if (empleados.length === 0 || productos.length === 0) {
    return Array.from({ length: cantidad }, () => { //* genere un array con cuan cantidad de pedidos
      const productoId = new mongoose.Types.ObjectId() //* genero un id de producto falso con formato de mongoose.Types.ObjectId() para usarlo en el pedido mock
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
        observaciones: faker.helpers.maybe(
          () => faker.lorem.sentence({ min: 3, max: 8 }),
          { probability: 0.7 }
        ) || ''
      }
    })
  }

  return Array.from({ length: cantidad }, () =>
    generarPedidoMock(empleados, productos)
  )
}