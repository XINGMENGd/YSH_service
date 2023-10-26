import createdToken from '../../utils/createdToken.js';
import db from '../../utils/mysql.js';
import { promisify } from 'util';
// 将 createToken 方法转换成 Promise 形式
const createdTokenPromisified = promisify(createdToken);

// 注册新用户
export const registerUser = (params) => {
  return new Promise(async (resolve, reject) => {
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
    try {
      const data = await db(sql, [email, password, email])
      if (data.affectedRows === 0) { return reject('该邮箱已注册') }
      resolve(data);
    } catch (error) {
      reject(error);
    }
  });
};

// 验证用户登录
export const verifyLogin = (params) => {
  return new Promise(async (resolve, reject) => {
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
    try {
      const data = await db(sql)
      if (!data.length) return reject('该账户不存在')
      const res = await createdTokenPromisified(data[0], '24h')
      data[0].token = res.token
      data[0].expires_at = res.expires_at
      resolve(data[0]);
    } catch (error) {
      reject(error)
    }
  })
};

// 验证用户验证码登录   似乎需要修改
export const verifyCodeLogin = (params) => {
  return new Promise(async (resolve, reject) => {
    const { loginId, verify_mode } = params;
    let condition = "";
    if (verify_mode == 'email') {
      condition = `email = '${loginId}'`
    } else if (verify_mode == 'phone') {
      condition = `phone_number = '${loginId}'`;
    }
    const sql = `SELECT * FROM frontend_users WHERE ${condition}`
    try {
      const data = await db(sql)
      if (!data.length) return reject(null)
      const res = await createdTokenPromisified(data[0], '24h')
      data[0].token = res.token
      data[0].expires_at = res.expires_at
      resolve(data[0]);
    } catch (error) {
      reject(error)
    }
  })
};

// 更新用户信息
export const updateUserInfo = (params) => {
  return new Promise(async (resolve, reject) => {
    const { id, frontend_id, ...updates } = params;
    const updateStatements = Object.entries(updates).map(([key, value]) => `${key} = '${value}'`);
    const sql = `UPDATE frontend_users SET ${updateStatements.join(', ')} WHERE id = ${id}`;
    try {
      const data = await db(sql)
      resolve(data);
    } catch (error) {
      reject(error);
    }
  });
};

