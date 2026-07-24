import { generarEmpleadosMock } from '../mocks/employees.mock.js'
import { generarPedidosMock } from '../mocks/orders.mock.js'
import { generarUsuariosMock } from '../mocks/users.mock.js'
import { employeesRepository } from '../repositories/employees.repository.js'
import { ordersRepository } from '../repositories/orders.repository.js'
import { productsRepository } from '../repositories/products.repository.js'
import { usersRepository } from '../repositories/users.repository.js'

const normalizarCantidad = (cantidad, valorPorDefecto = 10) => {
    const cantidadNumerica = Number(cantidad)

    if (!cantidad || Number.isNaN(cantidadNumerica) || cantidadNumerica < 1) {
        return valorPorDefecto
    }

    return cantidadNumerica
}

export const mocksService = {
    obtenerUsuariosMock: async (cantidad) => {
        const cantidadNormalizada = normalizarCantidad(cantidad)

        return generarUsuariosMock(cantidadNormalizada)
    },

    obtenerEmpleadosMock: async (cantidad) => {
        const cantidadNormalizada = normalizarCantidad(cantidad)

        return generarEmpleadosMock(cantidadNormalizada)
    },

    obtenerPedidosMock: async (cantidad) => {
        const cantidadNormalizada = normalizarCantidad(cantidad)
        const empleados = await employeesRepository.getAll({ activo: true })
        const productos = await productsRepository.getAll()

        return generarPedidosMock(cantidadNormalizada, empleados, productos)
    },

    popularUsuarios: async (cantidad) => {
        const cantidadNormalizada = normalizarCantidad(cantidad)
        const usuarios = generarUsuariosMock(cantidadNormalizada)

        return usersRepository.createMany(usuarios)
    },

    popularEmpleados: async (cantidad) => {
        const cantidadNormalizada = normalizarCantidad(cantidad)
        const empleados = generarEmpleadosMock(cantidadNormalizada)

        return employeesRepository.createMany(empleados)
    },

    popularPedidos: async (cantidad) => {
        const cantidadNormalizada = normalizarCantidad(cantidad)
        const empleados = await employeesRepository.getAll({ activo: true })
        const productos = await productsRepository.getAll()

        if (empleados.length === 0 || productos.length === 0) {
            throw new Error('Para popular pedidos deben existir empleados activos y productos en la base de datos')
        }

        const pedidos = generarPedidosMock(cantidadNormalizada, empleados, productos)

        return ordersRepository.createMany(pedidos)
    },

    popularMocks: async ({ users, employees, orders }) => {
        const resultado = {}

        if (users) {
            resultado.usuarios = await mocksService.popularUsuarios(users)
        }

        if (employees) {
            resultado.empleados = await mocksService.popularEmpleados(employees)
        }

        if (orders) {
            resultado.pedidos = await mocksService.popularPedidos(orders)
        }

        return resultado
    }
}
