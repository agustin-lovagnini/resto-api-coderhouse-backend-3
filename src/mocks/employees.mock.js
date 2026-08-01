import { faker } from '@faker-js/faker'
import { PUESTOS_EMPLEADO } from '../constants/index.js'

const puestos = Object.values(PUESTOS_EMPLEADO) //* valores del objeto PUESTOS_EMPLEADO para guardo en un array para usar con faker.helpers.arrayElement() y elegir uno al azar.

//! Genero un empleado con mock de datos aleatorios
export const generarEmpleadoMock = () => {
  return {
    nombre: faker.person.firstName(),
    apellido: faker.person.lastName(),
    email: faker.internet.email().toLowerCase(),
    telefono: faker.phone.number(),
    puesto: faker.helpers.arrayElement(puestos),
    activo: true //* todos los empleados mock generados van a estar activos.
  }
}

export const generarEmpleadosMock = (cantidad = 10) => {
  return Array.from({ length: cantidad }, () => generarEmpleadoMock())
}