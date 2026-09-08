import request from 'supertest'
import { expect } from 'chai'
import app from '../src/app.js'
import {
    clearTestDatabase,
    closeTestDatabase,
    connectTestDatabase
} from './setup.js'

describe('Employees endpoints', () => {
    before(async () => {
        await connectTestDatabase()
        await clearTestDatabase()
    })

    after(async () => {
        await clearTestDatabase()
        await closeTestDatabase()
    })

    it('debe crear un empleado correctamente con datos validos', async () => {
        const response = await request(app)
            .post('/api/employees')
            .send({
                nombre: 'Empleado',
                apellido: 'Paginado',
                email: `empleado.paginado.${Date.now()}@mail.com`,
                telefono: '1122334455',
                puesto: 'MOZO',
                activo: true
            })
            .expect(201)

        expect(response.body).to.have.property('status', 'success')
        expect(response.body).to.have.property('payload')
        expect(response.body.payload).to.have.property('_id')
        expect(response.body.payload).to.have.property('nombre', 'Empleado')
        expect(response.body.payload).to.have.property('puesto', 'MOZO')
    })

    it('debe obtener un listado paginado de empleados', async () => {
        const response = await request(app)
            .get('/api/employees')
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
})
