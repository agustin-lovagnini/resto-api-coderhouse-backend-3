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

    //! Test para verificar que se puede obtener un listado paginado de usuarios
        it('debe obtener un listado paginado de usuarios', async () => {
        const response = await request(app)
            .get('/api/users')
            .query({ page: 1, limit: 10 })
            .expect(200)

        expect(response.body).to.have.property('status', 'success')
        expect(response.body).to.have.property('payload')
        expect(response.body.payload).to.be.an('array')
        expect(response.body).to.have.property('pagination')
        expect(response.body.pagination).to.have.property('page', 1)
        expect(response.body.pagination).to.have.property('limit', 10)
        expect(response.body.pagination).to.have.property('totalDocs')
        expect(response.body.pagination).to.have.property('totalPages')
        expect(response.body.pagination).to.have.property('hasPrevPage')
        expect(response.body.pagination).to.have.property('hasNextPage')
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

        it('debe subir un documento de usuario correctamente', async () => {
        const usuarioResponse = await request(app)
            .post('/api/users')
            .send({
                nombre: 'Usuario Documento',
                apellido: 'Test',
                email: `usuario.documento.${Date.now()}@mail.com`,
                rol: 'USUARIO'
            })
            .expect(201)

        const usuarioId = usuarioResponse.body.payload._id

        const response = await request(app)
            .post(`/api/users/${usuarioId}/documents`)
            .field('tipoDocumento', 'DNI')
            .attach('documento', 'prueba-documento.pdf')
            .expect(200)

        expect(response.body).to.have.property('status', 'success')
        expect(response.body).to.have.property(
            'message',
            'Documento cargado correctamente'
        )
        expect(response.body).to.have.property('payload')
        expect(response.body.payload.documentos).to.be.an('array')
        expect(response.body.payload.documentos).to.have.lengthOf(1)
        expect(response.body.payload.documentos[0]).to.have.property(
            'tipoDocumento',
            'DNI'
        )
        expect(response.body.payload.documentos[0]).to.have.property(
            'mimetype',
            'application/pdf'
        )
    })
})