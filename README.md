# Resto API

API REST para la gestion de un restaurante.

El proyecto adapta una consigna pensada originalmente para un dominio logistico al contexto de un restaurante. En lugar de trabajar con repartidores y entregas, el sistema se orienta a usuarios, productos del menu, empleados y pedidos o comandas.

## Adaptacion del dominio

| Dominio logistico | Dominio restaurante |
| --- | --- |
| Usuario | Usuario |
| Repartidor | Empleado |
| Pedido | Pedido |
| Entrega | Reserva o comanda |

Entidades principales del proyecto:

- `Usuarios`: usuarios del sistema.
- `Productos`: productos o platos del menu.
- `Empleados`: empleados del restaurante.
- `Pedidos`: pedidos o comandas del restaurante.

## Tecnologias utilizadas

- Node.js
- Express
- MongoDB
- Mongoose
- Dotenv
- JavaScript ES Modules

## Instalacion y setup

Clonar el repositorio:

```bash
git clone URL_DEL_REPOSITORIO
```

Entrar a la carpeta del proyecto:

```bash
cd resto-api
```

Instalar dependencias:

```bash
npm install
```

Crear un archivo `.env` en la raiz del proyecto:

```env
PORT=8080
MONGODB_URI=mongodb+srv://USUARIO:PASSWORD@CLUSTER.mongodb.net/resto-api?appName=Cluster0
NODE_ENV=development
```

Ejecutar el servidor:

```bash
npm run dev
```

Resultado esperado:

```text
Conexion con MongoDB establecida correctamente
Servidor ejecutandose en el puerto 8080
Entorno actual: development
```

## Variables de entorno

El proyecto usa `dotenv` para leer variables desde `.env`.

Variables requeridas:

- `PORT`: puerto donde corre la API.
- `MONGODB_URI`: URI de conexion a MongoDB Atlas o MongoDB local.
- `NODE_ENV`: entorno de ejecucion, por ejemplo `development`.

El archivo `.env.example` queda como referencia:

```env
PORT=
MONGODB_URI=
NODE_ENV=
```

El archivo `.env` no debe subirse a GitHub porque puede contener credenciales reales de MongoDB.

## Scripts disponibles

Modo desarrollo:

```bash
npm run dev
```

Modo normal:

```bash
npm start
```

## Arquitectura

El proyecto utiliza arquitectura por capas:

```text
Router
  |
  v
Controller
  |
  v
Service
  |
  v
Repository
  |
  v
Model
  |
  v
MongoDB
```

Responsabilidades:

- `Router`: define endpoints y los conecta con controllers.
- `Controller`: recibe la request, llama al service y devuelve la response.
- `Service`: contiene reglas de negocio y validaciones.
- `Repository`: encapsula las consultas a MongoDB.
- `Model`: define los esquemas de Mongoose.
- `Config`: centraliza variables de entorno y conexion a base de datos.
- `Constants`: centraliza roles, estados, categorias y puestos.

Esta separacion evita mezclar logica HTTP, logica de negocio y acceso a datos en un mismo archivo. Tambien facilita mantener y extender el proyecto en futuras pre-entregas.

## Estructura de carpetas

```text
src/
|-- config/
|-- constants/
|-- controllers/
|-- models/
|-- repositories/
|-- routes/
|-- services/
|-- app.js
`-- server.js
```

## Endpoints

Los endpoints se mantienen en ingles como convencion tecnica de API. Los datos enviados y guardados en el dominio del restaurante usan nombres en espanol.

### Productos

```http
GET    /api/products
GET    /api/products/available
GET    /api/products/disponibles
GET    /api/products/:pid
POST   /api/products
PUT    /api/products/:pid
DELETE /api/products/:pid
```

Body para crear producto:

```json
{
  "nombre": "Milanesa con pure",
  "descripcion": "Milanesa de carne con guarnicion",
  "categoria": "PLATOS_PRINCIPALES",
  "precio": 8500,
  "stock": 10
}
```

### Usuarios

```http
GET    /api/users
GET    /api/users/:uid
POST   /api/users
PUT    /api/users/:uid
DELETE /api/users/:uid
```

Body para crear usuario:

```json
{
  "nombre": "Agustin",
  "apellido": "Varela",
  "email": "agustin@example.com"
}
```

### Empleados

```http
GET    /api/employees
GET    /api/employees/activos
GET    /api/employees/:eid
POST   /api/employees
PUT    /api/employees/:eid
DELETE /api/employees/:eid
```

Body para crear empleado:

```json
{
  "nombre": "Laura",
  "apellido": "Gomez",
  "email": "laura@example.com",
  "telefono": "1122334455",
  "puesto": "MOZO"
}
```

Puestos disponibles:

- `MOZO`
- `COCINERO`
- `CAJERO`
- `ENCARGADO`

### Pedidos

```http
GET    /api/orders
GET    /api/orders/pendientes
GET    /api/orders/:oid
POST   /api/orders
PUT    /api/orders/:oid
DELETE /api/orders/:oid
```

Body para crear pedido:

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

Estados disponibles:

- `PENDIENTE`
- `EN_PREPARACION`
- `LISTO`
- `ENTREGADO`
- `CANCELADO`

## Prueba rapida

Con el servidor corriendo:

```http
GET http://localhost:8080/
```

Respuesta esperada:

```json
{
  "status": "success",
  "message": "Resto API funcionando correctamente"
}
```

## Validacion de configuracion

La aplicacion valida que existan:

- `PORT`
- `MONGODB_URI`
- `NODE_ENV`

Si falta una variable critica, la aplicacion no inicia y muestra un error descriptivo.

## Autor

Agustin Varela
