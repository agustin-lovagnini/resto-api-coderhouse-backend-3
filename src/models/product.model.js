import mongoose from 'mongoose'
import {
    CATEGORIAS_PRODUCTO,
    ESTADOS_PRODUCTO
} from '../constants/index.js'

const productSchema = new mongoose.Schema(
    {
        nombre: {
            type: String,
            required: true,
            trim: true
        },
        descripcion: {
            type: String,
            default: ''
        },
        categoria: {
            type: String,
            enum: Object.values(CATEGORIAS_PRODUCTO),
            required: true
        },
        precio: {
            type: Number,
            required: true,
            min: 0
        },
        stock: {
            type: Number,
            required: true,
            min: 0
        },
        estado: {
            type: String,
            enum: Object.values(ESTADOS_PRODUCTO),
            default: ESTADOS_PRODUCTO.DISPONIBLE
        }
    },
    {
        timestamps: true
    }
)

export const ProductModel = mongoose.model('Product', productSchema)
