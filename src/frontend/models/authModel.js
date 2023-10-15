import createdToken from '../../utils/createdToken.js';
import connection from '../../utils/mysql.js';

// 注册新用户
export const registerUser = (params) => {
  return new Promise((resolve, reject) => {
    const { email, password } = params;
    const sql = `
      INSERT INTO frontend_users (email, password)
        SELECT ?, ?
        FROM DUAL
      WHERE NOT EXISTS (
        SELECT *
        FROM frontend_users
        WHERE email = ?
      )
    `;

    connection.query(sql, [email, password, email], (error, results) => {
      if (error) {
        return reject(error);
      }
      if (results.affectedRows === 0) {
        return reject('该邮箱已注册');
      }
      resolve(results);
    });
  });
};

// 验证用户登录
export const verifyLogin = (params) => {
  return new Promise((resolve, reject) => {
    const { loginId, password, verify_mode } = params;
    let condition = "";
    if (verify_mode == 'email') {
      condition = `email = '${loginId}'`
    } else {
      condition = `username = '${loginId}'`;
    }
    const sql = `
      SELECT * FROM frontend_users 
        WHERE
      ${condition} AND password = ${password}
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

// 验证用户验证码登录
export const verifyCodeLogin = (params) => {
  return new Promise((resolve, reject) => {
    const { loginId, verify_mode } = params;
    let condition = "";
    if (verify_mode == 'email') {
      condition = `email = '${loginId}'`
    } else if (verify_mode == 'phone') {
      condition = `phone_number = '${loginId}'`;
    }
    const sql = `SELECT * FROM frontend_users WHERE ${condition}`

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

// 更新用户信息
export const updateUserInfo = (params) => {
  return new Promise((resolve, reject) => {
    const { id, frontend_id, ...updates } = params;
    const updateStatements = Object.entries(updates).map(([key, value]) => `${key} = '${value}'`);
    const sql = `UPDATE frontend_users SET ${updateStatements.join(', ')} WHERE id = ${id}`;

    connection.query(sql, (error, results) => {
      if (error) {
        return reject(error);
      }
      resolve(results);
    });
  });
};

