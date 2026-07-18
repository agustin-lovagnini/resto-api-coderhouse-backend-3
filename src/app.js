import express from 'express'
import productsRouter from './routes/products.routes.js'
import usersRouter from './routes/users.routes.js'

const app = express()

app.use(express.json())

app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Resto API funcionando correctamente'
  })
})

app.use('/api/products', productsRouter)
app.use('/api/users', usersRouter)

app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Ruta no encontrada'
  })
})

export default app
