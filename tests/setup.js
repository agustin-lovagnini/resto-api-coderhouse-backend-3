import mongoose from 'mongoose'
import { config } from '../src/config/env.config.js'
import { logger } from '../src/config/logger.config.js'

//! configuracion de la base de datos de testing
export const connectTestDatabase = async () => {
    //! Si ya estamos conectados a la base de datos, no hacemos nada
    if (mongoose.connection.readyState === 1) {
        return
    }

    await mongoose.connect(config.mongoUri) //? Conectamos a la base de datos de testing

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