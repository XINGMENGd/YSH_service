import connection from '../config/mysql/index.js'
import createdToken from '../utils/createdToken.js'

// 插入验证码
export const insertVerifyCode = (params) => {
  return new Promise((resolve, reject) => {
    const { number: affiliation, send_mode, verify_code, created_at, expires_at } = params;
    const sql = `
      INSERT INTO verify_codes
        (affiliation, send_mode, verify_code, created_at, expires_at)
      VALUES
        (?, ?, ?, ?, ?)
    `;

    connection.query(sql, [affiliation, send_mode, verify_code, created_at, expires_at], (error, results) => {
      if (error) {
        return reject(error);
      }
      resolve(results);
    });
  })
};

// 注册新用户
export const registerNewUser = (params) => {
  return new Promise((resolve, reject) => {
    const { phone, email, password, verify_code } = params;
    const sql = `
      INSERT INTO frontend_users
        (email, password)
      SELECT ?, ? FROM dual
        WHERE NOT EXISTS (
      SELECT * FROM frontend_users WHERE email = ?
        )
    `;

    connection.query(sql, [email, password, email], (error, results) => {
      if (error) {
        return reject(error);
      }
      if (results.affectedRows === 0) {
        return reject('该邮箱已注册');
      } else {
        resolve(results);
      }
    })
  })
};

// 验证用户登录
export const verifyLogin = (params) => {
  return new Promise((resolve, reject) => {
    const { username, password } = params;
    const sql = `
      SELECT * FROM admin_users 
        WHERE
      username = '${username}' AND password = ${password}
    `

    connection.query(sql, (error, results) => {
      if (error) {
        return reject(error);
      }
      // 验证通过，生成 Token
      results.length !== 0 ? createdToken(results[0], '24h', (error, data) => {
        if (error) {
          console.log('error:', error);
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
export const verifyRoles = (token) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT r.*  FROM route_menu r
        JOIN 
      (SELECT roles FROM auth_tokens WHERE token = '${token}' ) a
        ON
      r.roles LIKE CONCAT( '%', a.roles, '%');
    `

    connection.query(sql, (error, results) => {
      if (error) {
        return reject(error);
      }
      resolve(results);
    });
  })
};