# Resto API

API REST para la gestion de un restaurante. Permite trabajar con usuarios, productos del menu, empleados, pedidos y datos mock para pruebas.

## Tecnologias

- Node.js
- Express
- MongoDB
- Mongoose
- Dotenv
- Winston
- Winston Daily Rotate File
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
```

## Variables de entorno

- `PORT`: puerto donde corre la API.
- `MONGODB_URI`: conexion a MongoDB.
- `NODE_ENV`: entorno de ejecucion.

El archivo `.env` no se sube a GitHub. Como referencia se incluye `.env.example`.

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

## Endpoints principales

### Products

```http
GET    /api/products
GET    /api/products/available
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
GET    /api/users
GET    /api/users/:uid
POST   /api/users
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

### Employees

```http
GET    /api/employees
GET    /api/employees/activos
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
GET    /api/orders
GET    /api/orders/pendientes
GET    /api/orders/:oid
POST   /api/orders
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

## Endpoints de mocking

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

El proyecto no incluye `node_modules`, `.env` ni archivos generados dentro de `logs/`. Las dependencias se instalan con:

```bash
npm install
```
