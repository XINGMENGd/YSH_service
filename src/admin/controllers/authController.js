import { verifyLogin, verifyRoles } from '../models/authModel.js';
import { response } from '../../config/index.js'
import { MapTree } from '../../utils/index.js'
import redisClient from '../../utils/redis.js'

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
