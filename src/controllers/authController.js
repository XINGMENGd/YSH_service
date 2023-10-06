import { registerUser, updateUserInfo, verifyLogin, verifyRoles } from '../models/authModel.js';
import { MapTree, emailRegex } from '../utils/index.js'
import { sendVerifyCode } from '../utils/mailer.js'
import redisClient from '../utils/redis.js'
import { response } from '../config/index.js'

// 发送验证码的逻辑控制器
export const sendVerifyCodeController = {
  method: 'post',
  handler: async (req, res) => {
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
    await sendVerifyCode(email, verify_code)
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
    const { email, verify_code } = req.body
    if (!emailRegex(email)) {
      response.message = '请输入正确的邮箱号'
      return res.json(response);
    }
    // 从redis查询验证码是否有效
    const value = await redisClient.get(email)
    if (verify_code == value) {
      // 注册新用户
      registerUser(req.body)
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

// 更新用户信息的逻辑控制器
export const updateUserInfoController = {
  method: 'post',
  handler: (req, res) => {
    updateUserInfo(req.body)
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

// 用户登录的逻辑控制器
export const loginController = {
  method: 'post',
  handler: (req, res) => {
    verifyLogin(req.body)
      .then(data => {
        response.message = '登录成功'
        response.data = {
          id: data.id,
          token: data.token,
          expires_at: data.expires_at,
          username: data.username,
          roles: data.roles
        }
        res.json(response);
      })
      .catch(error => {
        response.message = '用户名或密码不正确', response.data = error
        res.json(response);
      })
  }
}

// 查询路由列表的逻辑控制器
export const getRoutesController = {
  method: 'post',
  handler: async (req, res) => {
    try {
      const { roles } = req.body
      // 读取redis缓存中的路由
      const hasRoutes = await redisClient.get('routes')
      if (!hasRoutes || hasRoutes === '') {
        // 不存在缓存，执行sql查询数据库存入缓存后筛选路由返回
        const routes = await verifyRoles()
        await redisClient.set('routes', JSON.stringify(routes))
        const filteredRoutes = routes.filter((route) => route.roles.includes(roles));
        response.message = '获取成功'; response.data = MapTree(filteredRoutes)
        res.json(response)
      } else {
        // 存在缓存，读取并筛选路由返回
        const filteredRoutes = JSON.parse(hasRoutes).filter((route) => route.roles.includes(roles));
        response.message = '获取成功'; response.data = MapTree(filteredRoutes)
        res.json(response)
      }
    } catch (error) {
      response.message = '服务器内部错误'; response.data = error;
      res.json(response);
    }
  }
}
