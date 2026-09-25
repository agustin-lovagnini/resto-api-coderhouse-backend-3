import request from 'supertest'
import { expect } from 'chai'
import app from '../src/app.js'
import {
    clearTestDatabase,
    closeTestDatabase,
    connectTestDatabase
} from './setup.js'

//! Agrupa todos los casos relacionados con Products
describe('Products endpoints', () => {
    let productoId //? Variable para almacenar el ID del producto creado durante los tests
    const nombreProducto = `Producto Test ${Date.now()}` //? Nombre único para el producto de prueba

    //! Configuración y limpieza de la base de datos antes y después de los tests
    before(async () => {
        await connectTestDatabase()
        await clearTestDatabase()
    })

    after(async () => {
        await clearTestDatabase()
        await closeTestDatabase()
    })

    //! Caso de prueba: Crear un producto correctamente
    it('debe crear un producto correctamente con datos validos', async () => {
        const response = await request(app)
            .post('/api/products')
            .send({
                nombre: nombreProducto,
                descripcion: 'Producto creado durante el test',
                categoria: 'PLATOS_PRINCIPALES',
                precio: 5000,
                stock: 10
            })
            .expect(201)

        expect(response.body).to.have.property('status', 'success')
        expect(response.body).to.have.property('payload')
        expect(response.body.payload).to.have.property('_id')
        expect(response.body.payload).to.have.property('nombre', nombreProducto)
        expect(response.body.payload).to.have.property('estado', 'DISPONIBLE')

        productoId = response.body.payload._id
    })

    //! Caso de prueba: Obtener un listado paginado de productos
    it('debe obtener un listado paginado de productos', async () => {
        const response = await request(app)
            .get('/api/products')
            .query({ page: 1, limit: 10 })
            .expect(200)

        expect(response.body).to.have.property('status', 'success')
        expect(response.body.payload).to.be.an('array')
        expect(response.body).to.have.property('pagination')
        expect(response.body.pagination).to.have.property('page', 1)
        expect(response.body.pagination).to.have.property('limit', 10)
        expect(response.body.pagination).to.have.property('totalDocs', 1)
        expect(response.body.pagination).to.have.property('totalPages', 1)
    })

    //! Caso de prueba: Obtener un producto por ID
    it('debe obtener un producto por ID', async () => {
        const response = await request(app)
            .get(`/api/products/${productoId}`)
            .expect(200)

        expect(response.body).to.have.property('status', 'success')
        expect(response.body.payload).to.have.property('_id', productoId)
        expect(response.body.payload).to.have.property('nombre', nombreProducto)
    })

    //! Caso de prueba: Actualizar un producto correctamente
    it('debe actualizar un producto correctamente', async () => {
        const response = await request(app)
            .put(`/api/products/${productoId}`)
            .send({ //? Actualizamos el stock a 0 para probar el cambio de estado
                stock: 0
            })
            .expect(200)

        expect(response.body).to.have.property('status', 'success')
        expect(response.body.payload).to.have.property('stock', 0)
        expect(response.body.payload).to.have.property('estado', 'SIN_STOCK')
    })

    //! Caso de prueba: Manejo de errores al crear un producto con datos inválidos
    it('debe responder 400 al crear un producto con datos invalidos', async () => {
        const response = await request(app)
            .post('/api/products')
            .send({ //? Intentamos crear un producto con precio negativo
                precio: -1,
                stock: 10,
                categoria: 'PLATOS_PRINCIPALES'
            })
            .expect(400)

        expect(response.body).to.have.property('status', 'error')
        expect(response.body).to.have.property('code', 'VALIDATION_ERROR')
        expect(response.body).to.have.property('message')
    })

    //! Caso de prueba: Manejo de errores al consultar un producto inexistente
    it('debe responder 404 al consultar un producto inexistente', async () => {
        const response = await request(app)
            .get('/api/products/64f8a8c2b9a1f23d45678910') //? ID de producto que no existe
            .expect(404)

        expect(response.body).to.have.property('status', 'error')
        expect(response.body).to.have.property('code', 'NOT_FOUND_ERROR')
        expect(response.body).to.have.property('message', 'Producto no encontrado')
    })

    //! Caso de prueba: Eliminar un producto correctamente
    it('debe eliminar un producto correctamente', async () => {
        const response = await request(app)
            .delete(`/api/products/${productoId}`)
            .expect(200)

        expect(response.body).to.have.property('status', 'success')
        expect(response.body.payload).to.have.property('_id', productoId)
    })
})