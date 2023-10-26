import jwt from 'jsonwebtoken';
import { secretKey } from '../config/index.js';

// 白名单路径，即不需要校验 token 的路径
// 将白名单数组声明在拦截器外部，它在服务器启动时只会初始化一次，然后在所有请求中共享相同的白名单数组实例。这可以提高性能，因为不需要重复创建和初始化白名单数组。
const whitelist = [
  '/login', '/verifyCodeLogin', '/sendVerifyCode', '/register', '/getProductList'
];

export default function tokenAuth(req, res, next) {
  // 如果请求路径在白名单中，则直接通过，无需校验 token
  const prefixRegex = /^(\/adminApi|\/frontendApi)(\/.*)$/;
  const path = req.path.match(prefixRegex)?.[2]
  if (whitelist.includes(path) || req.path.includes('/uploads')) {
    return next();
  }
  // 在这里可以编写你的 token 校验逻辑
  const token = req.headers.authorization;
  // 检查是否存在令牌
  if (!token) {
    return res.json({ code: 401, message: 'Missing token' });
  }
  // 在此处可以检查 token 是否有效，比如验证签名等
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) return res.json({ code: 401, message: 'Invalid token' });
    if (decoded && decoded.userId == req.headers['user-identifier']) {
      req.headers.roles = decoded.roles
      next()
    } else {
      res.json({ code: 401, message: 'token无效' })
    }
  });
};
