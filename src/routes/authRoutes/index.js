import express from 'express'
import { sendVerifyEmailCodeController, registerEmailController, updateUserInfoController, loginController, fetchRouteController } from '../../controllers/authController.js';

const router = express.Router()

router.post('/sendVerifyEmailCode', sendVerifyEmailCodeController) // 发送邮箱验证码
router.post('/registerEmail', registerEmailController) // 邮箱用户注册
router.post('/updateUserInfo', updateUserInfoController) // 邮箱用户注册
router.post('/login', loginController) // 用户登录
router.get('/fetchRouteList', fetchRouteController) // 查询路由列表

export default router