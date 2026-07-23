import mongoose from 'mongoose'
import { PUESTOS_EMPLEADO } from '../constants/index.js'

const employeeSchema = new mongoose.Schema(
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
    telefono: {
      type: String,
      default: '',
      trim: true
    },
    puesto: {
      type: String,
      enum: Object.values(PUESTOS_EMPLEADO),
      required: true
    },
    activo: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
)

export const EmployeeModel = mongoose.model('Employee', employeeSchema)
