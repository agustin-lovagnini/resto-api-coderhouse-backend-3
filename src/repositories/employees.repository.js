import { EmployeeModel } from '../models/employee.model.js'

const employeeProjection = 'nombre apellido email telefono puesto activo createdAt updatedAt'

export const employeesRepository = {
  getAll: async (filter = {}) => {
    return EmployeeModel.find(filter)
      .select(employeeProjection)
      .sort({ createdAt: -1 })
      .lean()
  },

  getById: async (id) => {
    return EmployeeModel.findById(id)
      .select(employeeProjection)
      .lean()
  },

  getByEmail: async (email) => {
    return EmployeeModel.findOne({ email })
      .select(employeeProjection)
      .lean()
  },

  create: async (employeeData) => {
    return EmployeeModel.create(employeeData)
  },

  updateById: async (id, employeeData) => {
    return EmployeeModel.findByIdAndUpdate(id, employeeData, {
      new: true,
      runValidators: true
    }).select(employeeProjection)
  },

  deleteById: async (id) => {
    return EmployeeModel.findByIdAndDelete(id)
      .select(employeeProjection)
      .lean()
  }
}
