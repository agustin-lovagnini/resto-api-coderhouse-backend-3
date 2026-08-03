import { generarEmpleadosMock } from '../mocks/employees.mock.js'
import { generarPedidosMock } from '../mocks/orders.mock.js'
import { generarUsuariosMock } from '../mocks/users.mock.js'
import {
    createInternalServerError,
    createValidationError
} from '../errors/errorFactory.js'
import { employeesRepository } from '../repositories/employees.repository.js'
import { ordersRepository } from '../repositories/orders.repository.js'
import { productsRepository } from '../repositories/products.repository.js'
import { usersRepository } from '../repositories/users.repository.js'

export const MAX_MOCKS_PER_REQUEST = 100

const validarCantidadMock = (cantidad, campo = 'cantidad') => {
    if (cantidad === undefined || cantidad === null || cantidad === '') {
        throw createValidationError(`El campo ${campo} es obligatorio`)
    }

    const cantidadNumerica = Number(cantidad)

    if (Number.isNaN(cantidadNumerica) || !Number.isFinite(cantidadNumerica)) {
        throw createValidationError(`El campo ${campo} debe ser numerico`)
    }

    if (!Number.isInteger(cantidadNumerica)) {
        throw createValidationError(`El campo ${campo} debe ser un numero entero`)
    }

    if (cantidadNumerica <= 0) {
        throw createValidationError(`El campo ${campo} debe ser mayor a 0`)
    }

    if (cantidadNumerica > MAX_MOCKS_PER_REQUEST) {
        throw createValidationError(
            `El campo ${campo} no puede ser mayor a ${MAX_MOCKS_PER_REQUEST}`
        )
    }

    return cantidadNumerica
}

export const mocksService = {
    obtenerUsuariosMock: async (cantidad) => {
        const cantidadNormalizada = validarCantidadMock(cantidad)

        return generarUsuariosMock(cantidadNormalizada)
    },

    obtenerEmpleadosMock: async (cantidad) => {
        const cantidadNormalizada = validarCantidadMock(cantidad)

        return generarEmpleadosMock(cantidadNormalizada)
    },

    obtenerPedidosMock: async (cantidad) => {
        const cantidadNormalizada = validarCantidadMock(cantidad)
        const empleados = await employeesRepository.getAll({ activo: true })
        const productos = await productsRepository.getAll()

        return generarPedidosMock(cantidadNormalizada, empleados, productos)
    },

    popularUsuarios: async (cantidad) => {
        const cantidadNormalizada = validarCantidadMock(cantidad, 'users')
        const usuarios = generarUsuariosMock(cantidadNormalizada)

        try {
            return await usersRepository.createMany(usuarios)
        } catch (error) {
            throw createInternalServerError('No se pudieron insertar los usuarios mock')
        }
    },

    popularEmpleados: async (cantidad) => {
        const cantidadNormalizada = validarCantidadMock(cantidad, 'employees')
        const empleados = generarEmpleadosMock(cantidadNormalizada)

        try {
            return await employeesRepository.createMany(empleados)
        } catch (error) {
            throw createInternalServerError('No se pudieron insertar los empleados mock')
        }
    },

    popularPedidos: async (cantidad) => {
        const cantidadNormalizada = validarCantidadMock(cantidad, 'orders')
        const empleados = await employeesRepository.getAll({ activo: true })
        const productos = await productsRepository.getAll()

        if (empleados.length === 0 || productos.length === 0) {
            throw createValidationError('Para popular pedidos deben existir empleados activos y productos en la base de datos')
        }

        const pedidos = generarPedidosMock(cantidadNormalizada, empleados, productos)

        try {
            return await ordersRepository.createMany(pedidos)
        } catch (error) {
            throw createInternalServerError('No se pudieron insertar los pedidos mock')
        }
    },

    //! Esta función permite popular mocks de usuarios, empleados y pedidos en una sola llamada.
    popularMocks: async ({ users, employees, orders }) => {
        const resultado = {}

        //* Si no mandan ninguna cantidad en el body, no hay nada para insertar.
        if (users === undefined && employees === undefined && orders === undefined) {
            throw createValidationError('Debe indicarse al menos una cantidad para popular mocks')
        }

        //* Usamos !== undefined para validar tambien valores invalidos como 0, texto o decimales.
        if (users !== undefined) {
            resultado.usuarios = await mocksService.popularUsuarios(users)
        }

        //* Si employees vino en el body, se valida y luego se insertan empleados mock.
        if (employees !== undefined) {
            resultado.empleados = await mocksService.popularEmpleados(employees)
        }

        //* Si orders vino en el body, se valida y luego se insertan pedidos mock.
        if (orders !== undefined) {
            resultado.pedidos = await mocksService.popularPedidos(orders)
        }

        return resultado
    }
}
