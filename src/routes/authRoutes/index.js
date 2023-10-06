import express from 'express'
import { sendVerifyCodeController, registerController, updateUserInfoController, loginController, getRoutesController } from '../../controllers/authController.js';

const router = express.Router()

router.post('/sendVerifyCode', sendVerifyCodeController) // 发送验证码
router.post('/register', registerController) // 用户注册
router.post('/updateUserInfo', updateUserInfoController) // 用户信息更新
router.post('/login', loginController) // 用户登录
router.post('/getRoutes', getRoutesController) // 查询路由列表

export default router