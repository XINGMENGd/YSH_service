import { verifyLogin, verifyRoles } from '../models/authModel.js';
import { MapTree } from '../utils/index.js'

export const loginController = (req, res) => {
  let response = { code: 0, message: '', data: null }

  verifyLogin(req.body, (error, data) => {
    if (data) {
      response.code = 200, response.message = '登录成功',
        response.data = {
          id: data.id,
          token: data.token,
          expires_at: data.expires_at,
          username: data.username,
          jurisdiction: data.jurisdiction
        }
      res.json(response);
    } else {
      // 登录验证失败
      response.code = 100, response.message = '用户名或密码不正确', response.data = error
      res.json(response);
    }
  });
};

export const fetchRouteController = (req, res) => {
  let response = { code: 0, message: '', data: null }

  verifyRoles(req.headers.authorization, (error, data) => {
    if (data) {
      // 登录验证成功
      // 进行其他操作，如返回登录成功的响应或生成用户的登录会话等
      const newList = MapTree(data)
      response.code = 200, response.message = '获取成功', response.data = newList
      res.json(response);
    } else {
      // 查询不到路由，用户权限不足
      response.code = 100, response.message = '用户权限不足', response.data = error
      res.json(response);
    }
  })
} 