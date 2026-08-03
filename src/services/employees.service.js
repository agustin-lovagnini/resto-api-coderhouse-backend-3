import { PUESTOS_EMPLEADO } from '../constants/index.js'
import {
  createDuplicateError,
  createNotFoundError,
  createValidationError
} from '../errors/errorFactory.js'
import { employeesRepository } from '../repositories/employees.repository.js'

export const employeesService = {
  obtenerEmpleados: async () => {
    return employeesRepository.getAll()
  },

  obtenerEmpleadosActivos: async () => {
    return employeesRepository.getAll({ activo: true })
  },

  obtenerEmpleadoPorId: async (id) => {
    const empleado = await employeesRepository.getById(id)

    if (!empleado) {
      throw createNotFoundError('Empleado no encontrado')
    }

    return empleado
  },

  crearEmpleado: async (employeeData) => {
    if (!employeeData.nombre) {
      throw createValidationError('El nombre del empleado es obligatorio')
    }

    if (!employeeData.apellido) {
      throw createValidationError('El apellido del empleado es obligatorio')
    }

    if (!employeeData.email) {
      throw createValidationError('El email del empleado es obligatorio')
    }

    if (
      !employeeData.puesto ||
      !Object.values(PUESTOS_EMPLEADO).includes(employeeData.puesto)
    ) {
      throw createValidationError('El puesto del empleado no es valido')
    }

    const empleadoExistente = await employeesRepository.getByEmail(
      employeeData.email
    )

    if (empleadoExistente) {
      throw createDuplicateError('Ya existe un empleado con ese email')
    }

    return employeesRepository.create(employeeData)
  },

  actualizarEmpleado: async (id, employeeData) => {
    if (
      employeeData.puesto &&
      !Object.values(PUESTOS_EMPLEADO).includes(employeeData.puesto)
    ) {
      throw createValidationError('El puesto del empleado no es valido')
    }

    if (employeeData.email) {
      const empleadoExistente = await employeesRepository.getByEmail(
        employeeData.email
      )

      if (empleadoExistente && empleadoExistente._id.toString() !== id) {
        throw createDuplicateError('Ya existe un empleado con ese email')
      }
    }

    const empleadoActualizado = await employeesRepository.updateById(
      id,
      employeeData
    )

    if (!empleadoActualizado) {
      throw createNotFoundError('Empleado no encontrado')
    }

    return empleadoActualizado
  },

  eliminarEmpleado: async (id) => {
    const empleadoEliminado = await employeesRepository.deleteById(id)

    if (!empleadoEliminado) {
      throw createNotFoundError('Empleado no encontrado')
    }

    return empleadoEliminado
  }
}
