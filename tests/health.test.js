import request from 'supertest' //* Importa la librería supertest para realizar pruebas de integración en endpoints de la API
import { expect } from 'chai' //* Importa la librería chai para realizar aserciones en las pruebas
import app from '../src/app.js' //* Importa la aplicación Express para poder realizar las pruebas de integración en los endpoints

//! Describe el conjunto de pruebas para el endpoint de salud de la API
describe('Health endpoint', () => {
    it('debe informar que la API esta disponible', async () => {
        const response = await request(app) //? Realiza una solicitud GET al endpoint de salud de la API
            .get('/api/health')
            .expect(200)

        expect(response.body).to.have.property('status', 'success')
        expect(response.body).to.have.property('api', 'Resto API')
        expect(response.body).to.have.property('environment', 'test')
        expect(response.body).to.have.property('uptime')
        expect(response.body.uptime).to.be.a('number')
        expect(response.body).to.have.property('timestamp')
        expect(new Date(response.body.timestamp).toString()).to.not.equal(
            'Invalid Date'
        )
    })
})