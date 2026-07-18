import { usersService } from '../services/users.service.js'

export const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await usersService.obtenerUsuarios()

    res.status(200).json({
      status: 'success',
      payload: usuarios
    })
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    })
  }
}

export const obtenerUsuarioPorId = async (req, res) => {
  try {
    const { uid } = req.params

    const usuario = await usersService.obtenerUsuarioPorId(uid)

    res.status(200).json({
      status: 'success',
      payload: usuario
    })
  } catch (error) {
    res.status(404).json({
      status: 'error',
      message: error.message
    })
  }
}

export const crearUsuario = async (req, res) => {
  try {
    const usuario = await usersService.crearUsuario(req.body)

    res.status(201).json({
      status: 'success',
      payload: usuario
    })
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    })
  }
}

export const actualizarUsuario = async (req, res) => {
  try {
    const { uid } = req.params

    const usuario = await usersService.actualizarUsuario(uid, req.body)

    res.status(200).json({
      status: 'success',
      payload: usuario
    })
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    })
  }
}

export const eliminarUsuario = async (req, res) => {
  try {
    const { uid } = req.params

    const usuario = await usersService.eliminarUsuario(uid)

    res.status(200).json({
      status: 'success',
      payload: usuario
    })
  } catch (error) {
    res.status(404).json({
      status: 'error',
      message: error.message
    })
  }
}
