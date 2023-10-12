import { responseConfig } from '../../config/index.js';
import { MapTree } from '../../utils/index.js';
import redisClient from '../../utils/redis.js';
import { verifyLogin, verifyRoles } from '../models/authModel.js';
import _ from 'lodash';

// 深拷贝response对象，确保每个接口使用的是独立的response对象
const response = _.cloneDeep(responseConfig);
// 用户登录的逻辑控制器
export const loginController = {
  method: 'post',
  handler: (req, res) => {
    const { username, password } = req.body
    if (!username || !password) {
      response.message = '账号信息或密码不能为空'
      return res.json(response)
    }
    verifyLogin(req.body)
      .then(data => {
        const { password, ..._data } = data
        response.message = '登录成功'
        response.data = _data
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
      const roles = req.headers['roles']
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
