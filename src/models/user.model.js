import mongoose from 'mongoose'
import { ROLES_USUARIO } from '../constants/index.js'

const userSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true
    },
    apellido: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    rol: {
      type: String,
      enum: Object.values(ROLES_USUARIO),
      default: ROLES_USUARIO.USUARIO
    }
  },
  {
    timestamps: true
  }
)

export const UserModel = mongoose.model('User', userSchema)
