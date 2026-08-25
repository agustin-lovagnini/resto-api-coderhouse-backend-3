import request from 'supertest'
import { expect } from 'chai'
import app from '../src/app.js'
import {
    clearTestDatabase,
    closeTestDatabase,
    connectTestDatabase
} from './setup.js'

describe('Mocks endpoints', () => {
    before(async () => {
        await connectTestDatabase()
        await clearTestDatabase()
    })

    after(async () => {
        await clearTestDatabase()
        await closeTestDatabase()
    })

    //! Test para verificar que se pueden generar usuarios mock correctamente
    it('debe generar usuarios mock correctamente', async () => {
        const response = await request(app)
            .get('/api/mocks/users')
            .query({ cantidad: 2 }) //? Enviamos la cantidad de usuarios mock que queremos generar como query param
            .expect(200)

        expect(response.body).to.have.property('status', 'success')
        expect(response.body).to.have.property('payload')
        expect(response.body.payload).to.be.an('array')
        expect(response.body.payload).to.have.lengthOf(2) //? Esperamos que el array de usuarios mock tenga la longitud de 2
        expect(response.body.payload[0]).to.have.property('nombre')
        expect(response.body.payload[0]).to.have.property('apellido')
        expect(response.body.payload[0]).to.have.property('email')
        expect(response.body.payload[0]).to.have.property('rol')
    })

    //! Test para verificar que se pueden generar empleados mock correctamente
    it('debe generar empleados mock correctamente', async () => {
        const response = await request(app)
            .get('/api/mocks/employees')
            .query({ cantidad: 2 })
            .expect(200)

        expect(response.body).to.have.property('status', 'success')
        expect(response.body).to.have.property('payload')
        expect(response.body.payload).to.be.an('array')
        expect(response.body.payload).to.have.lengthOf(2)
        expect(response.body.payload[0]).to.have.property('nombre')
        expect(response.body.payload[0]).to.have.property('apellido')
        expect(response.body.payload[0]).to.have.property('email')
        expect(response.body.payload[0]).to.have.property('puesto')
    })

    //! Test para verificar que se puede generar un producto mock correctamente
    it('debe responder 400 si falta la cantidad para generar mocks', async () => {
        const response = await request(app)
            .get('/api/mocks/users')
            .expect(400)

        expect(response.body).to.have.property('status', 'error')
        expect(response.body).to.have.property('code', 'VALIDATION_ERROR') //? Esperamos que la respuesta tenga la propiedad 'code' con valor 'VALIDATION_ERROR'
        expect(response.body).to.have.property(
            'message',
            'El campo cantidad es obligatorio'
        )
    })

    //! Test para verificar que se puede generar un producto mock correctamente
    it('debe responder 400 si la cantidad de mocks no es numerica', async () => {
        const response = await request(app)
            .get('/api/mocks/users')
            .query({ cantidad: 'abc' }) //? Enviamos un valor no numerico para la cantidad de mocks
            .expect(400)

        expect(response.body).to.have.property('status', 'error')
        expect(response.body).to.have.property('code', 'VALIDATION_ERROR')
        expect(response.body).to.have.property(
            'message',
            'El campo cantidad debe ser numerico'
        )
    })
})