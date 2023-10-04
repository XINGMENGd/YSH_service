import { insertVerifyCode, registerNewUser, verifyLogin, verifyRoles } from '../models/authModel.js';
import { MapTree } from '../utils/index.js'
import { sendVerifyCode } from '../utils/mailer.js'
import moment from 'moment/moment.js';

// 发送验证码的逻辑控制器
export const sendVerifyCodeController = async (req, res) => {
  let response = { code: 0, message: '', data: null }
  const verify_code = '123456'
  // const verify_code = String(Math.floor(Math.random() * 1000000)).padEnd(6, '0') // 生成6位随机验证码
  const created_at = moment().format('YYYY-MM-DD HH:mm:ss')
  const expires_at = moment().add(30, 'm').format('YYYY-MM-DD HH:mm:ss')
  req.body = {
    verify_code, created_at, expires_at, ...req.body
  }
  try {
    const insertResult = await insertVerifyCode(req.body); // 往数据库插入验证码
    if (!insertResult) {
      response.code = 100;
      response.message = '验证码数据插入失败';
      return res.json(response); // 终止发送验证码的后续逻辑
    }
    await sendVerifyCode(verify_code, '379890959@qq.com') // 执行插入sql后往用户邮箱发送验证码
    response.code = 200, response.message = '发送成功'
    res.json(response);
  } catch (error) {
    response.code = 100, response.message = '发送失败', response.data = error
    res.json(response);
  }
};

// 用户注册的逻辑控制器
export const registerController = async (req, res) => {
  let response = { code: 0, message: '', data: null }

  await registerNewUser(req.body)
    .then(data => {
      response.code = 200, response.message = '注册成功'
      res.json(response);
    })
    .catch(error => {
      response.code = 100, response.message = error
      res.json(response);
    })
};

// 用户登录的逻辑控制器
export const loginController = async (req, res) => {
  let response = { code: 0, message: '', data: null }

  await verifyLogin(req.body)
    .then(data => {
      response = {
        code: 200, message: '登录成功',
        data: {
          id: data.id,
          token: data.token,
          expires_at: data.expires_at,
          username: data.username,
          jurisdiction: data.jurisdiction
        }
      }
      res.json(response);
    })
    // 登录验证失败
    .catch(error => {
      response.code = 100, response.message = '用户名或密码不正确', response.data = error
      res.json(response);
    })
};

// 查询路由列表的逻辑控制器
export const fetchRouteController = async (req, res) => {
  let response = { code: 0, message: '', data: null }

  await verifyRoles(req.headers.authorization)
    .then(data => {
      const newList = MapTree(data)
      response.code = 200, response.message = '获取成功', response.data = newList
      res.json(response);
    })
    .catch(error => {
      // 查询不到路由，用户权限不足
      response.code = 100, response.message = '用户权限不足', response.data = error
      res.json(response);
    })
} 