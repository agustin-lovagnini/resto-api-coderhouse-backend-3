import { EmployeeModel } from '../models/employee.model.js'

const employeeProjection = 'nombre apellido email telefono puesto activo createdAt updatedAt'

export const employeesRepository = {
  getAll: async (filter = {}, { limit, skip } = {}) => {
    return EmployeeModel.find(filter)
      .select(employeeProjection)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
  },

  countAll: async (filter = {}) => {
    return EmployeeModel.countDocuments(filter)
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

  createMany: async (employeesData) => {
    return EmployeeModel.insertMany(employeesData)
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
