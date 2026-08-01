import { faker } from '@faker-js/faker'
import { ROLES_USUARIO } from '../constants/index.js'

//? faker tiene  una base de datos de nombres, correos, etc. que se pueden usar para generar datos aleatorios.
//! Genero un usuario con mock de datos aleatorios. 
export const generarUsuarioMock = () => { 
  return {
    nombre: faker.person.firstName(), 
    apellido: faker.person.lastName(),
    email: faker.internet.email().toLowerCase(),
    rol: ROLES_USUARIO.USUARIO //* esto NO es de Faker, lo traje de index.js, es EL valor fijo que se asigna a todos los usuarios mock generados.
  }
}

export const generarUsuariosMock = (cantidad = 10) => {
  return Array.from({ length: cantidad }, () => generarUsuarioMock())
}