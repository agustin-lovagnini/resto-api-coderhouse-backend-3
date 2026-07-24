import { ROLES_USUARIO } from '../constants/index.js'

const nombres = [
    'Agustin',
    'Laura',
    'Martin',
    'Sofia',
    'Camila',
    'Nicolas',
    'Valentina',
    'Diego'
]

const apellidos = [
    'Lovagnini',
    'Gomez',
    'Perez',
    'Rodriguez',
    'Fernandez',
    'Lopez',
    'Martinez',
    'Garcia'
]

const obtenerElementoAleatorio = (items) => {
    const indice = Math.floor(Math.random() * items.length) 

    return items[indice] 
}

export const generarUsuarioMock = (indice = 1) => {
    const nombre = obtenerElementoAleatorio(nombres)
    const apellido = obtenerElementoAleatorio(apellidos)

    return {
        nombre,
        apellido,
        email: `usuario.mock.${Date.now()}.${indice}@example.com`,
        rol: ROLES_USUARIO.USUARIO
    }
}

export const generarUsuariosMock = (cantidad = 10) => { // cantidad predeterminada de 10 usuarios o los que queramos
    return Array.from({ length: cantidad }, (_, index) => //  genero un usuario mock por cada índice 
        generarUsuarioMock(index + 1) // genera un usuario mock con un índice único para cada usuario
    )
}