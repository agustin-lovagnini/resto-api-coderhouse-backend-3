import { UserModel } from '../models/user.model.js'

const userProjection = 'nombre apellido email rol createdAt updatedAt'

export const usersRepository = {
  getAll: async () => {
    return UserModel.find()
      .select(userProjection)
      .sort({ createdAt: -1 })
      .lean()
  },

  getById: async (id) => {
    return UserModel.findById(id)
      .select(userProjection)
      .lean()
  },

  getByEmail: async (email) => {
    return UserModel.findOne({ email })
      .select(userProjection)
      .lean()
  },

  create: async (userData) => {
    return UserModel.create(userData)
  },

  //! para crear varios usuarios a la vez
  createMany: async (usersData) => {
  return UserModel.insertMany(usersData)
},

  updateById: async (id, userData) => {
    return UserModel.findByIdAndUpdate(id, userData, {
      new: true,
      runValidators: true
    }).select(userProjection)
  },

  deleteById: async (id) => {
    return UserModel.findByIdAndDelete(id)
      .select(userProjection)
      .lean()
  }
}
