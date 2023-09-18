import jwt from 'jsonwebtoken';

// 白名单路径，即不需要校验 token 的路径
// 将白名单数组声明在拦截器外部，它在服务器启动时只会初始化一次，然后在所有请求中共享相同的白名单数组实例。这可以提高性能，因为不需要重复创建和初始化白名单数组。
const whitelist = ['/api/login', '/api/tt'];
export default function tokenAuth(req, res, next) {
  // 如果请求路径在白名单中，则直接通过，无需校验 token
  if (whitelist.includes(req.path)) {
    return next();
  }
  // 在这里可以编写你的 token 校验逻辑
  const token = req.headers.authorization;
  // 检查是否存在令牌

  if (!token) {
    return res.status(401).json({ code: 401, message: 'Missing token' });
  }
  // 在此处可以检查 token 是否有效，比如验证签名等
  next()
  // try {
  //   // 验证令牌
  //   const decodedToken = jwt.verify(token, 'your_secret_key');

  //   // 将用户信息附加到请求对象中
  //   req.user = decodedToken;

  //   // 接下来的中间件或路由处理程序可以使用 req.user 获取用户信息

  //   // 继续执行下一个中间件或路由处理程序
  //   next();
  // } catch (error) {
  //   return res.status(401).json({ message: 'Invalid token' });
  // }
};