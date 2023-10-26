import _ from 'lodash';
import { responseConfig } from '../../config/index.js';
import { MapTree } from '../../utils/index.js';
import redisClient from '../../utils/redis.js';
import { adminLoginStrategies, validate } from '../../utils/validate.js';
import * as authModel from '../models/authModel.js';

// 用户登录的逻辑控制器
export const loginController = {
  method: 'post',
  handler: async (req, res) => {
    const response = _.cloneDeep(responseConfig);
    const errorMessage = validate(req.body, adminLoginStrategies)
    if (errorMessage) {
      response.message = errorMessage
      res.set('response-status', 'error')
      return res.json(response)
    }
    try {
      const { password, ..._data } = await authModel.verifyLogin(req.body)
      response.message = '登录成功'; response.data = _data
      res.json(response);
    } catch (error) {
      response.message = '用户名或密码不正确';
      res.set('response-status', 'error')
      res.json(response);
    }
  }
}

// 查询路由列表的逻辑控制器
export const getRoutesController = {
  method: 'post',
  handler: async (req, res, next) => {
    const response = _.cloneDeep(responseConfig);
    const roles = req.headers['roles']
    try {
      const hasRoutes = await redisClient.get('routes') // 读取redis缓存中的路由
      // 不存在缓存，执行sql查询数据库存入缓存后筛选路由返回
      if (!hasRoutes || hasRoutes === '') {
        const routes = await authModel.verifyRoles()
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
      console.error(error)
      response.message = '服务器内部错误';
      res.set('response-status', 'error')
      res.json(response);
    }
  }
}
