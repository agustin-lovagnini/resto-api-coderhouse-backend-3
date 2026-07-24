import { PUESTOS_EMPLEADO } from '../constants/index.js'

const nombres = [
  'Laura',
  'Martin',
  'Sofia',
  'Camila',
  'Nicolas',
  'Valentina',
  'Diego',
  'Carolina'
]

const apellidos = [
  'Gomez',
  'Perez',
  'Rodriguez',
  'Fernandez',
  'Lopez',
  'Martinez',
  'Garcia',
  'Sosa'
]

const puestos = Object.values(PUESTOS_EMPLEADO)

const obtenerElementoAleatorio = (items) => {
  const indice = Math.floor(Math.random() * items.length)

  return items[indice]
}

export const generarEmpleadoMock = (indice = 1) => {
  const nombre = obtenerElementoAleatorio(nombres)
  const apellido = obtenerElementoAleatorio(apellidos)

  return {
    nombre,
    apellido,
    email: `empleado.mock.${Date.now()}.${indice}@example.com`,
    telefono: `11${Math.floor(10000000 + Math.random() * 90000000)}`,
    puesto: obtenerElementoAleatorio(puestos),
    activo: true
  }
}

export const generarEmpleadosMock = (cantidad = 10) => {
  return Array.from({ length: cantidad }, (_, index) =>
    generarEmpleadoMock(index + 1)
  )
}
