import createdToken from '../../utils/createdToken.js';
import connection from '../../utils/mysql.js';

// 验证用户登录
export const verifyLogin = (params) => {
  return new Promise((resolve, reject) => {
    const { username, password } = params;
    const sql = `SELECT * FROM admin_users WHERE username = ? AND password = ?`
    
    connection.query(sql, [username, password], (error, results) => {
      if (error) {
        return reject(error);
      }
      // 验证通过，生成 Token
      results.length !== 0 ? createdToken(results[0], '24h', (error, data) => {
        if (error) {
          return reject(error)
        }
        results[0].token = data.token
        results[0].expires_at = data.expires_at
        resolve(results[0]);
      }) : reject(null) // 查询不到该用户(sql执行无误，但没有用户信息)
    });
  })
};

// 验证用户权限返回路由
export const verifyRoles = () => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM route_menu`

    connection.query(sql, (error, results) => {
      if (error) {
        return reject(error);
      }
      resolve(results);
    });
  })
};