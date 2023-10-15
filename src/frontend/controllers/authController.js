import _ from 'lodash';
import { responseConfig } from '../../config/index.js';
import { emailRegex, phoneNumberRegex } from '../../utils/index.js';
import sendVerifyCode from '../../utils/mailer.js';
import redisClient from '../../utils/redis.js';
import * as authModel from '../models/authModel.js';

// 发送验证码的逻辑控制器
export const sendVerifyCodeController = {
  method: 'post',
  handler: async (req, res) => {
    const response = _.cloneDeep(responseConfig);
    const { email } = req.body
    // 检验邮箱格式是否正确
    if (!emailRegex(email)) {
      response.message = '请输入正确的邮箱号'
      return res.json(response);
    }
    const verify_code = '123456'
    // const verify_code = String(Math.floor(Math.random() * 1000000)).padEnd(6, '0') // 生成6位随机验证码
    await redisClient.set(email, verify_code) // 往redis写入邮箱验证码
    await redisClient.expire(email, 60 * 30) // 设置验证码过期时间
    // 发送验证码
    sendVerifyCode(email, verify_code)
      .then(data => {
        response.message = '发送成功'
        res.json(response);
      })
      .catch(error => {
        response.message = '发送失败', response.data = error
        res.json(response);
      })
  }
}

// 用户注册的逻辑控制器
export const registerController = {
  method: 'post',
  handler: async (req, res) => {
    const response = _.cloneDeep(responseConfig);
    const { email, verify_code } = req.body
    if (!emailRegex(email)) {
      response.message = '请输入正确的邮箱号'
      return res.json(response);
    }
    // 从redis查询验证码是否有效
    const value = await redisClient.get(email)
    if (verify_code == value) {
      // 注册新用户
      authModel.registerUser(req.body)
        .then(data => {
          response.message = '注册成功'
          res.json(response);
        })
        .catch(error => {
          response.message = error
          res.json(response);
        })
    } else {
      response.message = '验证码错误或已过期'
      res.json(response);
    }
  }
}

// 用户登录的逻辑控制器
export const loginController = {
  method: 'post',
  handler: (req, res) => {
    const response = _.cloneDeep(responseConfig);
    const { loginId, password } = req.body
    if (!loginId || !password) {
      response.message = '用户信息或密码不能为空'
      return res.json(response)
    }
    // 判断登录类型  1.邮箱登录 2.用户名登录
    let verify_mode = ''
    if (emailRegex(loginId)) {
      verify_mode = 'email'
    } else {
      verify_mode = 'username'
    }
    req.body.verify_mode = verify_mode
    authModel.verifyLogin(req.body)
      .then(data => {
        const { password, ..._data } = data
        response.message = '登录成功'; response.data = _data;
        res.json(response);
      })
      .catch(error => {
        response.message = '用户信息或密码错误'; response.data = error;
        res.json(response);
      })
  }
}

// 用户验证码登录的逻辑控制器
export const verifyCodeLoginController = {
  method: 'post',
  handler: async (req, res) => {
    const response = _.cloneDeep(responseConfig);
    const { loginId, verify_code } = req.body
    if (!emailRegex(loginId)) {
      response.message = '请输入正确的邮箱号'
      return res.json(response);
    } else if (!verify_code) {
      response.message = '请输入验证码'
      return res.json(response);
    }
    const value = await redisClient.get(loginId)
    if (verify_code == value) {
      // 判断验证码登录类型  1.邮箱验证码登录 2.手机验证码登录
      let verify_mode = ''
      if (emailRegex(loginId)) {
        verify_mode = 'email'
      } else if (phoneNumberRegex(loginId)) {
        verify_mode = 'phone'
      }
      req.body.verify_mode = verify_mode
      authModel.verifyCodeLogin(req.body)
        .then(data => {
          const { password, ..._data } = data
          response.message = '登录成功'; response.data = _data;
          res.json(response);
        })
        .catch(error => {
          response.message = '登录失败'; response.data = error;
          res.json(response);
        })
    } else {
      response.message = '验证码错误或已过期'
      res.json(response);
    }
  }
}

// 更新用户信息的逻辑控制器
export const updateUserInfoController = {
  method: 'post',
  handler: (req, res) => {
    const response = _.cloneDeep(responseConfig);
    const { id, frontend_id, ...updates } = req.body;
    const user_identifier = req.headers['user-identifier']
    if (!id) {
      response.message = '请携带更新用户标识'
      return res.json(response)
    } else if (!Object.keys(updates).length) {
      response.message = '请携带需更新的用户信息'
      return res.json(response)
    } else if (user_identifier !== id) {
      response.message = '请勿尝试篡改他人信息'
      return res.json(response)
    }
    authModel.updateUserInfo(req.body)
      .then(data => {
        response.message = '更新成功'
        res.json(response);
      })
      .catch(error => {
        response.message = error
        res.json(response);
      })
  }
}