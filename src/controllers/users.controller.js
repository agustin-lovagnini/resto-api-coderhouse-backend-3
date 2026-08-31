import { usersService } from '../services/users.service.js'

export const obtenerUsuarios = async (req, res, next) => {
  try {
    const usuarios = await usersService.obtenerUsuarios()

    res.status(200).json({
      status: 'success',
      payload: usuarios
    })
  } catch (error) {
    next(error)
  }
}

export const obtenerUsuarioPorId = async (req, res, next) => {
  try {
    const { uid } = req.params

    const usuario = await usersService.obtenerUsuarioPorId(uid)

    res.status(200).json({
      status: 'success',
      payload: usuario
    })
  } catch (error) {
    next(error)
  }
}

export const crearUsuario = async (req, res, next) => {
  try {
    const usuario = await usersService.crearUsuario(req.body)

    res.status(201).json({
      status: 'success',
      payload: usuario
    })
  } catch (error) {
    next(error)
  }
}

export const actualizarUsuario = async (req, res, next) => {
  try {
    const { uid } = req.params

    const usuario = await usersService.actualizarUsuario(uid, req.body)

    res.status(200).json({
      status: 'success',
      payload: usuario
    })
  } catch (error) {
    next(error)
  }
}

export const subirDocumentoUsuario = async (req, res, next) => {
  try {
    const { uid } = req.params
    const { tipoDocumento } = req.body

    const usuario = await usersService.subirDocumentoUsuario(
      uid,
      req.file,
      tipoDocumento
    )

    res.status(200).json({
      status: 'success',
      message: 'Documento cargado correctamente',
      payload: usuario
    })
  } catch (error) {
    next(error)
  }
}

export const eliminarUsuario = async (req, res, next) => {
  try {
    const { uid } = req.params

    const usuario = await usersService.eliminarUsuario(uid)

    res.status(200).json({
      status: 'success',
      payload: usuario
    })
  } catch (error) {
    next(error)
  }
}