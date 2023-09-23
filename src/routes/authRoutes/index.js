import express from 'express'
import { loginController, fetchRouteController } from '../../controllers/authController.js';

const router = express.Router()

// 用户登录
router.post('/login', loginController)

// 查询路由数据 
router.get('/FetchRouteList', fetchRouteController)

export default router