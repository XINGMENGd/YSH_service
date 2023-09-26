import jwt from 'jsonwebtoken';
import connection from '../config/mysql/index.js'
import { secretKey } from '../config/index.js'

// 白名单路径，即不需要校验 token 的路径
// 将白名单数组声明在拦截器外部，它在服务器启动时只会初始化一次，然后在所有请求中共享相同的白名单数组实例。这可以提高性能，因为不需要重复创建和初始化白名单数组。
const whitelist = ['/api/login'];
export default function tokenAuth(req, res, next) {
  // 如果请求路径在白名单中，则直接通过，无需校验 token
  if (whitelist.includes(req.path) || req.path.includes('/upload')) {
    return next();
  }
  // 在这里可以编写你的 token 校验逻辑
  const token = req.headers.authorization;
  // 检查是否存在令牌
  if (!token) {
    return res.status(401).json({ code: 401, message: 'Missing token' });
  }
  // 在此处可以检查 token 是否有效，比如验证签名等
  jwt.verify(token, secretKey, (err, decoded) => {
    // if (err) return res.status(401).send('Invalid token.');

    // 基于解码后的 Token 信息查询数据库获取Token信息
    connection.query(
      `SELECT * FROM auth_tokens WHERE token = '${token}'`,
      (error, results) => {
        if (error) {
          console.error('Error validating token:', error);
          res.status(500).send('Error validating token.');
        }

        if (results.length === 0) {
          res.status(401).send('Invalid token.');
        } else {
          const { expires_at: expiresAt } = results[0];
          // 检查Token过期时间是否在当前时间之后
          if (new Date(expiresAt) < new Date()) {
            res.status(401).send('Token expired.');
          } else {
            req.user = decoded;
            next();
          }
        }
      })
  });
};
