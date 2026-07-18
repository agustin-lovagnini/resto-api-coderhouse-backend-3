import { ProductModel } from '../models/product.model.js'

const productProjection = 'nombre descripcion categoria precio stock estado createdAt updatedAt'


export const productsRepository = {
  getAll: async (filter = {}) => {
    return ProductModel.find(filter)
      .select(productProjection)
      .sort({ createdAt: -1 })
      .lean()
  },

  getById: async (id) => {
    return ProductModel.findById(id)
      .select(productProjection)
      .lean()
  },

  getByNombre: async (nombre) => {
    return ProductModel.findOne({ nombre })
      .select(productProjection)
      .lean()
  },

  create: async (productData) => {
    return ProductModel.create(productData)
  },

  updateById: async (id, productData) => {
    return ProductModel.findByIdAndUpdate(id, productData, {
      new: true,
      runValidators: true
    }).select(productProjection)
  },

  deleteById: async (id) => {
    return ProductModel.findByIdAndDelete(id)
      .select(productProjection)
      .lean()
  }
}
