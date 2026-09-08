import dotenv from 'dotenv'

const envFile = process.env.NODE_ENV === 'test' ? '.env.test' : '.env'

//! carga las variables de entorno desde el archivo .env
dotenv.config({
    path: envFile
})

const allowedEnvironments = ['development', 'test', 'production']
const allowedLogLevels = ['fatal', 'error', 'warning', 'info', 'http', 'debug']

//? validacion que las variables de entorno necesarias esten definidas
const requiredVariables = [
    'PORT',
    'MONGODB_URI',
    'NODE_ENV'
]

//? busca las validaciones que las variables de entorno necesarias esten definidas
requiredVariables.forEach((variable) => {
    if (!process.env[variable]) {
        throw new Error(
            `La variable de entorno ${variable} es obligatoria y no esta definida`
        )
    }
})

const port = Number(process.env.PORT)

if (!Number.isInteger(port) || port < 1) {
    throw new Error('La variable de entorno PORT debe ser un numero entero mayor a 0')
}

if (!allowedEnvironments.includes(process.env.NODE_ENV)) {
    throw new Error(
        `La variable de entorno NODE_ENV debe ser una de: ${allowedEnvironments.join(', ')}`
    )
}

const logLevel = process.env.LOG_LEVEL || (
    process.env.NODE_ENV === 'production' ? 'info' : 'debug'
)

const uploadsDir = process.env.UPLOADS_DIR || 'uploads'

if (!allowedLogLevels.includes(logLevel)) {
    throw new Error(
        `La variable de entorno LOG_LEVEL debe ser una de: ${allowedLogLevels.join(', ')}`
    )
}

//? una vez corroborado, exportamos las variables de entorno necesarias
export const config = {
    port,
    mongoUri: process.env.MONGODB_URI,
    nodeEnv: process.env.NODE_ENV,
    logLevel,
    uploadsDir
}
