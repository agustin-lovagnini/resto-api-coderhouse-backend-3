import { employeesService } from '../services/employees.service.js'

export const obtenerEmpleados = async (req, res) => {
  try {
    const empleados = await employeesService.obtenerEmpleados()

    res.status(200).json({
      status: 'success',
      payload: empleados
    })
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    })
  }
}

export const obtenerEmpleadosActivos = async (req, res) => {
  try {
    const empleados = await employeesService.obtenerEmpleadosActivos()

    res.status(200).json({
      status: 'success',
      payload: empleados
    })
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    })
  }
}

export const obtenerEmpleadoPorId = async (req, res) => {
  try {
    const { eid } = req.params

    const empleado = await employeesService.obtenerEmpleadoPorId(eid)

    res.status(200).json({
      status: 'success',
      payload: empleado
    })
  } catch (error) {
    res.status(404).json({
      status: 'error',
      message: error.message
    })
  }
}

export const crearEmpleado = async (req, res) => {
  try {
    const empleado = await employeesService.crearEmpleado(req.body)

    res.status(201).json({
      status: 'success',
      payload: empleado
    })
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    })
  }
}

export const actualizarEmpleado = async (req, res) => {
  try {
    const { eid } = req.params

    const empleado = await employeesService.actualizarEmpleado(eid, req.body)

    res.status(200).json({
      status: 'success',
      payload: empleado
    })
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    })
  }
}

export const eliminarEmpleado = async (req, res) => {
  try {
    const { eid } = req.params

    const empleado = await employeesService.eliminarEmpleado(eid)

    res.status(200).json({
      status: 'success',
      payload: empleado
    })
  } catch (error) {
    res.status(404).json({
      status: 'error',
      message: error.message
    })
  }
}
