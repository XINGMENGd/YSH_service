import { verifyLogin, verifyRoles } from '../models/auth.js';
import { MapTree } from '../utils/index.js'

export const loginController = (req, res) => {
  const { username, password } = req.body;
  let response = { code: 0, message: '', data: null }

  verifyLogin(username, password, (error, data) => {
    if (error) {
      return res.status(500).json(error);
    }

    if (data) {
      // 登录验证成功
      // 进行其他操作，如返回登录成功的响应或生成用户的登录会话等
      response = {
        code: 200, message: '登录成功', data: {
          token: data.username == 'admin' ? '64000019741229721X' : '64000019741229721Y',
          username: data.username,
          jurisdiction: data.jurisdiction
        }
      }
      res.json(response);
    } else {
      // 登录验证失败
      response = { ...response, code: 100, message: '用户名或密码不正确', }
      res.json(response);
    }
  });
};

export const fetchRouteController = (req, res) => {
  const roles = req.headers.authorization.slice(-1) == 'X' ? '01' : '02'
  let response = { code: 0, message: '', data: null }

  verifyRoles(roles, (error, data) => {
    if (error) {
      return res.status(500).json({ message: '登录验证失败' });
    }

    if (data) {
      // 登录验证成功
      // 进行其他操作，如返回登录成功的响应或生成用户的登录会话等
      const newList = MapTree(data)
      response = { code: 200, message: 'OK', data: newList }
      res.json(response);
    } else {
      // 登录验证失败
      response = { ...response, code: 100, message: '用户权限不足', }
      res.json(response);
    }
  })
}