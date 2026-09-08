import winston from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file' //* Transporte: guardamos logs en archivos rotados por fecha
import { config } from './env.config.js'

//! Niveles de informacion de logs
const logLevels = {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5
}

//! Colores para cada nivel de log, segun su importancia
const logColors = {
    fatal: 'red',
    error: 'red',
    warning: 'yellow',
    info: 'green',
    http: 'cyan',
    debug: 'blue'
}

winston.addColors(logColors)

const consoleLogLevel = config.logLevel

const logFormat = winston.format.combine(
    winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.printf(({ timestamp, level, message, ...metadata }) => { //* Formato de salida de los logs
        const metadataText = Object.keys(metadata).length //* Si hay metadata, la mostramos en el log
            ? ` ${JSON.stringify(metadata)}` //* Lo convertimos a texto JSON
            : ''

        return `${timestamp} [${level}] ${message}${metadataText}`
    })
)

const consoleFormat = winston.format.combine(
    winston.format.colorize(),
    logFormat
)

//? aca definimos el transporte de logs, donde van los logs
const errorFileTransport = new DailyRotateFile({
    filename: 'logs/error-%DATE%.log', 
    datePattern: 'YYYY-MM-DD',
    level: 'error', //* Solo guardamos logs de error y superiores en este archivo
    maxSize: '5m', //* Tamaño máximo del archivo antes de rotar
    maxFiles: '14d',
    zippedArchive: false //* No comprimimos los archivos rotados
})

export const logger = winston.createLogger({
    levels: logLevels, //* Niveles de log definidos anteriormente
    level: consoleLogLevel, //* Nivel de log mínimo que se mostrará en consola
    format: logFormat,
    transports: [
        new winston.transports.Console({ //* Indicamos a dónde van los logs (consola, archivo de errores rotado)
            level: consoleLogLevel,
            format: consoleFormat
        }),
        errorFileTransport //* Guardamos logs de error y superiores en un archivo rotado por fecha
    ]
})
