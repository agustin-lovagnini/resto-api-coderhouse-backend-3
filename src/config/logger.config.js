import winston from 'winston'
import { config } from './env.config.js'

//! Define los niveles de log y sus colores correspondientes
const logLevels = {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5
}

const logColors = {
    fatal: 'red',
    error: 'red',
    warning: 'yellow',
    info: 'green',
    http: 'cyan',
    debug: 'blue'
}

winston.addColors(logColors) //? Agrega los colores definidos a los niveles de log de Winston

//! Define el formato de log/mensajes personalizado
const logFormat = winston.format.combine(
    winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.printf(({ timestamp, level, message, ...metadata }) => {
        const metadataText = Object.keys(metadata).length
            ? ` ${JSON.stringify(metadata)}`
            : ''

        return `${timestamp} [${level}] ${message}${metadataText}`
    })
)

//! Define los transportes de log (archivos y consola)
const transports = [
    new winston.transports.File({//? Transport para logs de error
        filename: 'logs/error.log',
        level: 'error',
        format: logFormat
    }),
    new winston.transports.File({//? Transport para logs combinados
        filename: 'logs/combined.log',
        level: config.logLevel,
        format: logFormat
    })
]

//! Agrega un transporte de consola solo en el entorno de desarrollo
if (config.nodeEnv === 'development') {
    transports.push(
        new winston.transports.Console({
            level: config.logLevel,
            format: winston.format.combine(
                winston.format.colorize(),
                logFormat
            )
        })
    )
}

//! Crea el logger de Winston con los niveles, formato y transportes definidos
export const logger = winston.createLogger({
    levels: logLevels,
    level: config.logLevel,
    format: logFormat,
    transports
})