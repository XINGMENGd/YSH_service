import express from 'express'
import { sendVerifyCodeController, registerController, loginController, fetchRouteController } from '../../controllers/authController.js';

const router = express.Router()

router.post('/sendVerifyCode', sendVerifyCodeController) // 发送验证码
router.post('/register', registerController) // 用户注册
router.post('/login', loginController) // 用户登录
router.get('/fetchRouteList', fetchRouteController) // 查询路由列表

export default router