import request from 'supertest'
import { expect } from 'chai'
import app from '../src/app.js'
import {
    clearTestDatabase,
    closeTestDatabase,
    connectTestDatabase,
    removeTestFile
} from './setup.js'

describe('Users endpoints', () => {
    before(async () => {
        await connectTestDatabase()
        await clearTestDatabase()
    })

    after(async () => {
        await removeTestFile(uploadedDocumentPath) //? Eliminamos el archivo de prueba creado durante los tests
        await clearTestDatabase() //? Limpiamos la base de datos de testing después de los tests
        await closeTestDatabase() //? Cerramos la conexión con la base de datos de testing
    })

    let usuarioDocumentoId //? guarda el ID del usuario al que subimos archivos
    let uploadedDocumentPath //? guarda la ruta del PDF creado por Multer

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

        usuarioDocumentoId = usuarioResponse.body.payload._id //? Guardamos el ID del usuario creado para usarlo en la subida de documentos

        const response = await request(app)
            .post(`/api/users/${usuarioDocumentoId}/documents`)
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
        uploadedDocumentPath = response.body.payload.documentos[0].ruta //? Guardamos la ruta del PDF creado por Multer para eliminarlo después de los tests
    })

    //! Test para verificar que se maneja correctamente el error al subir un documento sin archivo
    it('debe responder 400 si no se envia un documento', async () => {
        const response = await request(app)
            .post(`/api/users/${usuarioDocumentoId}/documents`)
            .field('tipoDocumento', 'DNI')
            .expect(400)

        expect(response.body).to.have.property('status', 'error')
        expect(response.body).to.have.property('code', 'FILE_REQUIRED')
        expect(response.body).to.have.property(
            'message',
            'El archivo es obligatorio'
        )
    })

    //! Test para verificar que se maneja correctamente el error al subir un documento con tipo de archivo no permitido
    it('debe responder 400 si el tipo de archivo no esta permitido', async () => {
        const response = await request(app)
            .post(`/api/users/${usuarioDocumentoId}/documents`)
            .field('tipoDocumento', 'DNI')
            .attach('documento', Buffer.from('archivo de texto'), {
                filename: 'documento.txt',
                contentType: 'text/plain'
            })
            .expect(400)

        expect(response.body).to.have.property('status', 'error')
        expect(response.body).to.have.property('code', 'INVALID_FILE_TYPE')
        expect(response.body).to.have.property('message')
    })

    //! Test para verificar que se maneja correctamente el error al subir un documento que supera los 5 MB
    it('debe responder 400 si el archivo supera los 5 MB', async () => {
        const oversizedFile = Buffer.alloc(5 * 1024 * 1024 + 1)

        const response = await request(app)
            .post(`/api/users/${usuarioDocumentoId}/documents`)
            .field('tipoDocumento', 'DNI')
            .attach('documento', oversizedFile, {
                filename: 'documento-grande.pdf',
                contentType: 'application/pdf'
            })
            .expect(400)

        expect(response.body).to.have.property('status', 'error')
        expect(response.body).to.have.property('code', 'FILE_TOO_LARGE')
        expect(response.body).to.have.property(
            'message',
            'El archivo supera el tamaño maximo permitido'
        )
    })
})
