import createdToken from '../../utils/createdToken.js';
import db from '../../utils/mysql.js';
import { promisify } from 'util';
// 将 createToken 方法转换成 Promise 形式
const createdTokenPromisified = promisify(createdToken);

// 验证用户登录
export const verifyLogin = (params) => {
  return new Promise(async (resolve, reject) => {
    const { username, password } = params;
    const sql = `SELECT * FROM admin_users WHERE username = ? AND password = ?`;
    try {
      const data = await db(sql, [username, password])
      if (!data.length) return reject(null)
      const res = await createdTokenPromisified(data[0], '24h');
      data[0].token = res.token;
      data[0].expires_at = res.expires_at;
      resolve(data[0])
    } catch (error) {
      reject(error)
    }
  })
};

// 验证用户权限返回路由
export const verifyRoles = () => {
  return new Promise(async (resolve, reject) => {
    const sql = `SELECT * FROM route_menu`;
    try {
      const data = await db(sql)
      resolve(data)
    } catch (error) {
      reject(error)
    }
  })
};