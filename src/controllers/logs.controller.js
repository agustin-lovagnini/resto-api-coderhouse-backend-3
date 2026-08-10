import { logger } from '../config/logger.config.js'

//! Controlador para probar los diferentes niveles de log
export const probarLogger = (req, res) => {
  logger.debug('Log debug de prueba desde endpoint')
  logger.http('Log http de prueba desde endpoint')
  logger.info('Log info de prueba desde endpoint')
  logger.warning('Log warning de prueba desde endpoint')
  logger.error('Log error de prueba desde endpoint')
  logger.fatal('Log fatal de prueba desde endpoint')

  res.status(200).json({
    status: 'success',
    message: 'Logs de prueba generados correctamente'
  })
}