import dotenv from 'dotenv'

const envFile = process.env.NODE_ENV === 'test' ? '.env.test' : '.env'

//! carga las variables de entorno desde el archivo .env
dotenv.config({
    path: envFile
})

//? validacion que las variables de entorno necesarias esten definidas
const requiredVariables = ['PORT', 'MONGODB_URI', 'NODE_ENV']

//? busca las validaciones que las variables de entorno necesarias esten definidas
requiredVariables.forEach((variable) => {
    if (!process.env[variable]) {
        throw new Error(
            `La variable de entorno ${variable} es obligatoria y no esta definida`
        )
    }
})

//? una vez corroborado, exportamos las variables de entorno necesarias
export const config = {
    port: Number(process.env.PORT),
    mongoUri: process.env.MONGODB_URI,
    nodeEnv: process.env.NODE_ENV
}