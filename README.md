# Resto API

API REST para la gestion de un restaurante. Permite trabajar con usuarios, productos del menu, empleados, pedidos y datos mock para pruebas.

## Tecnologias

- Node.js
- Express
- MongoDB
- Mongoose
- Dotenv
- Multer
- Winston
- Winston Daily Rotate File
- Swagger / OpenAPI
- Mocha
- Chai
- Supertest
- Cross-env
- JavaScript ES Modules

## Instalacion

```bash
git clone https://github.com/agustin-lovagnini/resto-api-coderhouse-backend-3.git
cd resto-api-coderhouse-backend-3
npm install
```

Crear un archivo `.env` en la raiz del proyecto:

```env
PORT=8080
MONGODB_URI=mongodb+srv://USUARIO:PASSWORD@CLUSTER.mongodb.net/resto-api?appName=Cluster0
NODE_ENV=development
LOG_LEVEL=debug
UPLOADS_DIR=uploads
```

Ejecutar en desarrollo:

```bash
npm run dev
```

Si inicia bien, la consola muestra:

```text
2026-08-10 12:00:00 [info] Conexion con MongoDB establecida correctamente
2026-08-10 12:00:00 [info] Servidor ejecutandose en el puerto 8080
2026-08-10 12:00:00 [info] Entorno actual: development
```

## Scripts

```bash
npm run dev
npm start
npm test
```

## Documentacion Swagger

La API expone documentacion interactiva con Swagger UI en:

```text
http://localhost:8080/api/docs
```

Para verla, primero levantar el servidor:

```bash
npm run dev
```

Swagger permite consultar y probar los endpoints desde el navegador usando el boton `Try it out` y luego `Execute`.

Swagger queda disponible tambien en `NODE_ENV=production` como documentacion publica de la API.

Modulos documentados:

- `Users`: gestion de usuarios.
- `Products`: gestion de productos del menu.
- `Employees`: gestion de empleados del restaurante.
- `Orders`: gestion de pedidos.
- `Health`: estado basico de disponibilidad de la API.
- `Mocks`: generacion de datos falsos e insercion de datos de prueba.
- `Logger`: endpoint tecnico para validar los niveles de log.

La configuracion principal de Swagger esta separada de las rutas en:

```text
src/config/swagger.config.js
```

Los endpoints se documentan en los archivos de rutas dentro de:

```text
src/routes/
```

Schemas reutilizables definidos:

- `User`
- `Product`
- `Employee`
- `Order`
- `OrderProduct`
- `SuccessResponse`
- `ErrorResponse`

Los errores documentados reflejan el manejo centralizado de la API:

- `400 VALIDATION_ERROR`: datos invalidos, cantidades invalidas en mocks o estado invalido en pedidos.
- `404 NOT_FOUND_ERROR`: recurso no encontrado.
- `409 DUPLICATE_ERROR`: recurso duplicado.
- `500 INTERNAL_SERVER_ERROR`: error interno del servidor.

## Variables de entorno

- `PORT`: puerto donde corre la API.
- `MONGODB_URI`: conexion a MongoDB.
- `NODE_ENV`: entorno de ejecucion.
- `LOG_LEVEL`: nivel minimo de logs (`fatal`, `error`, `warning`, `info`, `http`, `debug`). Si no se define, usa `info` en produccion y `debug` en desarrollo/testing.
- `UPLOADS_DIR`: carpeta base para guardar archivos subidos. Si no se define, usa `uploads`.

El archivo `.env` no se sube a GitHub. Como referencia se incluye `.env.example`.

Para ejecutar tests se usa un entorno separado con `.env.test`:

```env
PORT=8081
MONGODB_URI=mongodb+srv://USUARIO:PASSWORD@CLUSTER.mongodb.net/resto-api-test?retryWrites=true&w=majority
NODE_ENV=test
LOG_LEVEL=debug
UPLOADS_DIR=uploads
```

El archivo `.env.test` tampoco se sube a GitHub. Como referencia se incluye `.env.test.example`.

## Arquitectura

El proyecto usa arquitectura por capas:

- `Router`: define las rutas.
- `Controller`: recibe la request y devuelve la response.
- `Service`: contiene validaciones y logica de negocio.
- `Repository`: consulta o modifica MongoDB.
- `Model`: define los esquemas de Mongoose.

Esta separacion ayuda a mantener el proyecto ordenado y facilita agregar nuevas funcionalidades.

## Manejo centralizado de errores

La API usa una capa centralizada para manejar errores de forma uniforme.

Flujo:

```text
Service -> AppError -> Controller next(error) -> errorHandler
```

- Los `Services` detectan errores de negocio y lanzan errores personalizados.
- Los `Controllers` mantienen las respuestas exitosas y derivan errores con `next(error)`.
- El middleware `errorHandler` responde todos los errores con el mismo formato.
- El middleware `notFoundHandler` maneja rutas inexistentes.

Formato de error:

```json
{
  "status": "error",
  "code": "VALIDATION_ERROR",
  "message": "El email del usuario es obligatorio"
}
```

Tabla de errores:

| Codigo | Status HTTP | Uso |
| --- | --- | --- |
| `VALIDATION_ERROR` | 400 | Datos obligatorios faltantes o valores invalidos |
| `NOT_FOUND_ERROR` | 404 | Recurso inexistente |
| `DUPLICATE_ERROR` | 409 | Recurso duplicado |
| `INTERNAL_SERVER_ERROR` | 500 | Error inesperado del servidor |

## Logging y monitoreo basico

La API usa Winston como logger centralizado. Los logs incluyen timestamp, nivel y mensaje.

Niveles configurados:

| Nivel | Uso |
| --- | --- |
| `fatal` | Fallas criticas, por ejemplo error al conectar MongoDB |
| `error` | Errores inesperados o fallas de insercion |
| `warning` | Errores controlados, validaciones o rutas inexistentes |
| `info` | Eventos importantes, como servidor iniciado o mocks generados |
| `http` | Metodo, URL y status final de cada request |
| `debug` | Informacion de desarrollo |

Ejemplo:

```text
2026-08-10 12:04:19 [info] Servidor ejecutandose en el puerto 8080
```

El logger esta configurado en:

```text
src/config/logger.config.js
```

Registra principalmente:

- inicio del servidor;
- conexion a MongoDB;
- rutas inexistentes;
- errores controlados e inesperados;
- mocks generados o insertados;
- pedidos creados, actualizados o eliminados;
- requests HTTP.

Los errores importantes se guardan en:

```text
logs/
```

Formato de archivo:

```text
logs/error-YYYY-MM-DD.log
```

Rotacion configurada:

- crear archivos por fecha;
- maximo 5 MB por archivo;
- conservar logs por 14 dias;
- guardar en archivo solo niveles `error` y `fatal`.

La carpeta `logs/` esta en `.gitignore`, por lo tanto no se sube al repositorio.

Endpoint de prueba:

```http
GET /api/logs/test
```

Respuesta esperada:

```json
{
  "status": "success",
  "message": "Logs de prueba generados correctamente"
}
```

## Carga de archivos

La API permite subir archivos con Multer usando `multipart/form-data`. Los archivos se guardan en carpetas del servidor y en MongoDB se registran solo sus metadatos: nombre original, nombre generado, ruta, tipo MIME, tamaño, tipo de documento y fecha de carga.

Carpetas usadas:

```text
uploads/users/documents
uploads/orders/receipts
```

La carpeta `uploads/` esta en `.gitignore`, por lo tanto los archivos subidos no se versionan en GitHub.

La carpeta base se configura con `UPLOADS_DIR`. Estos archivos no se consideran almacenamiento permanente: en produccion deberian respaldarse con un volumen externo o un servicio de almacenamiento dedicado.

Tipos de archivo permitidos:

```text
image/jpeg
image/png
image/webp
application/pdf
```

Tamaño maximo permitido:

```text
5 MB
```

Tipos de documento para usuarios:

```text
DNI
CARNET_SANITARIO
CONSTANCIA
OTRO
```

Tipos de comprobante para pedidos:

```text
TICKET
PAGO
ENTREGA
OTRO
```

## Endpoints principales

Los listados principales usan paginacion para evitar respuestas demasiado grandes. Si no se indican parametros, la API usa `page=1` y `limit=10`. El limite maximo permitido es `100`.

### Health

```http
GET    /api/health
```

Respuesta esperada:

```json
{
  "status": "success",
  "api": "Resto API",
  "environment": "development",
  "uptime": 120.5,
  "timestamp": "2026-09-08T00:50:44.433Z"
}
```

### Products

```http
GET    /api/products
GET    /api/products/available
GET    /api/products/disponibles
GET    /api/products/:pid
POST   /api/products
PUT    /api/products/:pid
DELETE /api/products/:pid
```

Ejemplo:

```json
{
  "nombre": "Milanesa con pure",
  "descripcion": "Milanesa de carne con guarnicion",
  "categoria": "PLATOS_PRINCIPALES",
  "precio": 8500,
  "stock": 10
}
```

### Users

```http
GET    /api/users?page=1&limit=10
GET    /api/users/:uid
POST   /api/users
POST   /api/users/:uid/documents
PUT    /api/users/:uid
DELETE /api/users/:uid
```

Ejemplo:

```json
{
  "nombre": "Agustin",
  "apellido": "Varela",
  "email": "agustin@example.com"
}
```

Ejemplo para subir un documento de usuario:

```bash
curl -X POST http://localhost:8080/api/users/ID_DEL_USUARIO/documents \
  -F "tipoDocumento=DNI" \
  -F "documento=@prueba-documento.pdf;type=application/pdf"
```

### Employees

```http
GET    /api/employees?page=1&limit=10
GET    /api/employees/activos?page=1&limit=10
GET    /api/employees/:eid
POST   /api/employees
PUT    /api/employees/:eid
DELETE /api/employees/:eid
```

Ejemplo:

```json
{
  "nombre": "Laura",
  "apellido": "Gomez",
  "email": "laura@example.com",
  "telefono": "1122334455",
  "puesto": "MOZO"
}
```

### Orders

```http
GET    /api/orders?page=1&limit=10
GET    /api/orders?page=1&limit=10&estado=PENDIENTE
GET    /api/orders/pendientes?page=1&limit=10
GET    /api/orders/:oid
POST   /api/orders
POST   /api/orders/:oid/receipts
PUT    /api/orders/:oid
DELETE /api/orders/:oid
```

Ejemplo:

```json
{
  "mesa": 4,
  "empleado": "ID_DEL_EMPLEADO",
  "productos": [
    {
      "producto": "ID_DEL_PRODUCTO",
      "cantidad": 2
    }
  ],
  "observaciones": "Sin sal"
}
```

Ejemplo para subir un comprobante de pedido:

```bash
curl -X POST http://localhost:8080/api/orders/ID_DEL_PEDIDO/receipts \
  -F "tipoDocumento=TICKET" \
  -F "comprobante=@ticket.pdf;type=application/pdf"
```

## Endpoints de mocking

Estos endpoints son herramientas internas para desarrollo y testing. En `NODE_ENV=production` no se montan en la aplicacion.

Los mocks generan datos falsos para probar la API usando `@faker-js/faker`.

```http
GET    /api/mocks/users
GET    /api/mocks/employees
GET    /api/mocks/orders
POST   /api/mocks/populate
```

### Logs

```http
GET    /api/logs/test
```

Este endpoint es una herramienta de validacion tecnica del logger. No representa una funcionalidad de negocio del restaurante.
En `NODE_ENV=production` no se monta en la aplicacion.

Los endpoints `GET` solo generan datos en memoria y no guardan en MongoDB:

```http
GET http://localhost:8080/api/mocks/users?cantidad=5
GET http://localhost:8080/api/mocks/employees?cantidad=5
GET http://localhost:8080/api/mocks/orders?cantidad=3
```

La query `cantidad` es obligatoria y debe ser:

- numerica;
- finita;
- entera;
- mayor a 0;
- menor o igual a 100.

Datos que se pueden generar:

- `users`: usuarios falsos.
- `employees`: empleados falsos.
- `orders`: pedidos falsos.

Para insertar datos falsos en MongoDB:

```http
POST http://localhost:8080/api/mocks/populate
```

Body:

```json
{
  "users": 5,
  "employees": 5,
  "orders": 3
}
```

Tambien se puede cargar solo una entidad:

```json
{
  "users": 10
}
```

Para guardar `orders`, primero deben existir productos y empleados activos, porque los pedidos usan referencias reales.

Ejemplo de error de validacion:

```http
GET http://localhost:8080/api/mocks/users?cantidad=abc
```

Respuesta esperada:

```json
{
  "status": "error",
  "code": "VALIDATION_ERROR",
  "message": "El campo cantidad debe ser numerico"
}
```

## Probar con Swagger

1. Levantar el servidor con `npm run dev`.
2. Abrir `http://localhost:8080/api/docs`.
3. Desplegar un modulo, por ejemplo `Users`.
4. Abrir un endpoint, por ejemplo `GET /api/users`.
5. Presionar `Try it out`.
6. Completar parametros o body si corresponde.
7. Presionar `Execute`.
8. Revisar `Server response`, `Code` y `Response body`.

Ejemplo para crear un usuario desde Swagger:

```json
{
  "nombre": "Juan",
  "apellido": "Perez",
  "email": "juan.perez@mail.com",
  "rol": "USUARIO"
}
```

Si se vuelve a usar el mismo email, la API responde un error `409 DUPLICATE_ERROR`.

## Testing funcional

La API cuenta con una suite inicial de tests funcionales usando:

- `Mocha`: organiza y ejecuta los tests.
- `Chai`: valida status, estructura del body y propiedades importantes.
- `Supertest`: realiza peticiones HTTP contra la app Express sin levantar manualmente un puerto.
- `Cross-env`: permite ejecutar `NODE_ENV=test` de forma compatible entre sistemas operativos.

Ejecutar los tests:

```bash
npm test
```

El script de testing usa:

```json
"test": "cross-env NODE_ENV=test mocha \"tests/**/*.test.js\" --timeout 10000"
```

Esto hace que la configuracion cargue `.env.test` y use una base separada, por ejemplo:

```text
resto-api-test
```

Los datos creados durante los tests son controlados y descartables. La suite conecta a MongoDB de testing, limpia las colecciones antes o despues de cada grupo y cierra la conexion al finalizar.

Modulos cubiertos:

- `Swagger`: acceso a `/api/docs` y carga de Swagger UI.
- `Logger`: acceso a `/api/logs/test`.
- `Users`: listado paginado, creacion correcta, datos incompletos, usuario inexistente y carga de documento.
- `Employees`: creacion correcta y listado paginado.
- `Mocks`: generacion correcta y errores por cantidad faltante o invalida.
- `Orders`: listado paginado, filtro por estado, creacion con empleado/producto controlados, carga de comprobante, consulta por ID, actualizacion de estado, estado invalido, datos incompletos y pedido inexistente.
- `Not found`: ruta inexistente con formato de error centralizado.

Los tests validan:

- status HTTP esperado;
- `status` del body (`success` o `error`);
- `payload` en respuestas exitosas;
- `code` y `message` en respuestas de error;
- estructura de arrays y propiedades importantes.

Ejemplo de salida esperada:

```text
24 passing
```

## Docker

El proyecto incluye un `Dockerfile` para construir una imagen de la API y un `.dockerignore` para evitar copiar archivos innecesarios o sensibles dentro de la imagen.

Construir la imagen:

```bash
docker build -t resto-api .
```

Ejecutar el contenedor usando variables desde `.env`:

```bash
docker run --env-file .env -p 8080:8080 --name resto-api-container resto-api
```

La API queda disponible en:

```text
http://localhost:8080
```

Endpoints recomendados para probar el contenedor:

```text
http://localhost:8080/api/health
http://localhost:8080/api/docs
http://localhost:8080/api/users?page=1&limit=10
```

Detener el contenedor:

```bash
docker stop resto-api-container
```

Si se quiere volver a usar el mismo nombre de contenedor despues de detenerlo, se puede eliminar el contenedor detenido:

```bash
docker rm resto-api-container
```

Archivos y carpetas que no deben copiarse a la imagen:

- `node_modules`
- `.env`
- `.env.test`
- `.git`
- `logs`
- `uploads`
- `coverage`
- archivos temporales o logs generados

Los uploads se configuran con `UPLOADS_DIR`. En Docker se recomienda usar un volumen si se quiere conservar archivos subidos fuera del ciclo de vida del contenedor.

## Probar con Postman

1. Levantar el servidor con `npm run dev`.
2. Crear una request en Postman.
3. Elegir el metodo `GET` o `POST`.
4. Usar una URL, por ejemplo `http://localhost:8080/api/mocks/users?cantidad=5`.
5. Para `POST /api/mocks/populate`, ir a `Body`, elegir `raw`, formato `JSON` y escribir el body.
6. Para probar el logger, usar `GET http://localhost:8080/api/logs/test`.
7. Presionar `Send`.

## Validacion de configuracion

La aplicacion no inicia si falta una variable critica como `PORT`, `MONGODB_URI` o `NODE_ENV`.

## Repositorio

```text
https://github.com/agustin-lovagnini/resto-api-coderhouse-backend-3
```

El proyecto no incluye `node_modules`, `.env`, archivos generados dentro de `logs/` ni archivos cargados dentro de `uploads/`. Las dependencias se instalan con:

```bash
npm install
```
