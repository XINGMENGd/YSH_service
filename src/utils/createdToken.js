import jwt from 'jsonwebtoken';
import connection from '../config/mysql.js'
import { secretKey } from '../config/index.js'
import moment from 'moment/moment.js';

export default async function createdToken(userInfo, expires = '24h', callback) {
  const { id: userId, roles } = userInfo
  const token = jwt.sign({ userId }, secretKey, { expiresIn: expires });
  // 计算Token的过期时间
  const reg = /\b(\d+)([dhm])\b/
  const [, number, hourly_basis] = expires.match(reg)
  const formattedDate = moment().add(number, hourly_basis).format('YYYY-MM-DD HH:mm:ss')
  // 将Token、当前用户ID和过期时间存储到数据库
  connection.query(
    `INSERT INTO admin_auth_tokens
     ( token, user_id, expires_at, roles)
      VALUES
     ( '${token}', ${userId}, '${formattedDate}', '${roles}')`,
    (error, results) => {
      if (error) {
        return callback(error)
      }
      // 验证通过，生成 Token
      callback(null, { token, expires_at: formattedDate })
    }
  )
}