import request from 'supertest'
import { expect } from 'chai'
import app from '../src/app.js'
import {
    clearTestDatabase,
    closeTestDatabase,
    connectTestDatabase
} from './setup.js'

describe('Users endpoints', () => {
    before(async () => {
        await connectTestDatabase()
        await clearTestDatabase()
    })

    after(async () => {
        await clearTestDatabase()
        await closeTestDatabase()
    })

    //! Test para verificar que se puede crear un usuario correctamente
    it('debe crear un usuario correctamente con datos validos', async () => {
        const response = await request(app)
            .post('/api/users')
            .send({
                nombre: 'Usuario',
                apellido: 'Test',
                email: `usuario.test.${Date.now()}@mail.com`,
                rol: 'USUARIO'
            })
            .expect(201)

        expect(response.body).to.have.property('status', 'success')
        expect(response.body).to.have.property('payload')
        expect(response.body.payload).to.have.property('_id')
        expect(response.body.payload).to.have.property('nombre', 'Usuario')
        expect(response.body.payload).to.have.property('apellido', 'Test')
        expect(response.body.payload).to.have.property('email')
        expect(response.body.payload).to.have.property('rol', 'USUARIO')
    })

    //! Test para verificar que se puede obtener un listado de usuarios
    it('debe obtener un listado de usuarios', async () => {
        const response = await request(app)
            .get('/api/users')
            .expect(200)

        expect(response.body).to.have.property('status', 'success')
        expect(response.body).to.have.property('payload')
        expect(response.body.payload).to.be.an('array')
    })

    //! Test para verificar que se puede crear un usuario correctamente
    it('debe responder 400 al crear un usuario con datos incompletos', async () => {
        const response = await request(app)
            .post('/api/users')
            .send({
                apellido: 'Perez',
                email: 'usuario.incompleto@test.com',
                rol: 'USUARIO'
            })
            .expect(400)

        expect(response.body).to.have.property('status', 'error')
        expect(response.body).to.have.property('code', 'VALIDATION_ERROR')
        expect(response.body).to.have.property('message')
    })

    //! Test para verificar que se puede crear un usuario correctamente
    it('debe responder 404 al consultar un usuario inexistente', async () => {
        const response = await request(app)
            .get('/api/users/64f8a8c2b9a1f23d45678910')
            .expect(404)

        expect(response.body).to.have.property('status', 'error') //? Esperamos que la respuesta tenga la propiedad 'status' con valor 'error'
        expect(response.body).to.have.property('code', 'NOT_FOUND_ERROR')  //? Esperamos que la respuesta tenga la propiedad 'code' con valor 'NOT_FOUND_ERROR'
        expect(response.body).to.have.property('message', 'Usuario no encontrado') //? Esperamos que la respuesta tenga la propiedad 'message' con valor 'Usuario no encontrado'
    })
})