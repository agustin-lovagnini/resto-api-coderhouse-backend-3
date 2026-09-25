import { ProductModel } from '../models/product.model.js'

const productProjection = 'nombre descripcion categoria precio stock estado createdAt updatedAt'


export const productsRepository = {
  getAll: async (filter = {}, { limit, skip } = {}) => {
  const query = ProductModel.find(filter)
    .select(productProjection)
    .sort({ createdAt: -1 })

  if (Number.isInteger(skip)) {
    query.skip(skip)
  }

  if (Number.isInteger(limit)) {
    query.limit(limit)
  }

  return query.lean()
},

countAll: async (filter = {}) => {
  return ProductModel.countDocuments(filter)
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
      returnDocument: 'after',
      runValidators: true
    }).select(productProjection)
  },

  deleteById: async (id) => {
    return ProductModel.findByIdAndDelete(id)
      .select(productProjection)
      .lean()
  }
}
