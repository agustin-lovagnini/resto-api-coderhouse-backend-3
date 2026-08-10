import app from './app.js'
import { config } from './config/env.config.js'
import { connectDatabase } from './config/db.config.js'
import { logger } from './config/logger.config.js' //* logger centralizado

//? Función para iniciar el servidor y conectarse a la base de datos
const startServer = async () => {
  await connectDatabase()

  //? Inicia el servidor en el puerto especificado en la configuración
  app.listen(config.port, () => {
    logger.info(`Servidor ejecutándose en el puerto ${config.port}`)
    logger.info(`Entorno actual: ${config.nodeEnv}`)
  })
}

startServer() //? Inicia el servidor y la conexión a la base de datos