import { Router } from 'express'
import {
  actualizarUsuario,
  crearUsuario,
  eliminarUsuario,
  obtenerUsuarioPorId,
  obtenerUsuarios
} from '../controllers/users.controller.js'

const router = Router()

router.get('/', obtenerUsuarios)
router.get('/:uid', obtenerUsuarioPorId)
router.post('/', crearUsuario)
router.put('/:uid', actualizarUsuario)
router.delete('/:uid', eliminarUsuario)

export default router
