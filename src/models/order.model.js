import mongoose from 'mongoose'
import {
  ESTADOS_PEDIDO,
  TIPOS_COMPROBANTE_PEDIDO
} from '../constants/index.js'

const orderProductSchema = new mongoose.Schema(
  {
    producto: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    cantidad: {
      type: Number,
      required: true,
      min: 1
    },
    precioUnitario: {
      type: Number,
      required: true,
      min: 0
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0
    }
  },
  {
    _id: false
  }
)

const fileMetadataSchema = new mongoose.Schema(
  {
    nombreOriginal: {
      type: String,
      required: true,
      trim: true
    },
    nombreArchivo: {
      type: String,
      required: true,
      trim: true
    },
    ruta: {
      type: String,
      required: true,
      trim: true
    },
    mimetype: {
      type: String,
      required: true,
      trim: true
    },
    size: {
      type: Number,
      required: true,
      min: 1
    },
    tipoDocumento: {
      type: String,
      enum: Object.values(TIPOS_COMPROBANTE_PEDIDO),
      required: true
    },
    fechaCarga: {
      type: Date,
      default: Date.now
    }
  },
  {
    _id: false
  }
)

const orderSchema = new mongoose.Schema(
  {
    mesa: {
      type: Number,
      required: true,
      min: 1
    },
    empleado: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: true
    },
    productos: {
      type: [orderProductSchema],
      required: true,
      validate: {
        validator: (productos) => productos.length > 0,
        message: 'El pedido debe tener al menos un producto'
      }
    },
    estado: {
      type: String,
      enum: Object.values(ESTADOS_PEDIDO),
      default: ESTADOS_PEDIDO.PENDIENTE
    },
    total: {
      type: Number,
      required: true,
      min: 0
    },
    observaciones: {
      type: String,
      default: '',
      trim: true
    },
    comprobantes: {
      type: [fileMetadataSchema],
      default: []
    }
  },
  {
    timestamps: true
  }
)

export const OrderModel = mongoose.model('Order', orderSchema)