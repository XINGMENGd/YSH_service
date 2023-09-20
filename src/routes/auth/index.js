import express from 'express'
import { loginController, fetchRouteController } from '../../controllers/auth.js';

const router = express.Router()

// 用户登录
router.post('/login', loginController)

// 查询路由数据 
router.post('/FetchRouteList', fetchRouteController)

export default router