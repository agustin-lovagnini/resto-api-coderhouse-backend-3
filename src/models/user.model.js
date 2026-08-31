import mongoose from 'mongoose'
import {
  ROLES_USUARIO,
  TIPOS_DOCUMENTO_USUARIO
} from '../constants/index.js'

//! Definimos un esquema para los metadatos de los archivos subidos por los usuarios
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
      enum: Object.values(TIPOS_DOCUMENTO_USUARIO),
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

//! Definimos un esquema para los usuarios, incluyendo un array de documentos subidos
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
    },
    documentos: {
      type: [fileMetadataSchema],
      default: []
    }
  },
  {
    timestamps: true
  }
)

export const UserModel = mongoose.model('User', userSchema)