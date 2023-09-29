import express from 'express'
import { loginController, fetchRouteController } from '../../controllers/authController.js';

const router = express.Router()

router.post('/login', loginController) // 用户登录
router.get('/FetchRouteList', fetchRouteController) // 查询路由列表

export default router