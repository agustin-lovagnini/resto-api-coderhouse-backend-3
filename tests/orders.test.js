import request from 'supertest'
import { expect } from 'chai'
import app from '../src/app.js'
import {
    clearTestDatabase,
    closeTestDatabase,
    connectTestDatabase
} from './setup.js'

describe('Orders endpoints', () => {
    let empleadoId //* Guardamos el ID del empleado creado para usarlo en los tests de pedidos
    let productoId //* Guardamos el ID del producto creado para usarlo en los tests de pedidos
    let pedidoId //* Guardamos el ID del pedido creado para usarlo en los siguientes tests

    before(async () => {
        await connectTestDatabase()
        await clearTestDatabase()

        //! Creamos un empleado y un producto para poder crear pedidos
        const empleadoResponse = await request(app)
            .post('/api/employees')
            .send({
                nombre: 'Empleado',
                apellido: 'Test',
                email: `empleado.test.${Date.now()}@mail.com`,
                telefono: '1122334455',
                puesto: 'MOZO',
                activo: true
            })
            .expect(201)

        empleadoId = empleadoResponse.body.payload._id //? Guardamos el ID del empleado creado para usarlo en los tests de pedidos

        //! Creamos un producto para poder crear pedidos
        const productoResponse = await request(app)
            .post('/api/products')
            .send({
                nombre: `Producto Test ${Date.now()}`,
                descripcion: 'Producto creado para tests funcionales',
                categoria: 'PLATOS_PRINCIPALES',
                precio: 2500,
                stock: 10
            })
            .expect(201)

        productoId = productoResponse.body.payload._id //? Guardamos el ID del producto creado para usarlo en los tests de pedidos
    })

    after(async () => {
        await clearTestDatabase()
        await closeTestDatabase()
    })

    //! Tests funcionales para los endpoints de pedidos
    it('debe obtener un listado de pedidos', async () => {
        const response = await request(app)
            .get('/api/orders')
            .expect(200)

        expect(response.body).to.have.property('status', 'success')
        expect(response.body).to.have.property('payload')
        expect(response.body.payload).to.be.an('array')
    })

    //! Test para crear un pedido correctamente
    it('debe crear un pedido correctamente con datos validos', async () => {
        const response = await request(app)
            .post('/api/orders')
            .send({
                mesa: 4,
                empleado: empleadoId,
                productos: [
                    {
                        producto: productoId,
                        cantidad: 2
                    }
                ],
                observaciones: 'Pedido de prueba'
            })
            .expect(201)

        expect(response.body).to.have.property('status', 'success')
        expect(response.body).to.have.property('payload')
        expect(response.body.payload).to.have.property('_id')
        expect(response.body.payload).to.have.property('mesa', 4)
        expect(response.body.payload).to.have.property('estado', 'PENDIENTE')
        expect(response.body.payload).to.have.property('total', 5000) //? 2 productos a 2500 cada uno
        expect(response.body.payload.productos).to.be.an('array')
        expect(response.body.payload.productos).to.have.lengthOf(1)

        pedidoId = response.body.payload._id //? Guardamos el ID del pedido creado para usarlo en los siguientes tests
    })

    //! Test para obtener un pedido por ID
    it('debe obtener un pedido por ID', async () => {
        const response = await request(app)
            .get(`/api/orders/${pedidoId}`)
            .expect(200)

        expect(response.body).to.have.property('status', 'success')
        expect(response.body).to.have.property('payload')
        expect(response.body.payload).to.have.property('_id', pedidoId) //? Comprobamos que el ID del pedido obtenido sea el mismo que el del pedido creado
        expect(response.body.payload).to.have.property('mesa', 4) //? Comprobamos que la mesa del pedido obtenido sea la misma que la del pedido creado
        expect(response.body.payload.productos).to.be.an('array')
    })

    //! Test para actualizar el estado de un pedido
    it('debe actualizar el estado de un pedido', async () => {
        const response = await request(app)
            .put(`/api/orders/${pedidoId}`)
            .send({
                estado: 'EN_PREPARACION'
            })
            .expect(200)

        expect(response.body).to.have.property('status', 'success')
        expect(response.body).to.have.property('payload')
        expect(response.body.payload).to.have.property('estado', 'EN_PREPARACION')
    })

    //! Test para verificar que se responde con 400 si el estado del pedido no es valido
    it('debe responder 400 si el estado del pedido no es valido', async () => {
        const response = await request(app)
            .put(`/api/orders/${pedidoId}`)
            .send({
                estado: 'ESTADO_INVENTADO'
            })
            .expect(400)

        expect(response.body).to.have.property('status', 'error')
        expect(response.body).to.have.property('code', 'VALIDATION_ERROR')
        expect(response.body).to.have.property(
            'message',
            'El estado del pedido no es valido'
        )
    })

    //! Test para verificar que se responde con 400 si los datos del pedido son incompletos
    it('debe responder 400 al crear un pedido con datos incompletos', async () => {
        const response = await request(app)
            .post('/api/orders')
            .send({
                mesa: 4 //? Falta el empleado y los productos
            })
            .expect(400)

        expect(response.body).to.have.property('status', 'error')
        expect(response.body).to.have.property('code', 'VALIDATION_ERROR')
        expect(response.body).to.have.property('message')
    })

    //! Test para verificar que se responde con 404 al consultar un pedido inexistente
    it('debe responder 404 al consultar un pedido inexistente', async () => {
        const response = await request(app)
            .get('/api/orders/64f8a8c2b9a1f23d45678910') //? ID de pedido inexistente
            .expect(404)

        expect(response.body).to.have.property('status', 'error')
        expect(response.body).to.have.property('code', 'NOT_FOUND_ERROR')
        expect(response.body).to.have.property('message', 'Pedido no encontrado')
    })
})