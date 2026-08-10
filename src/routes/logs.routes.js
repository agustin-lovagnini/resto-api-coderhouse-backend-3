import { Router } from 'express'
import { probarLogger } from '../controllers/logs.controller.js' //* traemos el controller que probara los logs

const router = Router()

router.get('/test', probarLogger)

export default router