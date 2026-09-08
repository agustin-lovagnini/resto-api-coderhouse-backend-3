import { UserModel } from '../models/user.model.js'

const userProjection = 'nombre apellido email rol documentos createdAt updatedAt'

export const usersRepository = {
  getAll: async ({ limit, skip } = {}) => {
    return UserModel.find()
      .select(userProjection)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
  },

  countAll: async () => {
    return UserModel.countDocuments()
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

  //! para actualizar varios usuarios a la vez
  addDocumentById: async (id, documentData) => {
    return UserModel.findByIdAndUpdate(
      id,
      {
        //? Agregamos un nuevo documento al array de documentos del usuario
        $push: {
          documentos: documentData
        }
      },
      {
        new: true,
        runValidators: true
      }
    ).select(userProjection)
  },

  deleteById: async (id) => {
    return UserModel.findByIdAndDelete(id)
      .select(userProjection)
      .lean()
  }
}