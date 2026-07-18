import app from './app.js'
import { config } from './config/env.config.js'
import { connectDatabase } from './config/db.config.js'

//? Función para iniciar el servidor y conectarse a la base de datos
const startServer = async () => {
  await connectDatabase()

  app.listen(config.port, () => {
    console.log(`Servidor ejecutándose en el puerto ${config.port}`)
    console.log(`Entorno actual: ${config.nodeEnv}`)
  })
}

startServer() //? Inicia el servidor y la conexión a la base de datos