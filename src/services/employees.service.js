import { PUESTOS_EMPLEADO } from '../constants/index.js'
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
      throw new Error('Empleado no encontrado')
    }

    return empleado
  },

  crearEmpleado: async (employeeData) => {
    if (!employeeData.nombre) {
      throw new Error('El nombre del empleado es obligatorio')
    }

    if (!employeeData.apellido) {
      throw new Error('El apellido del empleado es obligatorio')
    }

    if (!employeeData.email) {
      throw new Error('El email del empleado es obligatorio')
    }

    if (
      !employeeData.puesto ||
      !Object.values(PUESTOS_EMPLEADO).includes(employeeData.puesto)
    ) {
      throw new Error('El puesto del empleado no es valido')
    }

    const empleadoExistente = await employeesRepository.getByEmail(
      employeeData.email
    )

    if (empleadoExistente) {
      throw new Error('Ya existe un empleado con ese email')
    }

    return employeesRepository.create(employeeData)
  },

  actualizarEmpleado: async (id, employeeData) => {
    if (
      employeeData.puesto &&
      !Object.values(PUESTOS_EMPLEADO).includes(employeeData.puesto)
    ) {
      throw new Error('El puesto del empleado no es valido')
    }

    if (employeeData.email) {
      const empleadoExistente = await employeesRepository.getByEmail(
        employeeData.email
      )

      if (empleadoExistente && empleadoExistente._id.toString() !== id) {
        throw new Error('Ya existe un empleado con ese email')
      }
    }

    const empleadoActualizado = await employeesRepository.updateById(
      id,
      employeeData
    )

    if (!empleadoActualizado) {
      throw new Error('Empleado no encontrado')
    }

    return empleadoActualizado
  },

  eliminarEmpleado: async (id) => {
    const empleadoEliminado = await employeesRepository.deleteById(id)

    if (!empleadoEliminado) {
      throw new Error('Empleado no encontrado')
    }

    return empleadoEliminado
  }
}
