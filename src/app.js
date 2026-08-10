import express from 'express'
import employeesRouter from './routes/employees.routes.js'
import logsRouter from './routes/logs.routes.js'
import mocksRouter from './routes/mocks.routes.js'
import ordersRouter from './routes/orders.routes.js'
import productsRouter from './routes/products.routes.js'
import usersRouter from './routes/users.routes.js'
import { errorHandler, httpLogger, notFoundHandler } from './middlewares/index.js'

const app = express()

app.use(express.json())
app.use(httpLogger) //* agregamos el middleware de logging de peticiones HTTP

app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Resto API funcionando correctamente'
  })
})

app.use('/api/products', productsRouter)
app.use('/api/users', usersRouter)
app.use('/api/employees', employeesRouter)
app.use('/api/orders', ordersRouter)
app.use('/api/mocks', mocksRouter)
app.use('/api/logs', logsRouter) //* agregamos la ruta para probar los logs

app.use(notFoundHandler)
app.use(errorHandler)

export default app