import mongoose from 'mongoose'
import { config } from './env.config.js' 

//? Función para conectar a la base de datos MongoDB usando Mongoose
export const connectDatabase = async () => {
  try {
    await mongoose.connect(config.mongoUri)

    console.log('Conexión con MongoDB establecida correctamente')
  } catch (error) {
    console.error(`Error al conectar con MongoDB: ${error.message}`)

    process.exit(1)
  }
}