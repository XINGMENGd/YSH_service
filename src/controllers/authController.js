import { insertVerifyEmailCode, registerEmailUser, updateUserInfo, verifyLogin, verifyRoles } from '../models/authModel.js';
import { MapTree, emailRegex } from '../utils/index.js'
import { sendVerifyCode } from '../utils/mailer.js'
import moment from 'moment/moment.js';

// 发送邮箱验证码的逻辑控制器
export const sendVerifyEmailCodeController = async (req, res) => {
  let response = { code: 0, message: '', data: null }
  const isValidEmail = emailRegex(req.body.email)
  if (!isValidEmail) {
    response.code = 200, response.message = '请输入正确的邮箱号'
    return res.json(response);
  }
  const verify_code = '123456'
  // const verify_code = String(Math.floor(Math.random() * 1000000)).padEnd(6, '0') // 生成6位随机验证码
  const created_at = moment().format('YYYY-MM-DD HH:mm:ss')
  const expires_at = moment().add(30, 'm').format('YYYY-MM-DD HH:mm:ss')
  req.body = { verify_code, created_at, expires_at, ...req.body }

  const insertResult = await insertVerifyEmailCode(req.body); // 往数据库插入邮箱验证码
  // 插入验证码错误，终止后续发送验证码
  if (!insertResult) {
    response.code = 100, response.message = '验证码数据插入失败';
    return res.json(response);
  }
  await sendVerifyCode(verify_code, req.body.email)
    .then(data => {
      response.code = 200, response.message = '发送成功'
      res.json(response);
    }) // 执行插入sql后往用户邮箱发送验证码
    .catch(error => {
      // console.log(error);
      response.code = 100, response.message = '发送失败', response.data = error
      res.json(response);
    })
};

// 邮箱用户注册的逻辑控制器
export const registerEmailController = async (req, res) => {
  let response = { code: 0, message: '', data: null }
  const isValidEmail = emailRegex(req.body.email)
  if (!isValidEmail) {
    response.code = 200, response.message = '请输入正确的邮箱号'
    return res.json(response);
  }
  await registerEmailUser(req.body)
    .then(data => {
      response.code = 200, response.message = '注册成功'
      res.json(response);
    })
    .catch(error => {
      response.code = 100, response.message = error
      res.json(response);
    })
};

// 更新用户信息的逻辑控制器
export const updateUserInfoController = async (req, res) => {
  let response = { code: 0, message: '', data: null }

  await updateUserInfo(req.body)
    .then(data => {
      response.code = 200, response.message = '更新成功'
      res.json(response);
    })
    .catch(error => {
      response.code = 100, response.message = error
      res.json(response);
    })
}

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