import request from 'supertest'
import { expect } from 'chai'
import app from '../src/app.js'
import {
    clearTestDatabase,
    closeTestDatabase,
    connectTestDatabase
} from './setup.js'

describe('Not found handler', () => {
    before(async () => {
        await connectTestDatabase()
        await clearTestDatabase()
    })

    after(async () => {
        await clearTestDatabase()
        await closeTestDatabase()
    })

    //! Test para verificar que se responde con 404 y el formato de error centralizado ante una ruta inexistente
    it('debe responder 404 con formato de error centralizado ante una ruta inexistente', async () => {
        const response = await request(app)
            .get('/api/ruta-inexistente')
            .expect(404)

        expect(response.body).to.have.property('status', 'error')
        expect(response.body).to.have.property('code', 'NOT_FOUND_ERROR')
        expect(response.body).to.have.property('message')
        expect(response.body.message).to.include('/api/ruta-inexistente')
    })
})