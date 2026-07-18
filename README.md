# Resto API - Pre-entrega 1

API backend para la gestion de productos y usuarios de un restaurante.

El proyecto utiliza Node.js, Express, MongoDB, Mongoose y dotenv. La estructura esta organizada por capas para separar responsabilidades.

## Tecnologias

- Node.js
- Express
- MongoDB Atlas
- Mongoose
- dotenv
- ES Modules

## Instalacion

```bash
npm install
```

## Variables de entorno

Crear un archivo `.env` en la raiz del proyecto:

```env
PORT=8080
MONGODB_URI=mongodb+srv://USUARIO:PASSWORD@CLUSTER.mongodb.net/resto-api?appName=Cluster0
NODE_ENV=development
```

El archivo `.env.example` indica que variables necesita el proyecto:

```env
PORT=
MONGODB_URI=
NODE_ENV=
```

El archivo `.env` no se sube a GitHub porque contiene datos sensibles.

## Ejecucion

```bash
npm run dev
```

Resultado esperado:

```text
Conexion con MongoDB establecida correctamente
Servidor ejecutandose en el puerto 8080
Entorno actual: development
```

## Arquitectura

El flujo de la aplicacion es:

```text
Router -> Controller -> Service -> Repository -> Model -> MongoDB
```

Responsabilidades:

- Router: conecta endpoints con controllers.
- Controller: recibe `req`, usa `res` y llama al service.
- Service: contiene reglas y validaciones de negocio.
- Repository: encapsula el acceso a MongoDB.
- Model: define los esquemas de Mongoose.
- Config: centraliza variables de entorno y conexion a base de datos.
- Constants: centraliza valores fijos del dominio.

## Estructura

```text
src/
  config/
  constants/
  controllers/
  models/
  repositories/
  routes/
  services/
  app.js
  server.js
```

## Entidades

### Products

Campos principales:

- `nombre`
- `descripcion`
- `categoria`
- `precio`
- `stock`
- `estado`

Endpoints:

```http
GET    /api/products
GET    /api/products/available
GET    /api/products/disponibles
GET    /api/products/:pid
POST   /api/products
PUT    /api/products/:pid
DELETE /api/products/:pid
```

### Users

Campos principales:

- `nombre`
- `apellido`
- `email`
- `rol`

Endpoints:

```http
GET    /api/users
GET    /api/users/:uid
POST   /api/users
PUT    /api/users/:uid
DELETE /api/users/:uid
```

## Validacion de entorno

La aplicacion valida estas variables:

- `PORT`
- `MONGODB_URI`
- `NODE_ENV`

Si falta una variable critica, la aplicacion no arranca y muestra un error descriptivo.
