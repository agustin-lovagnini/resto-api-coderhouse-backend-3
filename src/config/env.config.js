import dotenv from 'dotenv'

dotenv.config()

//? validacion que las variables de entorno necesarias estén definidas
const requiredVariables = ['PORT', 'MONGODB_URI', 'NODE_ENV']

//? busca las validaciones que las variables de entorno necesarias estén definidas
requiredVariables.forEach((variable) => {
    if (!process.env[variable]) {
        throw new Error(
            `La variable de entorno ${variable} es obligatoria y no está definida`
        )
    }
})

//? una vez corroborado, exportamos las variables de entorno necesarias
export const config = {
    port: Number(process.env.PORT),
    mongoUri: process.env.MONGODB_URI,
    nodeEnv: process.env.NODE_ENV
}