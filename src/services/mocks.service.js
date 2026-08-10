import { generarEmpleadosMock } from '../mocks/employees.mock.js'
import { generarPedidosMock } from '../mocks/orders.mock.js'
import { generarUsuariosMock } from '../mocks/users.mock.js'
import {
    createInternalServerError,
    createValidationError
} from '../errors/errorFactory.js'
import { logger } from '../config/logger.config.js'
import { employeesRepository } from '../repositories/employees.repository.js'
import { ordersRepository } from '../repositories/orders.repository.js'
import { productsRepository } from '../repositories/products.repository.js'
import { usersRepository } from '../repositories/users.repository.js'

export const MAX_MOCKS_PER_REQUEST = 100

const validarCantidadMock = (cantidad, campo = 'cantidad') => {
    if (cantidad === undefined || cantidad === null || cantidad === '') {
        logger.warning('Cantidad mock obligatoria no recibida', {
            campo
        })

        throw createValidationError(`El campo ${campo} es obligatorio`)
    }

    const cantidadNumerica = Number(cantidad)

    if (Number.isNaN(cantidadNumerica) || !Number.isFinite(cantidadNumerica)) {
        logger.warning('Cantidad mock no numerica recibida', {
            campo,
            cantidad
        })

        throw createValidationError(`El campo ${campo} debe ser numerico`)
    }

    if (!Number.isInteger(cantidadNumerica)) {
        logger.warning('Cantidad mock decimal recibida', {
            campo,
            cantidad: cantidadNumerica
        })

        throw createValidationError(`El campo ${campo} debe ser un numero entero`)
    }

    if (cantidadNumerica <= 0) {
        logger.warning('Cantidad mock menor o igual a cero recibida', {
            campo,
            cantidad: cantidadNumerica
        })

        throw createValidationError(`El campo ${campo} debe ser mayor a 0`)
    }

    if (cantidadNumerica > MAX_MOCKS_PER_REQUEST) {
        logger.warning('Cantidad mock superior al maximo permitido', {
            campo,
            cantidad: cantidadNumerica,
            maximo: MAX_MOCKS_PER_REQUEST
        })

        throw createValidationError(
            `El campo ${campo} no puede ser mayor a ${MAX_MOCKS_PER_REQUEST}`
        )
    }

    return cantidadNumerica
}

export const mocksService = {
    obtenerUsuariosMock: async (cantidad) => {
        const cantidadNormalizada = validarCantidadMock(cantidad)

        logger.info('Generando usuarios mock en memoria', {
            cantidad: cantidadNormalizada
        })

        return generarUsuariosMock(cantidadNormalizada)
    },

    obtenerEmpleadosMock: async (cantidad) => {
        const cantidadNormalizada = validarCantidadMock(cantidad)

        logger.info('Generando empleados mock en memoria', {
            cantidad: cantidadNormalizada
        })

        return generarEmpleadosMock(cantidadNormalizada)
    },

    obtenerPedidosMock: async (cantidad) => {
        const cantidadNormalizada = validarCantidadMock(cantidad)
        const empleados = await employeesRepository.getAll({ activo: true })
        const productos = await productsRepository.getAll()

        logger.info('Generando pedidos mock en memoria', {
            cantidad: cantidadNormalizada,
            empleadosDisponibles: empleados.length,
            productosDisponibles: productos.length
        })

        return generarPedidosMock(cantidadNormalizada, empleados, productos)
    },

    popularUsuarios: async (cantidad) => {
        const cantidadNormalizada = validarCantidadMock(cantidad, 'users')
        const usuarios = generarUsuariosMock(cantidadNormalizada)

        try {
            logger.info('Insertando usuarios mock en MongoDB', {
                cantidad: cantidadNormalizada
            })

            return await usersRepository.createMany(usuarios)
        } catch (error) {
            logger.error('No se pudieron insertar los usuarios mock', {
                cantidad: cantidadNormalizada,
                error: error.message
            })

            throw createInternalServerError('No se pudieron insertar los usuarios mock')
        }
    },

    popularEmpleados: async (cantidad) => {
        const cantidadNormalizada = validarCantidadMock(cantidad, 'employees')
        const empleados = generarEmpleadosMock(cantidadNormalizada)

        try {
            logger.info('Insertando empleados mock en MongoDB', {
                cantidad: cantidadNormalizada
            })

            return await employeesRepository.createMany(empleados)
        } catch (error) {
            logger.error('No se pudieron insertar los empleados mock', {
                cantidad: cantidadNormalizada,
                error: error.message
            })

            throw createInternalServerError('No se pudieron insertar los empleados mock')
        }
    },

    popularPedidos: async (cantidad) => {
        const cantidadNormalizada = validarCantidadMock(cantidad, 'orders')
        const empleados = await employeesRepository.getAll({ activo: true })
        const productos = await productsRepository.getAll()

        if (empleados.length === 0 || productos.length === 0) {
            logger.warning('No se pueden insertar pedidos mock sin empleados activos o productos', {
                empleadosDisponibles: empleados.length,
                productosDisponibles: productos.length
            })

            throw createValidationError('Para popular pedidos deben existir empleados activos y productos en la base de datos')
        }

        const pedidos = generarPedidosMock(cantidadNormalizada, empleados, productos)

        try {
            logger.info('Insertando pedidos mock en MongoDB', {
                cantidad: cantidadNormalizada
            })

            return await ordersRepository.createMany(pedidos)
        } catch (error) {
            logger.error('No se pudieron insertar los pedidos mock', {
                cantidad: cantidadNormalizada,
                error: error.message
            })

            throw createInternalServerError('No se pudieron insertar los pedidos mock')
        }
    },

    //! Esta funcion permite popular mocks de usuarios, empleados y pedidos en una sola llamada.
    popularMocks: async ({ users, employees, orders }) => {
        const resultado = {}

        logger.info('Iniciando carga de mocks en MongoDB', {
            users,
            employees,
            orders
        })

        //* Si no mandan ninguna cantidad en el body, no hay nada para insertar.
        if (users === undefined && employees === undefined && orders === undefined) {
            logger.warning('No se recibieron cantidades para popular mocks')

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

        logger.info('Carga de mocks finalizada', {
            entidadesGeneradas: Object.keys(resultado)
        })

        return resultado
    }
}
