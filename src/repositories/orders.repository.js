import { OrderModel } from '../models/order.model.js'

const orderProjection = 'mesa empleado productos estado total observaciones comprobantes createdAt updatedAt'

const populateOrder = (query) => {
  return query
    .populate('empleado', 'nombre apellido puesto activo')
    .populate('productos.producto', 'nombre descripcion categoria precio estado')
}

export const ordersRepository = {
  getAll: async (filter = {}) => {
    return populateOrder(
      OrderModel.find(filter)
        .select(orderProjection)
        .sort({ createdAt: -1 })
    ).lean()
  },

  getById: async (id) => {
    return populateOrder(
      OrderModel.findById(id)
        .select(orderProjection)
    ).lean()
  },

  create: async (orderData) => {
    return OrderModel.create(orderData)
  },

  createMany: async (ordersData) => {
    return OrderModel.insertMany(ordersData)
  },

  updateById: async (id, orderData) => {
    return populateOrder(
      OrderModel.findByIdAndUpdate(id, orderData, {
        new: true,
        runValidators: true
      }).select(orderProjection)
    )
  },

  //! para actualizar varios pedidos a la vez
  addReceiptById: async (id, receiptData) => {
    return populateOrder(
      OrderModel.findByIdAndUpdate(
        id,
        {
          $push: {
            comprobantes: receiptData
          }
        },
        {
          new: true,
          runValidators: true
        }
      ).select(orderProjection)
    )
  },

  deleteById: async (id) => {
    return populateOrder(
      OrderModel.findByIdAndDelete(id)
        .select(orderProjection)
    ).lean()
  }
}