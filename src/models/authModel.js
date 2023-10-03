import connection from '../config/mysql/index.js'
import createdToken from '../utils/createdToken.js'

// 验证用户登录
export const verifyLogin = (params, callback) => {
  const { username, password } = params;
  const sql = `
    SELECT * FROM admin_users 
      WHERE
    username = '${username}' AND password = ${password}
  `

  connection.query(sql, (error, results) => {
    if (error) {
      return callback(error);
    }
    // 验证通过，生成 Token
    results.length !== 0 ? createdToken(results[0], '1d', (error, data) => {
      if (error) {
        console.log('error:', error);
      }
      results[0].token = data.token
      results[0].expires_at = data.expires_at
      callback(null, results[0]);
    }) : callback(null)
  });
};

// 验证用户权限返回路由
export const verifyRoles = (token, callback) => {
  const sql = `
    SELECT r.*  FROM route_menu r
	    JOIN 
    (SELECT roles FROM auth_tokens WHERE token = '${token}' ) a
      ON
     r.roles LIKE CONCAT( '%', a.roles, '%');
  `

  connection.query(sql, (error, results) => {
    if (error) {
      return callback(error);
    }
    callback(null, results);
  });
};