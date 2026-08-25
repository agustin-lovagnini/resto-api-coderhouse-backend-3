import request from 'supertest'
import { expect } from 'chai'
import app from '../src/app.js'
import {
    clearTestDatabase,
    closeTestDatabase,
    connectTestDatabase
} from './setup.js'


describe('Logger endpoint', () => {
    before(async () => {
        await connectTestDatabase()
        await clearTestDatabase()
    })

    after(async () => {
        await clearTestDatabase()
        await closeTestDatabase()
    })

    //! Test para verificar que el endpoint de logs de prueba funciona correctamente
    it('debe generar logs de prueba correctamente', async () => {
        const response = await request(app)
            .get('/api/logs/test')
            .expect(200)

        expect(response.body).to.have.property('status', 'success') //? Esperamos que la respuesta tenga la propiedad 'status' con valor 'success'
        expect(response.body).to.have.property(
            'message',
            'Logs de prueba generados correctamente'
        ) //? Esperamos que la respuesta tenga la propiedad 'message' con valor 'Logs de prueba generados correctamente'
    })
})