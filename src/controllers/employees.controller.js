import { employeesService } from '../services/employees.service.js'

export const obtenerEmpleados = async (req, res, next) => {
  try {
    const resultado = await employeesService.obtenerEmpleados(req.query)

    res.status(200).json({
      status: 'success',
      payload: resultado.payload,
      pagination: resultado.pagination
    })
  } catch (error) {
    next(error)
  }
}

export const obtenerEmpleadosActivos = async (req, res, next) => {
  try {
    const resultado = await employeesService.obtenerEmpleadosActivos(req.query)

    res.status(200).json({
      status: 'success',
      payload: resultado.payload,
      pagination: resultado.pagination
    })
  } catch (error) {
    next(error)
  }
}

export const obtenerEmpleadoPorId = async (req, res, next) => {
  try {
    const { eid } = req.params

    const empleado = await employeesService.obtenerEmpleadoPorId(eid)

    res.status(200).json({
      status: 'success',
      payload: empleado
    })
  } catch (error) {
    next(error)
  }
}

export const crearEmpleado = async (req, res, next) => {
  try {
    const empleado = await employeesService.crearEmpleado(req.body)

    res.status(201).json({
      status: 'success',
      payload: empleado
    })
  } catch (error) {
    next(error)
  }
}

export const actualizarEmpleado = async (req, res, next) => {
  try {
    const { eid } = req.params

    const empleado = await employeesService.actualizarEmpleado(eid, req.body)

    res.status(200).json({
      status: 'success',
      payload: empleado
    })
  } catch (error) {
    next(error)
  }
}

export const eliminarEmpleado = async (req, res, next) => {
  try {
    const { eid } = req.params

    const empleado = await employeesService.eliminarEmpleado(eid)

    res.status(200).json({
      status: 'success',
      payload: empleado
    })
  } catch (error) {
    next(error)
  }
}
