import { unlink } from 'node:fs/promises' //? Importamos unlink para eliminar archivos de imagen de prueba
import mongoose from 'mongoose'
import { config } from '../src/config/env.config.js'
import { logger } from '../src/config/logger.config.js'

//! Validamos que la base de datos de testing sea la correcta
const validateTestDatabase = () => {
    if (config.nodeEnv !== 'test') {//? Validamos que la variable de entorno NODE_ENV sea "test"
        throw new Error(
            'Los tests solo pueden ejecutarse con NODE_ENV=test'
        )
    }

    let databaseName //? Guardamos el nombre de la base de datos de testing para validar que incluya "test" en su nombre

    try {
        const databaseUrl = new URL(config.mongoUri) //? Obtenemos la URL de la base de datos de testing desde la variable de entorno MONGO_URI
        databaseName = databaseUrl.pathname.replace(/^\/+/, '') //? Obtenemos el nombre de la base de datos de testing desde la URL
    } catch {
        throw new Error(
            'La URI de MongoDB de testing no tiene un formato valido'
        )
    }

    if (!databaseName || !databaseName.toLowerCase().includes('test')) { //? Validamos que el nombre de la base de datos de testing incluya "test" en su nombre
        throw new Error(
            'La base de datos usada por los tests debe incluir "test" en su nombre'
        )
    }
}

//! Conectamos a la base de datos de testing
export const connectTestDatabase = async () => {
    validateTestDatabase() //? Validamos que la base de datos de testing sea la correcta

    if (mongoose.connection.readyState === 1) { //? Validamos que la conexion con la base de datos de testing no este ya establecida
        return
    }

    await mongoose.connect(config.mongoUri) //? Conectamos a la base de datos de testing usando la URI de MongoDB de testing desde la variable de entorno MONGO_URI

    logger.info('Conexion con MongoDB de testing establecida correctamente')
}

//! Limpiamos la base de datos de testing
export const clearTestDatabase = async () => {
    const collections = mongoose.connection.collections //? Obtenemos todas las colecciones de la base de datos
    //? {
    //?     users: ColeccionUsers,
    //?     products: ColeccionProducts,
    //?     employees: ColeccionEmployees,
    //?     orders: ColeccionOrders
    //? }

    //! Limpiamos todas las colecciones de la base de datos
    for (const collection of Object.values(collections)) { //? Recorremos todas las colecciones de la base de datos
        await collection.deleteMany({}) //? Eliminamos todos los documentos de la colección
    }
}

//! Cerramos la conexion con la base de datos de testing
export const closeTestDatabase = async () => {
    await mongoose.connection.close()
}

//! Eliminamos un archivo de imagen de prueba
export const removeTestFile = async (filePath) => {
    if (!filePath) { //? Si no se pasa un path de archivo, no hacemos nada
        return
    }

    try {
        await unlink(filePath) //? Eliminamos el archivo de imagen de prueba
    } catch (error) {
        if (error.code !== 'ENOENT') { //? Si el error no es "archivo no encontrado", lanzamos el error
            throw error
        }
    }
}