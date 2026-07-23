import { Router } from 'express'
import {
  actualizarEmpleado,
  crearEmpleado,
  eliminarEmpleado,
  obtenerEmpleadoPorId,
  obtenerEmpleados,
  obtenerEmpleadosActivos
} from '../controllers/employees.controller.js'

const router = Router()

router.get('/', obtenerEmpleados)
router.get('/activos', obtenerEmpleadosActivos)
router.get('/:eid', obtenerEmpleadoPorId)
router.post('/', crearEmpleado)
router.put('/:eid', actualizarEmpleado)
router.delete('/:eid', eliminarEmpleado)

export default router
