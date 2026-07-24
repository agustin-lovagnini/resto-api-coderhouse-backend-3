# Resto API

API REST para la gestion de un restaurante. Permite trabajar con usuarios, productos del menu, empleados, pedidos y datos mock para pruebas.

## Tecnologias

- Node.js
- Express
- MongoDB
- Mongoose
- Dotenv
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
Conexion con MongoDB establecida correctamente
Servidor ejecutandose en el puerto 8080
Entorno actual: development
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

Los mocks generan datos falsos para probar la API.

```http
GET    /api/mocks/users
GET    /api/mocks/employees
GET    /api/mocks/orders
POST   /api/mocks/populate
```

Los endpoints `GET` solo generan datos y no guardan en MongoDB:

```http
GET http://localhost:8080/api/mocks/users?cantidad=5
GET http://localhost:8080/api/mocks/employees?cantidad=5
GET http://localhost:8080/api/mocks/orders?cantidad=3
```

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

## Probar con Postman

1. Levantar el servidor con `npm run dev`.
2. Crear una request en Postman.
3. Elegir el metodo `GET` o `POST`.
4. Usar una URL, por ejemplo `http://localhost:8080/api/mocks/users?cantidad=5`.
5. Para `POST /api/mocks/populate`, ir a `Body`, elegir `raw`, formato `JSON` y escribir el body.
6. Presionar `Send`.

## Validacion de configuracion

La aplicacion no inicia si falta una variable critica como `PORT`, `MONGODB_URI` o `NODE_ENV`.

## Repositorio

```text
https://github.com/agustin-lovagnini/resto-api-coderhouse-backend-3
```

El proyecto no incluye `node_modules`. Las dependencias se instalan con:

```bash
npm install
```
