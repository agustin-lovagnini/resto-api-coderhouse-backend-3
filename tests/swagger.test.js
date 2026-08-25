import request from 'supertest' //? Supertest permite hacer requests a tu app sin levantar el servidor con app.listen.
import { expect } from 'chai'
import app from '../src/app.js'
import {
    clearTestDatabase,
    closeTestDatabase,
    connectTestDatabase
} from './setup.js'

describe('Swagger docs', () => {
    //! Antes de correr los tests
    before(async () => {
        await connectTestDatabase() //? Conectamos a la base de datos de testing
        await clearTestDatabase() //? Limpiamos la base de datos de testing antes de correr los tests
    })

    //! Después de correr los tests
    after(async () => {
        await clearTestDatabase() //? Limpiamos la base de datos de testing después de correr los tests
        await closeTestDatabase() //? Cerramos la conexion con la base de datos de testing
    })

    it('debe abrir la documentacion Swagger en /api/docs', async () => {
        const response = await request(app) //? Hacemos un request a la ruta /api/docs
            .get('/api/docs')
            .expect(301) //* Esperamos un redireccionamiento a /api/docs/

        expect(response.headers.location).to.equal('/api/docs/')
    })

    it('debe servir Swagger UI en /api/docs/', async () => {
        const response = await request(app) 
            .get('/api/docs/')
            .expect(200)

        expect(response.headers['content-type']).to.include('text/html') //? Esperamos que el content-type sea text/html
        expect(response.text).to.include('Swagger UI') //? Esperamos que el body de la respuesta contenga 'Swagger UI'
    })
})